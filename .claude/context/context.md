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
- **Meshes de fotos (trabajos):** `Foto01`, `Foto01001`, `Foto01002`, `Foto01003` + marcos `Marco01`/`Marco01001`/`Marco01002`/`Marco01003` — posicionados en Y≈-3.28, frente al slot de trabajos

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

## SectionOverlays — overlay 2D de secciones (reemplaza BoundedHtml)

`SectionOverlays.tsx` es un componente React puro **fuera del canvas** que renderiza el contenido de cada sección como overlay CSS.

- `PLANE_W = 4.6`, `PLANE_H = 1.889` (world-space — calibrado visualmente al slot del mueble)
- `REF_W = 600px`, `REF_H ≈ 246px` (tamaño de referencia en el que se diseña el contenido)
- Tamaño calculado **una vez** en mount + resize usando fórmula de perspectiva (no por frame)
- `position: fixed; top: 50%; left: 50%` — siempre centrado en viewport, independiente de la cámara
- `shouldShow = currentSection === id && !isTransitioning` — aparece cuando la cámara está cerca del destino (threshold: 0.3 unidades)
- Usa `AnimatePresence` + Framer Motion para fade in/out (0.35s, easeInOut)

⚠️ **Calibración de PLANE_W:** Si el contenido no llega a los bordes del slot → subir PLANE_W. Si se sale → bajarlo. El valor se define en `SectionOverlays.tsx`.

⚠️ **REF_W y escala:** `scale = slotWidthPx / REF_W`. REF_W alto = contenido más pequeño. REF_W bajo = contenido más grande. Valor recomendado: 600.

⚠️ **Threshold isTransitioning:** Definido en `CameraController` (`ThreeDCanvas.tsx`). Actualmente `< 0.3` unidades. Subir = contenido aparece antes (pero puede desbloquear scroll antes de que acabe la animación del modelo). Ver fix #12.

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

## CursosSection — detalles de implementación

- **Campos Sanity:** `title` (i18n string), `youtubeLabel` / `instagramLabel` (i18n string), `youtubeVideo` / `instagramVideo` (file, `accept: video/*`), `youtubeUrl` / `instagramUrl` (url)
- **Layout:** título grande verde + dos tarjetas de vídeo 9:16 lado a lado
- **Vídeos:** `VIDEO_W=160px`, `VIDEO_H=Math.round(160*16/9)=284px`, `autoPlay loop muted playsInline`, `objectFit: cover`
- **Links:** si hay URL configurada, la tarjeta entera se envuelve en `<a target="_blank">`
- **planeH override en SectionOverlays:** `3.5`

---

## SobreMiSection — detalles de implementación

- **Campos Sanity:** `title` (i18n string), `body` (i18n text — párrafos separados por línea en blanco)
- **Schema type:** `"SobreMiSection"` con S mayúscula (distinto al patrón camelCase del resto) ⚠️
- **Layout:** título grande verde + contenedor con fondo `rgba(228,229,224,0.7)` (Clean Grey semitransparente, `borderRadius: 6px`) + párrafos en `text-[11px]` verde centrado
- **Último párrafo:** siempre en `font-bold` automáticamente
- **FUGU CGCA:** la cadena exacta `"FUGU CGCA"` se linkea automáticamente a `https://www.byfugu.com/` con `font-bold underline`
- **Ancho sección:** `w-10/12 mx-auto` (centrado, sin ocupar el ancho completo)
- **planeH override en SectionOverlays:** `2.5`

---

## TiendaSection — detalles de implementación

- **Campos Sanity:** `title` (i18n string), `description` usado como `subtitle` (i18n string — renombrado en UI a "Subtítulo")
- **Query:** `description` → proyectado como `subtitle`
- **Productos:** vienen de `featuredProductsQuery` (limit=3) → `sectionsData.products[]`, pasados como prop `products` desde `SectionOverlays`
- **Layout:** título grande verde (`text-5xl`) + subtítulo pequeño (`text-[10px]`) centrados arriba + tres `PipoProductCard` lado a lado (`w-56` cada una)
- **planeH override en SectionOverlays:** `3.2`

### PipoProductCard — componente tarjeta de producto

