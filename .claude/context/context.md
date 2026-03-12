# Contexto del Proyecto — Fugu Portfolio 3D

## ¿Qué es esto?

Portfolio personal de "PIPO". Web vertical de scroll donde la cámara recorre una estantería/mueble 3D animado. El usuario navega entre secciones (wheel/swipe) y el modelo 3D ejecuta animaciones de transición coordinadas con el movimiento de cámara.

**Stack principal:** Next.js 15 + React 19 + React Three Fiber + Zustand + Framer Motion + Sanity CMS

---

## Estructura de carpetas relevante

```
frontend/
  app/
    [locale]/
      page.tsx                  ← Server component, fetches Sanity data
    components/
      ThreeDCanvas.tsx          ← Canvas R3F + CameraController
      Shelves.tsx               ← Modelo 3D + BoundedHtml + secciones
      sections/
        Header.tsx              ← Nav sticky, desktop + mobile
        InicioSection.tsx       ← Hero section (fuera del canvas)
        PlaygroundSection.tsx   ← Post-footer section (fuera del canvas)
        ManifiestoSection.tsx   ← Sección dentro del modelo 3D
        TrabajosSection.tsx
        AlgunaIdeaSection.tsx
        CursosSection.tsx
        SobreMiSection.tsx
        TiendaSection.tsx
        ContactoSection.tsx
        Footer.tsx
    hooks/
      useWheelNavigation.ts     ← Wheel + touch navigation
      useFacialAnimations.ts    ← Animaciones de cara autónomas
    store/
      navigationStore.ts        ← Zustand: estado global de navegación + animaciones
      localeStore.ts            ← Zustand: idioma actual ('es'/'en')
    lib/
      navigation-dictionary.ts  ← Labels bilingüe de secciones
```

---

## Secciones y posiciones de cámara

| Sección     | Y cámara  | Idle asociado |
|-------------|-----------|---------------|
| inicio      | +3.911    | Idle 01       |
| manifiesto  | +0.657    | Idle 01/02    |
| trabajos    | -2.677    | Idle 01/02    |
| algunaIdea  | -6.029    | Idle 01/02/03 |
| cursos      | -9.373    | Idle 03       |
| sobreMi     | -12.724   | Idle 02/04    |
| tienda      | -16.078   | Idle 04       |
| contacto    | -19.432   | Idle 04       |
| footer      | -22.786   | —             |
| postFooter  | -26.14    | —             |

- Z siempre fijo: posición z=15 (inicio z=13.5), lookAt z=3.468
- FOV base: 20. Multiplicadores: mobile ×2.8, tablet ×2.4, 1024-1440px ×2, desktop ×1

---

## Modelo 3D

- **Archivo:** `/models/Pipo_Todo_Prueba_v25.glb` (public folder)
- **Materiales:** Pipo Wood Boton, Pipo Caras, Pipo Wood 01/02, Mueble, MaderaCuadros, Imagen01
- **Módulos del mueble:** Module01 (arriba), Module02/02001-005 (medio), Module03 (abajo)
- **Armature:** Armature001 con Bone (en posición 1.496, -3.829, 1.977, scale 0.236)
- **Meshes de sección:** Module01001-Module01008 (visibilidad oculta, solo para anclar BoundedHtml)

### Posiciones world-space de meshes de sección

| Sección    | Y posición |
|------------|------------|
| manifiesto | +0.666     |
| trabajos   | -2.645     |
| algunaIdea | -5.983     |
| cursos     | -9.318     |
| sobreMi    | -12.651    |
| tienda     | -15.993    |
| contacto   | -19.333    |
| footer     | -22.673    |

*Nota: estas Y difieren ligeramente de las posiciones de cámara (los módulos de mueble visibles usan Y exactas: -2.677, -6.029, etc.)*

---

## Animaciones del GLB

### Idles (loop=true, clampWhenFinished=false)
- `Idle 01`, `Idle 02`, `Idle 03`, `Idle 04`

### Transiciones de scroll (loop=false, clampWhenFinished=true)
- `Scroll 01-D` — Idle 01 → Idle 02 (down)
- `Scroll 02 - D` — Idle 02 → Idle 03 (down)
- `Scroll 03 - D` — Idle 03 → Idle 04 (down)
- `Scroll 03 - U` — Idle 02 → Idle 01 (up)
- `Scroll 02- U` — Idle 03 → Idle 02 (up)
- `Scroll 01- U` — Idle 04 → Idle 03 (up)

