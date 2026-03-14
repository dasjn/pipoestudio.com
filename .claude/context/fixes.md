# Fixes y decisiones de diseño resueltas

## 1. Estilos de secciones con Tailwind (no inline styles)

**Problema:** Las secciones usaban `style={{...}}` con valores hardcodeados para fuente, tamaño, color, etc.

**Fix:** Migrar a clases Tailwind v4, aprovechando los tokens del `@theme` en `globals.css`:
- `font-sans` → usa `--font-sans: "Delight", "Inter", "sans-serif"` (el linter puede cambiar `font-display` por `font-sans`)
- `text-green-pipo` → usa `--color-green-pipo: #00a750`
- `font-bold` → weight 700
- `leading-none` → line-height 100%
- `tracking-normal` → letter-spacing 0

**Ejemplo final en ManifiestoSection.tsx:**
```tsx
<p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo">
```

⚠️ **El linter convierte tamaños arbitrarios a la escala Tailwind:**
- `text-[80px]` → se convierte automáticamente a `text-8xl` o `text-4xl` según la versión
- Para valores fijos usar la escala Tailwind directamente: `text-4xl`, `text-6xl`, `text-8xl`, etc.

---

## 2. El linter cambia font-size arbitrarios

**Problema:** Al guardar `fontSize: "80px"` como clase `text-[80px]`, el linter lo transforma a un equivalente de la escala estándar de Tailwind (p.ej. `text-4xl` = 36px), reduciendo visualmente el texto.

**Causa:** El proyecto tiene un formatter/linter configurado que normaliza arbitrary values a la escala de Tailwind.

**Workaround:** Usar directamente clases de la escala estándar y calibrar visualmente:
- `text-4xl` = 2.25rem (36px)
- `text-6xl` = 3.75rem (60px)
- `text-8xl` = 6rem (96px)

---

## 3. REF_W — lógica inversa al escalar contenido

**Problema:** El usuario intentó hacer el texto más grande subiendo `REF_W` a `1000`, pero el texto se veía más pequeño.

**Causa:** La escala del contenido es `scale = projected_width_px / REF_W`.
- REF_W alto → escala pequeña → contenido más pequeño en pantalla
- REF_W bajo → escala grande → contenido más grande en pantalla

**Valor actual:** `REF_W = 600` (restaurado al original)

**Regla:** Para hacer el contenido más grande en pantalla → **bajar** `REF_W`. Para más pequeño → **subirlo**.

---

## 4. Texto no llenaba el ancho del slot del mueble (PLANE_W incorrecto)

**Problema:** El texto quedaba con mucho hueco blanco a los lados dentro del hueco del mueble. Subir el `font-size` no solucionaba el problema (solo recortaba verticalmente por el `overflow: hidden`).

**Causa:** `PLANE_W = 3.446` era demasiado pequeño respecto al ancho real del hueco interior blanco del mueble en world-space. El `outerRef` (que clipa el contenido) se calculaba más estrecho que la apertura real del slot.

**Fix:** Subir `PLANE_W` hasta que el área proyectada coincida con el ancho visible del hueco:
```typescript
// Shelves.tsx
const PLANE_W = 4.6;  // calibrado visualmente contra el slot del mueble
```

**Cómo calibrar:** Aumentar `PLANE_W` si el contenido no llega a los bordes del slot. Reducirlo si se sale por los lados. `PLANE_H` no se tocó (controla el alto, y subir el font-size ya recortaba verticalmente).

---

## 5. Padding lateral de las secciones (px-6 → px-2)

**Problema:** Las secciones tenían `px-6` (24px de padding en cada lado sobre la caja de 600px de referencia), dejando margen lateral visual.

**Fix:** Reducido a `px-2` en `ManifiestoSection` para aprovechar más el ancho disponible.

**Dónde está:** En el `<section>` raíz de cada componente de sección (ManifiestoSection.tsx, SobreMiSection.tsx, etc.)

---

## 6. SobreMiSection — schema creado por error

**Contexto:** Se aplicó el diseño Delight Bold inicialmente a `SobreMiSection` en lugar de `ManifiestoSection`. El schema, query y componente se crearon igualmente y se dejaron en su sitio.

