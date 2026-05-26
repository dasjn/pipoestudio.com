# Arquitectura — Fugu Portfolio 3D

## Diagrama de capas

```
┌─────────────────────────────────────────────────────┐
│  [locale]/page.tsx  (Server Component, SSR)          │
│  - Fetches Sanity data (posts, home, products)       │
│  - Builds sectionsData object                        │
│  - Renders: Header + InicioSection + ThreeDCanvas    │
└────────────────────┬────────────────────────────────┘
                     │ sectionsData prop
┌────────────────────▼────────────────────────────────┐
│  ThreeDCanvas.tsx  (Client Component)                │
│  - R3F <Canvas> fixed, z-index=-10 (background)      │
│  - useWheelNavigation() → wheel/touch → store        │
│  - CameraController (inner component, useFrame)      │
│  - Reads activeAnimation from store → animationCtrl  │
│  - onTransitionComplete → setTransitioning(false)    │
└──────────┬──────────────────┬───────────────────────┘
           │                  │
    R3F Camera         ┌──────▼──────────────────────┐
    (lerp each frame)  │  Shelves.tsx / Model         │
                       │  - useGLTF (v25.glb)         │
                       │  - Custom AnimationMixer     │
                       │  - useFacialAnimations()     │
                       │  - BoundedHtml overlays       │
                       │  - FotoTexture (useTexture)  │
                       │  - onAnimationComplete→store  │
                       └─────────────────────────────┘
```

---

## navigationStore.ts — Estado global (Zustand)

### Estado principal

```typescript
currentSection: SectionId        // sección activa
isTransitioning: boolean         // bloquea navegación durante camera lerp
isScrolling: boolean             // bloquea observer durante scroll programático
isAnimationSequenceActive: bool  // bloquea animaciones de cara
navigationDirection: 'down'|'up'|null
isModelReady: boolean            // true cuando Model ha hecho su primer render (GLB en escena)
setModelReady: () => void        // llamado por Model.useEffect → desbloquea SplashScreen

// Animation state machine
currentIdle: IdleState           // idle actualmente activo en el modelo
activeAnimation: string          // animación enviada al componente 3D
pendingIdle: IdleState | null    // idle que se aplicará al completar la anim actual
animationQueue: QueuedAnimation[] // cola de transiciones pendientes
```

### Flujo de navegación (navigateToSection / navigateNext)

```
1. Usuario scrollea / swipe
   → useWheelNavigation → navigateNext() / navigatePrevious()

2. navigateToSection(targetSection, direction)
   → Calcula virtualIdle (último de la cola o pendingIdle o currentIdle)
   → Busca exitIdle en sectionTransitions[currentSection][direction]
   → Si virtualIdle ≠ exitIdle: busca animation en transitionAnimations
   → Añade {animation, targetIdle} a animationQueue
   → set({ isTransitioning: true, currentSection: target })
   → Si !isAnimationSequenceActive → processAnimationQueue()

3. processAnimationQueue()
   → Si cola vacía: set({ activeAnimation: currentIdle, isSequenceActive: false })
   → Si hay items: saca el primero → set({ activeAnimation: anim, isSequenceActive: true, pendingIdle })

4. Shelves recibe animationControls con activeAnimation=true
   → Mixer detiene todo → inicia nueva animación
   → useFrame mide tiempo → cuando elapsed >= duration → onAnimationComplete(name)

5. onAnimationComplete(name)
   → set({ currentIdle: pendingIdle })
   → processAnimationQueue() (siguiente en cola o volver a idle)

6. CameraController lerp llega al destino
   → onTransitionComplete → setTransitioning(false) → desbloquea navegación
```

### scrollToSection (navegación desde header)

Igual que navigateToSection pero itera TODOS los tramos entre sección actual y destino,
construyendo la cola completa de animaciones de una vez. Permite saltar múltiples secciones.

---

## CameraController — Detalles de implementación

```typescript
// Umbrales de "llegada" (transición completa)
positionDistance < 0.01
lookAtDistance < 0.01
fovDifference < 0.1

// Se resetea si se aleja más de:
positionDistance > 0.1 || lookAtDistance > 0.1 || fovDifference > 1

// transitionSpeed = 0.025 (lerp por frame)
```

FOV dinámico (calculateDynamicFov):
- `< 768px` → baseFov × 2.8
- `768–1023px` → baseFov × 2.4
- `1024–1439px` → baseFov × 2.0
- `≥ 1440px` → baseFov × 1.0

---

## Custom AnimationMixer — Shelves.tsx

El componente **NO** usa las `actions` de `useAnimations`. Crea su propio mixer:

```typescript
animationMixer.current = new THREE.AnimationMixer(group.current)
blendedActions.current[anim.name] = mixer.clipAction(animation)
```