⚠️ **Los nombres tienen espaciado inconsistente — deben coincidir EXACTAMENTE con el GLB.**

### Animaciones de cara (autónomas)
- `C-Cachondo`, `C-Enfadado`, `C-Jugueton`
- Se reproducen aleatoriamente cada 2000-5000ms
- Se pausan durante transiciones de scroll (`isAnimationSequenceActive`)

---

## Transiciones por sección (sectionTransitions)

Al SALIR de una sección en dirección down/up, el idle destino es:

| Sección    | exitDown | exitUp  |
|------------|----------|---------|
| inicio     | Idle 02  | —       |
| manifiesto | Idle 02  | Idle 01 |
| trabajos   | Idle 02  | Idle 01 |
| algunaIdea | Idle 03  | Idle 01 |
| cursos     | Idle 03  | Idle 02 |
| sobreMi    | Idle 04  | Idle 02 |
| tienda     | Idle 04  | Idle 03 |
| contacto   | Idle 04  | Idle 03 |
| footer     | —        | —       |
| postFooter | —        | —       |

---

## BoundedHtml — cómo funciona el overlay 2D en el mundo 3D

`BoundedHtml` proyecta las esquinas del plano 3D al espacio de pantalla cada frame:
- `PLANE_W = 4.6`, `PLANE_H = 1.889` (world-space — PLANE_W calibrado visualmente al slot interior del mueble)
- `REF_W = 600px`, `REF_H ≈ 246px` (tamaño de diseño de referencia — REF_H recalculado con nuevo PLANE_W)
- Cada frame: calcula top-left y bottom-right en NDC → convierte a px → calcula `scale = w / REF_W`
- El contenido se diseña a 600×REF_H px y se escala dinámicamente al tamaño proyectado
- Usa `AnimatePresence` + Framer Motion para fade in/out (0.35s, easeInOut)

⚠️ **Calibración de PLANE_W:** Si el contenido no llega a los bordes del slot → subir PLANE_W. Si se sale → bajarlo. No modificar PLANE_H sin revisar que el contenido no se recorte verticalmente (`overflow: hidden` en outerRef).

⚠️ **REF_W y escala:** `scale = projected_px / REF_W`. REF_W alto = contenido más pequeño. REF_W bajo = contenido más grande. Valor recomendado: 600.

---

## Data flow — cómo llega el contenido CMS al canvas

```
Sanity CMS
  ↓ sanityFetch (SSR)
[locale]/page.tsx
  → sectionsData: SectionsData
    ↓
ThreeDCanvas (client, prop sectionsData)
    ↓
Model / Shelves (prop sectionsData)
    ↓
BoundedHtml → <ManifiestoSection data={sectionsData.manifiesto} />
```

**Queries Sanity:** settingsQuery, allPostsQuery (by locale), homeQuery (by locale), featuredProductsQuery (limit=3)

---

## i18n

- Locales: `es` (default), `en`
- Ruta: `/[locale]/` — middleware redirige paths sin locale al default
- Labels de navegación: `frontend/app/lib/navigation-dictionary.ts`
- Locale state: `localeStore.ts` (Zustand, client-side)

---

## Estilos tipográficos de secciones

Las secciones dentro del mueble usan Tailwind v4 con tokens del `@theme` en `globals.css`:
- `font-sans` → `--font-sans: "Delight", "Inter", "sans-serif"`
- `text-green-pipo` → `--color-green-pipo: #00a750`
- Padding lateral: `px-2` (reducido de `px-6` para aprovechar el ancho del slot)

⚠️ El linter convierte `text-[80px]` a equivalentes de la escala estándar Tailwind. Usar siempre clases de escala: `text-4xl`, `text-6xl`, `text-8xl`.

---

## Bugs conocidos / notas

1. **Preload correcto:** El `useGLTF.preload` al final de Shelves.tsx apunta a `v25.glb` ✓ (ya corregido desde v024)
2. **Espaciado inconsistente en nombres de animación:** `"Scroll 02- U"` vs `"Scroll 02 - D"` — no tocar sin verificar en el GLB
3. **`actions` de useAnimations no se usa:** El hook está importado pero el componente usa un mixer custom propio
4. **isTransitioning** se desbloquea cuando la cámara llega al destino (no cuando termina la animación del modelo)
5. **SobreMiSection** tiene el type `"SobreMiSection"` con S mayúscula en Sanity (distinto al patrón camelCase del resto)