**Estado actual:** `SobreMiSection` tiene schema (`statement` field), entrada en `homeQuery`, y componente con el mismo estilo tipográfico. El campo en Sanity es `SobreMiSection` (con mayúscula — atención al case).

---

## 8. TrabajosSection — fotos 3D desde Sanity

**Implementación:** Las 4 fotos de la sección trabajos se cargan en los meshes del GLB (`Foto01`, `Foto01001`, `Foto01002`, `Foto01003`) vía `useTexture` de drei.

**Componente `FotoTexture` (Shelves.tsx):**
- Recibe `url` (Sanity CDN) y `geometry` (del mesh GLB)
- `texture.flipY = false` — corrige orientación para UVs de GLTF
- Calcula cover: compara aspect ratio del mesh (desde bounding box) vs imagen, ajusta `texture.repeat` y `texture.offset`
- Usa `meshBasicMaterial` → sin afectación de luz (colores fieles a la imagen)
- Fallback: si no hay URL, el mesh usa el material `Imagen01` original del GLB

**Schema Sanity (`trabajosSection`):**
- `title`: `internationalizedArrayString` (interno, para preview)
- `statement`: `internationalizedArrayText` (texto que aparece en el slot del mueble)
- `fotos`: array de `image` (máx. 4, hotspot activado)
- Campos legacy `description/maxPosts/backgroundColor`: `hidden: true`

**Query GROQ:**
```groq
_type == "trabajosSection" => {
  "statement": coalesce(statement[_key == $language][0].value, ...),
  "fotos": fotos[]{ "url": asset->url },
}
```

**Cover logic:**
```typescript
meshAspect = (box.max.x - box.min.x) / (box.max.y - box.min.y)
imageAspect = img.width / img.height
// imagen más ancha: encaja alto, recorta lados → repeat.set(meshAspect/imageAspect, 1)
// imagen más alta: encaja ancho, recorta altos → repeat.set(1, imageAspect/meshAspect)
// offset centra el recorte en ambos casos
```

---

## 9. Botón en TrabajosSection — Button component + Sanity CMS

**Implementación:** Botón primary debajo del statement de trabajos, con texto y URL desde Sanity.

**Schema Sanity (`studio/src/schemaTypes/objects/trabajosSection.ts`):**
```typescript
defineField({ name: 'buttonText', title: 'Texto del botón', type: 'internationalizedArrayString' }),
defineField({ name: 'buttonUrl', title: 'URL del botón', type: 'url' }),
```

**Query GROQ (`homeQuery`):**
```groq
_type == "trabajosSection" => {
  "statement": coalesce(statement[...]),
  "buttonText": coalesce(buttonText[_key == $language][0].value, ...),
  buttonUrl,
  "fotos": fotos[]{ "url": asset->url },
}
```

**Icono:** Material Symbols `rotate_right` (Google Fonts, 16px) — cargado en `layout.tsx` vía `<link>` en `<head>`. Se renderiza como `<span className="material-symbols-outlined">` con `leading-none inline-flex items-center` para evitar whitespace y alinear correctamente.

**Button component (`frontend/app/components/Button.tsx`):**
- `as="button"` | `as="link"` — polimórfico (renderiza `<button>` o `<a>`)
- `variant="primary"` | `"secondary"` con `withStroke` opcional
- `size`: `sm | md | lg | xl`
- Colores exactos del sistema Pipo (Figma): green `#00A750`, hover `#006430`, active `#008640`, focus ring `#004320`, disabled `#E4E5E0`/`#6F6F6F`
- `isLoading` prop con spinner SVG animado
- Specs Figma: `padding: 12px 10px`, `border-radius: 6px`, `gap: 10px`, `font-size: 31px` (md), `line-height: 38px`, `font-weight: 700`, `text-transform: uppercase`

---

## 10. BoundedHtml no clickable — portal a document.body

**Problema:** Los elementos HTML dentro de `BoundedHtml` (ej. botones, links) no eran clickables.