**Detección de fin de animación (time-based):**
```typescript
// Al iniciar animación no-loop:
animationStartTimes.current[name] = Date.now()

// En useFrame:
elapsedTime = (Date.now() - startTime) / 1000
if (elapsedTime >= animationDurations[name]) → onAnimationComplete(name)
```

---

## useFacialAnimations — Mixer independiente

- Mixer **separado** del principal (evita conflictos con transitions)
- Pool: `["C-Cachondo", "C-Enfadado", "C-Jugueton"]`
- No repite la última animación jugada consecutivamente
- Timing: setTimeout random entre 2000-5000ms
- Pausa durante `isAnimationSequenceActive` (cancela timer, pero la anim en curso termina sola)
- Reanuda cuando `isAnimationSequenceActive` vuelve a false

---

## BoundedHtml — Proyección 3D→2D

```
useFrame():
  tl = Vector3(px - PLANE_W/2, py + PLANE_H/2, pz).project(camera)
  br = Vector3(px + PLANE_W/2, py - PLANE_H/2, pz).project(camera)

  w = |(br.x - tl.x) / 2| * viewport.width   (NDC → píxeles)
  h = |(tl.y - br.y) / 2| * viewport.height
  scale = w / REF_W  (600px)

  outerDiv.style = { width: w, height: h, overflow: hidden }
  innerDiv.transform = translate(-50%, -50%) scale(scale)
```

El contenido se diseña siempre a 600×REF_H px. La escala lo adapta al tamaño real.

**Valores actuales:**
- `PLANE_W = 4.6` (calibrado al ancho interior real del slot del mueble)
- `PLANE_H = 1.889`
- `REF_W = 600`, `REF_H = Math.round(600 * PLANE_H / PLANE_W)`

**Levers de ajuste:**
| Quiero...                          | Cambiar...                        |
|------------------------------------|-----------------------------------|
| Contenido más grande en pantalla   | Bajar REF_W (ej. 500 → más zoom)  |
| Contenido más pequeño              | Subir REF_W                       |
| Llenar más el ancho del slot       | Subir PLANE_W                     |
| Contenido se sale por los lados    | Bajar PLANE_W                     |
| Texto más grande (sin recorte)     | Bajar REF_W O bajar font-size     |

⚠️ El `overflow: hidden` en outerRef recorta todo lo que supere la altura proyectada (`h`). Si el texto crece verticalmente y se recorta, la solución NO es subir font-size — hay que bajar REF_W o reducir el texto.

---

## useWheelNavigation — Anti-rebote

```
Debounce: 800ms entre navegaciones (lastActionTime ref)
isNavigating ref: se activa 100ms por navegación
isTransitioning: leído del store (bloqueo externo)

Desktop: wheel event (passive:false, preventDefault)
Mobile:  touchstart/move/end (passive:false, preventDefault en move/end)
         minSwipeDistance: 80px
         hasNavigated: evita múltiples disparos por toque
         isInUIArea(): permite scroll normal en header/mobile-menu
```

---

## Sanity CMS integration

- **Queries** en `sanity/lib/queries.ts`
- **sanityFetch** wrapper con soporte draft mode
- **SanityLive** en layout.tsx para actualizaciones en tiempo real
- Tipos de sección en home.sections: `inicioSection`, `manifiestoSection`, `trabajosSection`, `algunaIdeaSection`, `cursosSection`, `SobreMiSection` ← ojo mayúscula, `tiendaSection`, `contactoSection`, `footerSection`, `postFooterSection`

---

## Archivos de configuración clave

| Archivo | Propósito |
|---------|-----------|
| `next.config.ts` | SC_DISABLE_SPEEDY=false, remote images sanity CDN |
| `tailwind.config.ts` | Colors: green-pipo (#00A750), clean-gray (#e4e5e0) |
| `middleware.ts` | Locale detection + redirect (skip api, _next, studio) |
| `i18n.config.ts` | locales: ['es','en'], default: 'es' |
| `tsconfig.json` | ES2020, strict, alias @/* → ./* |

---

## Dependencias 3D

```json
"@react-three/fiber": "9.3.0"
"@react-three/drei": "10.6.1"
"three": "0.178.0"
"framer-motion": "11.18.2"
```

---

## Patrones a seguir

1. **Navegación**: siempre a través del store (`navigateToSection`, `scrollToSection`), nunca directo
2. **Animaciones**: el store decide `activeAnimation`, ThreeDCanvas traduce a `animationControls`, Shelves ejecuta
3. **Contenido de sección**: viene de Sanity via `sectionsData` prop — no hardcodear texto
4. **Secciones nuevas**: requieren entrada en `sectionTransitions`, `sections[]` en store, posición en Shelves, y Section component
5. **Nombres de animación GLB**: verificar spacing exacto antes de editar `transitionAnimations` o `animationSettings`