- **Archivo:** `frontend/app/components/PipoProductCard.tsx`
- **Diseño:** tarjeta gris `#E4E5E0`, imagen `aspectRatio: 4/5`, título+subtítulo superpuestos arriba-izquierda, precio superpuesto abajo-izquierda
- **Efecto cut-out:** título y precio son `position: absolute` en un wrapper `position: relative` **sin** `overflow: hidden`, fuera del div de imagen (que sí tiene `overflow: hidden`). Esto evita artefactos de clipping en el borde izquierdo.
- **Estado sold:** imagen en escala de grises + overlay gris + badge "SIN STOCK :(" rotado + botón outline (`secondary + withStroke`)
- **Campos:** `name`, `subtitle`, `image` (Sanity asset), `buttonText`, `soldText`, `priceShippingInfo` (multiline, `whiteSpace: pre-line`), `sold`
- **Font:** `className="font-sans"` en el article para usar Delight

---

## ContactoSection — detalles de implementación

- **Campos Sanity:** `title` (i18n string), `instagramLabel`/`instagramUrl`, `youtubeLabel`/`youtubeUrl`, `formularioLabel`/`formularioUrl`, `whatsappLabel`/`whatsappNumber` (string sin `+`, ej: `34612345678`), `emailLabel`/`email`, `footerText` (i18n text multiline)
- **Layout:** título grande verde + 5 botones `Button` component (`as="link" size="sm"`) apilados + caja gris pie con `whiteSpace: pre-line`
- **Ancho botones:** contenedor `width: max-content` en flex-col → todos los botones hacen `align-self: stretch` y se igualan al más ancho (FORMULARIO DE CONTACTO)
- **URLs generadas:** whatsapp → `https://wa.me/${whatsappNumber}`, email → `mailto:${email}`
- **Formulario de contacto:** `formularioUrl` abre en la misma pestaña (`target` omitido) — apunta a una página separada con el form
- **Defaults hardcodeados:** funciona sin datos de Sanity (muestra labels y footerText en español)
- **planeH override en SectionOverlays:** `3.2`

---

## AlgunaIdeaSection — detalles de implementación

- **Formulario:** 5 campos (IDEA textarea, FOTOS file, NOMBRE, EMAIL, TELÉFONO) — todos required
- **Ancho del form:** 250px (dentro de REF_W=600px) → `FORM_CENTER_OFFSET = 175px`
- **Animación slide:** form arranca centrado (`x:175`), desliza a `x:0` cuando `activeAnimation` es `"Scroll 01-D"`, `"Idle 02"` o `"Scroll 02- U"` mientras `currentSection === "algunaIdea"`
- **Delays por animación:** configurables en `delays` object dentro del `useEffect` de slide
- **planeH override en SectionOverlays:** `3.1` (mayor que el estándar 1.889 para dar cabida al form)
- **Email receptor:** se lee de `settings.contactEmail` en Sanity → fallback a `CONTACTO_TO_EMAIL` env var
- **Compresión de imágenes:** Canvas API client-side, max 1400px, JPEG 82%, max 4 fotos

---

## Bugs conocidos / notas

1. **Preload correcto:** El `useGLTF.preload` al final de Shelves.tsx apunta a `v25.glb` ✓ (ya corregido desde v024)
2. **Espaciado inconsistente en nombres de animación:** `"Scroll 02- U"` vs `"Scroll 02 - D"` — no tocar sin verificar en el GLB
3. **`actions` de useAnimations no se usa:** El hook está importado pero el componente usa un mixer custom propio
4. **isTransitioning** se desbloquea cuando la cámara llega al destino (no cuando termina la animación del modelo)
5. **SobreMiSection** tiene el type `"SobreMiSection"` con S mayúscula en Sanity (distinto al patrón camelCase del resto)
6. **trabajosSection legacy fields:** El documento Sanity tiene `backgroundColor`, `description`, `maxPosts` del schema anterior — están marcados `hidden: true` en el schema para evitar el warning "unknown fields". Se pueden eliminar del documento desde Studio.
7. **SectionOverlays threshold:** Si el contenido aparece demasiado tarde al navegar, subir el threshold en `CameraController` (`ThreeDCanvas.tsx`) de `0.3` hacia `0.5` o `1.0`. Ver fix #12.

---

## TODO — al final del proyecto

- **SEO de contenido de secciones:** El texto de manifiesto, trabajos, etc. solo existe client-side (dentro del canvas R3F). Para indexación, añadir en `[locale]/page.tsx` (server component) un bloque hidden con el contenido plano de cada sección. Usar `sr-only` de Tailwind (no `display:none`) para que Google lo indexe sin penalización. El portable text de Sanity habría que serializar a string plano. No afecta al responsive ni al canvas.