**Causa raíz:** Drei's `Html` porta su contenido a `gl.domElement.parentNode` — que es `<div className="fixed inset-0 -z-10">`. Ese div crea un stacking context con `z-index: -10`. Todo el contenido dentro queda detrás de todos los demás elementos de la página, independientemente del `pointer-events` CSS.

**Fix aplicado en `BoundedHtml` (Shelves.tsx):**
```typescript
const portalRef = useRef<HTMLElement>(null!);
const [portalReady, setPortalReady] = useState(false);

useEffect(() => {
  portalRef.current = document.body;
  setPortalReady(true);
}, []);

// En el return:
if (!portalReady) return null;
return <Html center portal={portalRef}>...
```

**Por qué funciona:** `portal={portalRef}` redirige el render a `document.body`, fuera del stacking context `-z-10`. Drei sigue calculando la posición en screen-space correctamente.

**Nota adicional:** El Canvas también tiene `style={{ pointerEvents: "none" }}` para no interferir con clicks normales en la página. Esto es seguro porque `useWheelNavigation` se adjunta a `window`, no al canvas.

---

## 11. SectionOverlays — reemplazo de BoundedHtml por CSS puro

**Problema:** `BoundedHtml` (Drei `Html` dentro del canvas) ejecutaba 8 `useFrame` por frame + 8 `useFrame` internos de Drei para calcular la posición/tamaño de cada overlay. Además, el contenido "vibraba" al cambiar de sección porque Drei rastrea la posición del mesh proyectada en pantalla frame a frame mientras la cámara hace lerp.

**Fix:** Eliminado `BoundedHtml` y todos los meshes anchor invisibles de `Shelves.tsx`. Creado `SectionOverlays.tsx` — componente React puro fuera del canvas.

**Cómo funciona:**
- `position: fixed; top: 50%; left: 50%` — siempre en el centro del viewport
- Tamaño calculado una vez en mount + en resize (no por frame) con la fórmula de perspectiva:
```ts
const visibleHeight = 2 * Math.tan(fovRad / 2) * DISTANCE; // DISTANCE = 15 - 3.468 = 11.532
const visibleWidth = visibleHeight * (vw / vh);
const slotWidthPx = (PLANE_W / visibleWidth) * vw;
const scale = slotWidthPx / REF_W;
```
- La posición del overlay no depende de la cámara → **jitter imposible estructuralmente**
- Offset Y menor por diferencia entre cameraY y slotY se compensa con `yOffsetPx`
- `shouldShow = currentSection === id && !isTransitioning` — el contenido aparece cuando la cámara está cerca del destino

**Resultado vs BoundedHtml:**
- 0 `useFrame` para overlays (eran 8 + 8 internos de Drei)
- 0 portales DOM (eran 8)
- 0 mutations DOM por frame (eran 24)

**Archivos afectados:** `SectionOverlays.tsx` (nuevo), `Shelves.tsx` (eliminado BoundedHtml + meshes anchor + imports), `ThreeDCanvas.tsx` (añadido `<SectionOverlays>` fuera del `<Canvas>`)

---

## 12. Threshold de isTransitioning — contenido aparece antes

**Problema:** Con `shouldShow = currentSection === id && !isTransitioning`, el contenido tardaba demasiado en aparecer. `isTransitioning` se mantenía `true` hasta que la cámara estaba a `< 0.01` unidades del target (lerp exponencial con `transitionSpeed=0.025` tarda mucho en esa última fase).

**Fix en `ThreeDCanvas.tsx` (`CameraController`):**
```ts
// Antes:
positionDistance < 0.01 && lookAtDistance < 0.01 && fovDifference < 0.1
// Después:
positionDistance < 0.3 && lookAtDistance < 0.3 && fovDifference < 1
```

**Por qué funciona:** La cámara llega al 95% del recorrido mucho antes que al 99%. A 0.3 unidades del target la posición es visualmente correcta — el slot ya está en pantalla en la posición correcta. El contenido aparece perceptiblemente más rápido sin desalineación visible.

**Nota:** Este threshold también controla cuándo se desbloquea el scroll (via `setTransitioning(false)`). Si el umbral es demasiado alto puede permitir scroll antes de que la animación del modelo termine.

---

