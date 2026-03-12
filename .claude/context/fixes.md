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

## 7. Acceso a Sanity Studio

**Situación:** El proyecto existe en `manage.sanity.io` con project ID `kzek939n`, dataset activo con 21 documentos. Pero `SANITY_STUDIO_STUDIO_HOST` está vacío → el studio no está deployado online.

**Para editar contenido:**
- Local: `cd studio && npm run dev` → `localhost:3333`
- Online: `cd studio && sanity deploy` (genera URL tipo `nombre.sanity.studio`)