## 13. AlgunaIdeaSection — formulario de contacto con Resend

**Implementación:** Formulario de contacto en la sección `algunaIdea` que envía emails vía Resend usando una Next.js Server Action.

**Archivos:**
- `frontend/app/actions/contacto.ts` — Server Action: recibe FormData, lee `contactEmail` de Sanity settings, llama a Resend API
- `frontend/app/components/sections/AlgunaIdeaSection.tsx` — formulario cliente con compresión de imágenes + animación de slide

**Campos:** IDEA* (textarea), FOTOS (file upload), NOMBRE*, EMAIL*, TELÉFONO* — todos required excepto FOTOS

**Compresión de imágenes (cliente):**
- Canvas API, sin librerías externas
- Max 1400px en el lado más largo, JPEG 82% quality
- Max 4 archivos — validación antes de comprimir
- El submit usa los archivos comprimidos (no los originales del input): `onSubmit` construye FormData manualmente con `formData.delete("fotos")` + `fotos.forEach(f => formData.append("fotos", f))`

**Email receptor configurable desde Sanity:**
- Campo `contactEmail` en `studio/src/schemaTypes/singletons/settings.tsx`
- La Server Action lee `settings.contactEmail` vía `client.fetch(settingsQuery)` con fallback a `CONTACTO_TO_EMAIL` env var
- `settingsQuery` actualizado: `*[_type == "settings"][0]{ ..., contactEmail }`

**Variables de entorno:**
```
RESEND_API_KEY=""           # API key de resend.com
CONTACTO_TO_EMAIL=""        # Fallback si no hay email en Sanity
CONTACTO_FROM_EMAIL=""      # Debe ser dominio verificado en Resend (o onboarding@resend.dev para dev)
```

**Deployment:** Vercel free tier (Hobby) soporta Server Actions. Las env vars se añaden en Vercel Dashboard → Settings → Environment Variables.

---

## 14. AlgunaIdeaSection — animación de slide del formulario

**Comportamiento:** El form aparece centrado en el slot y desliza a la izquierda cuando Pipo ejecuta su animación de scroll hacia esta sección, dejando espacio visual a la derecha para Pipo.

**Implementación:** `motion.div` de Framer Motion wrapeando el form.

```tsx
const FORM_CENTER_OFFSET = 175; // (REF_W - formWidth) / 2 = (600 - 250) / 2

<motion.div
  initial={{ x: FORM_CENTER_OFFSET }}
  animate={{ x: slid ? 0 : FORM_CENTER_OFFSET }}
  transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
>
```

**Trigger:** Solo se activa cuando `currentSection === "algunaIdea"` Y `activeAnimation` es una de las animaciones que llevan a Pipo a esta sección. Cada una tiene su propio delay configurable:

```ts
const delays: Record<string, number> = {
  "Scroll 01-D": 8500,   // viene de trabajos bajando
  "Idle 02":      80,    // ya en idle al llegar
  "Scroll 02- U": 2000,  // viene de cursos subiendo
};
```

**Reset:** `slid` vuelve a `false` cuando `currentSection !== "algunaIdea"`, para que la animación se repita en cada visita.

---

## 15. SectionOverlays — override de altura por sección

**Problema:** `algunaIdea` tiene un formulario más alto que el slot estándar (`PLANE_H = 1.889`).

**Fix:** Campo opcional `planeH` en la config de `sectionSlots`. Si se define, recalcula `slotHeightPx` y `refH` solo para ese slot:

```ts
const sectionSlots: { id: SectionId; content: ReactNode; planeH?: number }[] = [
  { id: "algunaIdea", content: <AlgunaIdeaSection />, planeH: 3.1 },
  // resto sin planeH → usa PLANE_H global (1.889)
]
```

En el render loop:
```ts
const effectivePlaneH = slotPlaneH ?? PLANE_H;
const slotHeightPx = (effectivePlaneH / layout.visibleHeight) * layout.vh;
const refH = Math.round(REF_W * (effectivePlaneH / PLANE_W));
```

---

## 16. Cola de animaciones — reemplazo en vez de acumulación

**Problema:** Al scrollear rápido de ida y vuelta, las animaciones se apilaban en `animationQueue`. Si el usuario bajaba 3 secciones y subía 2, la cola acumulaba todas las transiciones intermedias (ej. `[Scroll 01-D, Scroll 02-D, Scroll 02-U, Scroll 03-U]`). Pipo las ejecutaba todas en secuencia aunque el usuario ya se hubiera parado, dando la sensación de que "no para".

**Causa:** `navigateToSection` y `scrollToSection` usaban `[...animationQueue, nuevaAnimacion]` — acumulación ciega independientemente de si las animaciones previas seguían siendo necesarias.

**Fix en `navigationStore.ts`:**

1. **`computeIdlePath` helper** (añadida antes del store):
```ts
function computeIdlePath(from: IdleState, to: IdleState): QueuedAnimation[] {
  // Calcula el camino mínimo secuencial: Idle 01 ↔ 02 ↔ 03 ↔ 04
  // Ej: computeIdlePath("Idle 01", "Idle 03") → [Scroll 01-D, Scroll 02-D]
  // Ej: computeIdlePath("Idle 03", "Idle 01") → [Scroll 02-U, Scroll 03-U]
}
```

2. **`navigateToSection`** — reemplaza cola en vez de apendear:
```ts
// ANTES: const newQueue = [...animationQueue, { animation, targetIdle: exitIdle }];
// AHORA:
const baseIdle = isAnimationSequenceActive && pendingIdle ? pendingIdle : currentIdle;
const newQueue = computeIdlePath(baseIdle, exitIdle); // REEMPLAZA la cola
```

3. **`scrollToSection`** (nav del header) — misma lógica: determina `finalIdle` recorriendo las secciones hasta el destino, luego `computeIdlePath(baseIdle, finalIdle)` da el camino directo, y REEMPLAZA la cola.

**Por qué es seguro:** La animación que está sonando en ese momento (`pendingIdle`) NO puede cancelarse — tiene que terminar. La cola se reemplaza para todo lo que viene DESPUÉS de esa animación. Cuando termina, `onAnimationComplete` llama `processAnimationQueue()` con la cola nueva (ya recalculada).

**Resultado:** Con un scroll alocado de ida y vuelta, el usuario nunca ve más animaciones de las estrictamente necesarias para llegar al idle correcto desde donde Pipo está actualmente. Si el usuario invierte dirección mientras Pipo está en medio de una animación, las animaciones futuras se recalculan desde donde Pipo aterrizará, no desde el final de la cola acumulada.

---

## 18. AlgunaIdeaSection — slide descentrado al ampliar planeW

**Problema:** Al añadir `planeW: 6.5` en SectionOverlays, el `refW` del canvas pasa de 600 a ~848px. El `motion.div` del form tenía `alignSelf: "flex-start"` + `x: 175` para simular centrado. Con el canvas más ancho, `x: 175` desde el borde izquierdo ya no coincide con el centro del slot.

**Fix:** Eliminar `alignSelf: "flex-start"`. Dejar que `items-center` centre el form. Invertir la dirección del slide:
- No slid: `x: 0` → centrado por flex (= centro del slot para cualquier refW) ✓
- Slid: `x: -FORM_CENTER_OFFSET` (`-175`) → 175px a la izquierda del centro = borde izquierdo del slot ✓

**Por qué funciona para cualquier refW:** El slot siempre ocupa los 600px centrales del canvas. El centro del canvas = centro del slot. Mover -175px desde el centro siempre coloca el form (250px) en el borde izquierdo del slot (300 - 125 - 175 = 0 relativo al slot).

---

## 17. ContactoSection — botones mismo ancho con width: max-content

**Problema:** Los 5 botones del panel de contacto tenían anchos distintos (cada uno del tamaño de su texto) o se extendían al 100% del slot.

**Fix:** Contenedor de botones con `width: "max-content"` en un flex-column. CSS calcula primero el ancho intrínseco máximo de todos los hijos (el botón más ancho: "FORMULARIO DE CONTACTO"), luego aplica `align-self: stretch` por defecto → todos los hijos se igualan a ese ancho. `whiteSpace: "nowrap"` en los labels evita que el texto se parta durante el cálculo.

**Componente usado:** `Button` (`as="link" size="sm"`) — su `inline-flex justify-center` interno centra el texto dentro del ancho estirado.

**Por qué no usar width: 100%:** Crearía dependencia circular (hijos al 100% del padre, padre al 100% del abuelo = slot completo).

---

## 19. PipoChat — touch/click no funcionaba en mobile (framer-motion onTap)

**Problema:** En mobile/tablet (Chrome DevTools device simulation), clickar botones dentro del chat no hacía nada aunque la animación `whileTap` sí se veía.

**Causa:** `onClick` en `motion.button` no se dispara correctamente en touch porque framer-motion maneja pointer events internamente. Además, `useWheelNavigation` llamaba `e.preventDefault()` en `touchend` para elementos que no reconocía como "UI area", cancelando el click sintético del browser.

**Fix:**
1. Cambiar todos los `onClick` de `motion.button` a `onTap` (evento nativo de framer-motion, funciona en touch + mouse)
2. Añadir atributo `data-no-nav-scroll` al wrapper del chat
3. En `useWheelNavigation.ts`, `isInUIArea` ahora incluye: `element.closest('[data-no-nav-scroll]') !== null`

---

## 20. PipoChat — scroll dentro del historial capturado por navegación de página

**Problema:** Al hacer scroll dentro del historial de mensajes, el gesto era capturado por el handler de navegación de la página (swipe entre secciones).

**Causa 1:** El evento `wheel`/`touchmove` burbujeaba hasta el listener en `window` de `useWheelNavigation`.

**Fix 1:** `onWheel={(e) => e.stopPropagation()}` y `onTouchMove={(e) => e.stopPropagation()}` en el container del historial.

**Causa 2 (scroll chaining):** Cuando el container del historial llega al límite de scroll (top/bottom), el browser propaga el scroll al padre aunque hayamos detenido el evento.

**Fix 2:** Añadir al container del historial:
```css
overscrollBehavior: "contain"  /* no propaga al padre al llegar al límite */
touchAction: "pan-y"           /* declara que este elemento maneja scroll vertical */
```

---

## 21. PipoChat — input de texto no recibía foco en mobile

**Problema:** Al tocar el campo de texto en mobile, no se activaba el foco ni aparecía el teclado.

**Causa:** `useWheelNavigation` llama `e.preventDefault()` en `touchend` para cualquier elemento fuera de las "UI areas" conocidas. `preventDefault()` en `touchend` cancela el evento `click` sintético que el browser genera después de un tap, y es ese `click` el que da foco a un `<input>`.

**Fix:** El atributo `data-no-nav-scroll` en el wrapper del chat (fix #19) es suficiente — `isInUIArea` retorna `true` para cualquier elemento dentro del chat, incluyendo el input, por lo que `handleTouchEnd` no llama `preventDefault()`.

---

## 22. Markdown en respuestas del chatbot

**Problema:** El modelo LLM devolvía markdown (`**bold**`, `* lista`) que se mostraba como texto plano con asteriscos.

**Fix frontend:** Parser inline en `PipoChat.tsx`:
- `renderMarkdown()`: divide por párrafos (`\n\n`), detecta listas `* /- `, listas numeradas `1.`, headings `#`
- `inlineMarkdown()`: convierte `**bold**` → `<strong>`, `*italic*` → `<em>`
- `listStyleType: "disc"/"decimal"` explícito en `<ul>`/`<ol>` para overridear el reset de Tailwind preflight

**Fix worker:** Se eliminó la instrucción de "no usar markdown" del system prompt para que el modelo use markdown libremente y el frontend lo renderice enriquecido.

---

## 7. Acceso a Sanity Studio

**Situación:** El proyecto existe en `manage.sanity.io` con project ID `kzek939n`, dataset activo con 21 documentos. Pero `SANITY_STUDIO_STUDIO_HOST` está vacío → el studio no está deployado online.

**Para editar contenido:**
- Local: `cd studio && npm run dev` → `localhost:3333`
- Online: `cd studio && sanity deploy` (genera URL tipo `nombre.sanity.studio`)
