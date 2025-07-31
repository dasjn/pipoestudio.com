# PIPO - Interactive 3D Artisanal Furniture Portfolio

## Descripción General

PIPO es una aplicación web sofisticada para un negocio de muebles artesanales de las Islas Canarias. Combina una experiencia 3D inmersiva con un sistema de navegación sincronizado, gestión de contenido multiidioma y una arquitectura moderna de Next.js 15.

## Arquitectura del Sistema

### Stack Tecnológico Principal
- **Framework**: Next.js 15 con App Router, React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Estilos**: TailwindCSS 4 con tema personalizado
- **CMS**: Sanity v3 con Live Content API y edición visual
- **Estado**: Zustand para gestión de estado global
- **Internacionalización**: Sistema i18n personalizado (ES/EN) con middleware
- **Fuentes**: Delight (9 pesos) con optimización WOFF2

### Estructura del Proyecto (Monorepo)

```
D:\Fugu\Dev\Test\
├── frontend/                    # Aplicación Next.js
│   ├── app/
│   │   ├── [locale]/           # Rutas internacionalizadas
│   │   │   ├── page.tsx        # Homepage principal
│   │   │   ├── [slug]/         # Páginas dinámicas
│   │   │   └── posts/[slug]/   # Blog posts
│   │   ├── api/
│   │   │   └── draft-mode/     # API para modo borrador
│   │   ├── components/
│   │   │   ├── sections/       # Componentes de sección
│   │   │   ├── ThreeDCanvas.tsx # Canvas 3D principal
│   │   │   ├── Shelves.tsx     # Modelo 3D GLTF
│   │   │   ├── Button.tsx      # Sistema de botones
│   │   │   └── ProductCard.tsx # Tarjetas de producto
│   │   ├── store/              # Estados Zustand
│   │   ├── hooks/              # Hooks personalizados
│   │   ├── lib/                # Utilidades y diccionarios
│   │   └── sanity/             # Configuración CMS
├── studio/                     # Sanity CMS Studio
└── docs/                       # Documentación
```

## Sistema de Navegación 3D Único

### Concepto Central
Cada sección HTML (100vh) está mapeada sincronizadamente a:
- **Posición específica de cámara 3D** con coordenadas Y escalonadas
- **Conjunto de animaciones del modelo** (Idle, Action, Action.001, Action.002)
- **Sección de contenido correspondiente** con smooth scroll

### Flujo de Navegación Completo

1. **Usuario hace scroll/wheel** → `useWheelNavigation` detecta evento
2. **Se bloquea scroll nativo** → `isTransitioning = true` en navigationStore
3. **NavigationStore actualiza sección** → Cambio de `currentSection`
4. **ThreeDCanvas reacciona automáticamente** → `useEffect` detecta cambio
5. **Scroll HTML sincronizado** → `scrollIntoView({ behavior: "smooth" })`
6. **CameraController anima suavemente** → Lerp de position/lookAt/fov
7. **Animaciones 3D se actualizan** → Modelo cambia animaciones
8. **Al completar transición** → `onTransitionComplete()` → `isTransitioning = false`

### Configuración de Secciones (NavigationStore)

```typescript
interface Section {
  id: SectionId;
  label: string;
  element?: HTMLElement;
  cameraPosition: {
    position: { x: number; y: number; z: number };
    lookAt: { x: number; y: number; z: number };
    fov: number;
  };
  animations: {
    activeAnimations: string[];
  };
}
```

**Secciones Configuradas:**
- `inicio`: Y: 3.911, animación "Idle"
- `manifiesto`: Y: 0.657, animación "Action"  
- `trabajos`: Y: -2.677, animación "Action.001"
- `algunaIdea`: Y: -6.029, animación "Action.002"
- `cursos`: Y: -9.373, animaciones "Idle" + "Action"
- `sobreMi`: Y: -12.724, animación "Action.001"
- `tienda`: Y: -16.078, animaciones "Action.001" + "Action.002"
- `contacto`: Y: -19.432, todas las animaciones activas
- `footer`: Y: -22.786, todas las animaciones activas
- `postFooter`: Y: -26.140, solo "Idle" (oculta del header)

## Componentes Principales

### Layout y Páginas

#### `app/layout.tsx` - Layout Raíz
- **Metadatos dinámicos** con OpenGraph y Twitter Cards
- **Fuente Delight** optimizada con 9 pesos (font-display: swap)
- **SanityLive** para actualizaciones en tiempo real
- **Toaster** (Sonner) para notificaciones
- **Speed Insights** de Vercel integrado
- **Draft Mode** para edición de contenido

#### `app/[locale]/page.tsx` - Homepage Principal
- **Fetching múltiple** de datos Sanity (settings, posts, home, products)
- **Renderizado condicional** basado en contenido CMS vs fallback
- **Secciones principales** integradas con 3D canvas
- **Soporte multiidioma** automático

### Componentes de Sección

#### `Header.tsx` - Navegación Principal
- **Navegación responsiva** con menú hamburguesa móvil
- **MobileMenu** animado con slide-in y overlay
- **NavLink** componente reutilizable (scroll/external/action)
- **Cambio de idioma** con persistencia y navegación
- **Auto-detección de locale** desde pathname
- **Filtrado inteligente** (postFooter oculta del menú)
- **Indicador de sección activa** automático

#### Secciones de Contenido
- **InicioSection**: Hero con branding artesanal
- **ManifiestoSection**: Valores y filosofía
- **TrabajosSection**: Portfolio de trabajos
- **AlgunaIdeaSection**: Call-to-action para proyectos
- **CursosSection**: Cursos y talleres
- **TiendaSection**: Catálogo de productos
- **ContactoSection**: Información de contacto
- **DevelopSection**: Showcase de productos destacados
- **PlaygroundSection**: Sección post-footer oculta

### Componentes UI Avanzados

#### `Button.tsx` - Sistema de Botones
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  // Discriminated union para button vs link
  asChild?: boolean;
  href?: string;
}
```
- **Polimórfico** (button/link) con TypeScript discrimination
- **Estados avanzados** (loading, disabled, hover, active)
- **Accesibilidad completa** integrada
- **Variantes múltiples** con Tailwind variants

#### `ProductCard.tsx` - Tarjetas de Producto
- **Integración Sanity** con optimización de imágenes
- **Estados producto** (disponible/vendido) con styling condicional
- **Scroll-to-contact** funcionalidad integrada
- **Responsive design** optimizado
- **Fallback handling** para datos faltantes

### Sistema 3D Completo

#### `ThreeDCanvas.tsx` - Orquestador 3D
```typescript
// Integración completa del sistema
const {
  currentSection,
  getCurrentCameraPosition,
  getCurrentAnimations,
  setTransitioning
} = useNavigationStore();

useWheelNavigation(); // Hook de navegación por rueda
```

**Funcionalidades:**
- **Canvas principal** con configuración optimizada
- **Lighting setup** (ambientLight + pointLight + Environment)
- **CameraController** con transiciones suaves
- **Integración completa** con navigationStore
- **Detección de transición completa** con callback
- **Fixed positioning** (-z-10) detrás del contenido

#### `Shelves.tsx` - Modelo 3D GLTF
```typescript
interface ModelProps {
  animationControls?: {
    activeAnimations: { [key: string]: boolean };
    clampWhenFinished: boolean;
    triggerUpdate?: number;
  };
  onAnimationsLoaded?: (animations: string[]) => void;
}
```

**Características:**
- **Carga GLTF** del modelo `Pipo_Todo_Prueba_v05.glb`
- **Sistema de animaciones** con mixer personalizado
- **Materiales definidos** (Pipo Wood variants, Pipo Caras)
- **Geometrías optimizadas** con shadow casting/receiving
- **Preloading** con `useGLTF.preload()`
- **Control granular** de animaciones por sección

#### `CameraController` (integrado en ThreeDCanvas)
```typescript
// Transiciones suaves con detección de completado
const transitionThreshold = {
  position: 0.01,
  lookAt: 0.01,
  fov: 0.1
};
```
- **Interpolación suave** usando `Vector3.lerp()` y `MathUtils.lerp()`
- **Triple sincronización** (position, lookAt, fov)
- **Detección de completado** con thresholds precisos
- **60fps animation loop** con `useFrame`
- **Callback system** para unlock de navegación

## Gestión de Estado (Zustand)

### NavigationStore - Store Principal
```typescript
interface NavigationState {
  currentSection: SectionId | null;
  isScrolling: boolean;          // Scroll programático bloqueado
  isTransitioning: boolean;      // Transición 3D activa
  sections: Section[];           // Configuración completa
  
  // Actions principales
  setCurrentSection: (sectionId: SectionId) => void;
  navigateToSection: (sectionId: SectionId) => void;  // Navegación completa
  scrollToSection: (sectionId: SectionId) => void;    // Solo scroll
  navigateNext/Previous: () => void;                   // Navegación secuencial
  registerSection: (sectionId: SectionId, element: HTMLElement) => void;
  initializeSections: () => void;                      // Intersection Observer
  getCurrentCameraPosition/Animations: () => {...};   // Getters 3D
}
```

**Funcionalidades Avanzadas:**
- **Intersection Observer** configurado para detección automática de secciones
- **Scroll blocking** durante transiciones para UX fluida
- **State persistence** implícita a través de URL/DOM
- **Getters optimizados** para integración 3D
- **Navigation queuing** previene solapamiento de transiciones

### LocaleStore - Gestión de Idiomas
```typescript
interface LocaleState {
  locale: Locale;  // 'es' | 'en'
  setLocale: (locale: Locale) => void;
}
```
- **Estado global** del idioma actual
- **Integración con Next.js** middleware para routing
- **Persistencia** vía URL structure

## Hooks Personalizados

### `useWheelNavigation.ts` - Control de Navegación
```typescript
const useWheelNavigation = () => {
  const { navigateNext, navigatePrevious, isTransitioning } = useNavigationStore();
  
  // Debouncing avanzado y control de eventos
  const wheelTimeoutRef = useRef<NodeJS.Timeout>();
  const lastWheelTime = useRef(0);
  
  // 800ms minimum entre navegaciones
  // preventDefault durante transiciones
  // Touch event support para móvil
}
```

**Características:**
- **Debouncing inteligente** (800ms mínimo entre navegaciones)
- **Event prevention** durante transiciones activas
- **Directional detection** (deltaY > 0 = down, < 0 = up)
- **Touch support** para dispositivos móviles
- **Cleanup automático** en unmount

## Internacionalización Completa

### Configuración Base (`i18n.config.ts`)
```typescript
export const i18n = {
  defaultLocale: 'es' as const,
  locales: ['es', 'en'] as const,
}

export type Locale = (typeof i18n)['locales'][number];
```

### Middleware de Routing (`middleware.ts`)
- **Detección automática** de locale desde URL
- **Redirección** a locale por defecto si no se especifica
- **Exclusión** de rutas API y archivos estáticos
- **Header-based** locale detection como fallback

### Sistema de Traducciones

#### `navigation-dictionary.ts` - Diccionario UI
```typescript
export const navigationLabels = {
  es: {
    inicio: "Inicio",
    manifiesto: "Manifiesto",
    trabajos: "Trabajos",
    algunaIdea: "¿Alguna idea?",
    cursos: "Cursos",
    sobreMi: "Sobre Mí",
    tienda: "Tienda",
    contacto: "Contacta",
    footer: "Footer",
    postFooter: "Post Footer",
    language: "EN/ES"
  },
  en: { /* English translations */ }
}
```

#### Integración Sanity CMS
```groq
// Pattern de fallback multiidioma en queries GROQ
"title": coalesce(
  title[_key == $language][0].value,
  title[_key == "es"][0].value,
  title[0].value
)
```

## Integración Sanity CMS

### Configuración del Cliente (`sanity/lib/client.ts`)
```typescript
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2024-01-01',
  stega: {
    enabled: draftMode().isEnabled,
    studioUrl: '/studio'
  }
});
```

**Características:**
- **Live Content API** con SanityLive
- **Draft mode** para preview de contenido
- **CDN optimization** para producción
- **Stega encoding** para edición visual
- **Token-based auth** para contenido privado

### Queries Principales (`sanity/lib/queries.ts`)

#### `homeQuery` - Contenido Homepage
```groq
*[_type == "home"][0] {
  sections[] {
    _type,
    _key,
    "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value),
    "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value),
    // ... más campos internacionalizados
  }
}
```

#### `productsQuery` - Catálogo de Productos
```groq
*[_type == "product" && defined(slug.current)] | order(_createdAt desc) {
  _id,
  "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value),
  slug,
  "image": image.asset->url,
  price,
  "status": coalesce(status[_key == $language][0].value, status[_key == "es"][0].value),
  featured
}
```

#### `allPostsQuery` - Blog Posts
- **Contenido multiidioma** con fallbacks
- **Referencias de autor** expandidas
- **Portable text** para contenido rich
- **Filtrado por estado** (draft/published)

### Schemas del Studio

#### Schema de Productos (`studio/src/schemaTypes/documents/product.ts`)
```typescript
export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',  // Campo multiidioma
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'internationalizedArrayString'
    }
  ]
})
```

#### Schema de Homepage (`studio/src/schemaTypes/singletons/home.ts`)
- **Document único** para configuración homepage
- **Secciones modulares** con page builder
- **Contenido internacionalizado** por sección
- **Preview integration** para edición visual

### Configuración del Studio (`studio/sanity.config.ts`)
```typescript
export default defineConfig({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: [
    internationalizedArray({
      languages: [
        {id: 'es', title: 'Spanish'},
        {id: 'en', title: 'English'}
      ],
      defaultLanguages: ['es'],
      fieldTypes: ['string', 'text', 'blockContent']
    }),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL,
        draftMode: {
          enable: '/api/draft-mode/enable'
        }
      }
    }),
    // ... más plugins
  ],
  schema: { types: schemaTypes }
})
```

## Sistema de Estilos

### Configuración Tailwind (`tailwind.config.ts`)
```typescript
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-pipo': '#00A750',           // Color principal marca
        'clean-gray': '#f8f8f8',          // Gris limpio
        'green-100': '#33b877',           // Verde claro
        'green-200': '#66ca9e',           // Verde hover
        // ... paleta completa con escalas
      },
      fontFamily: {
        sans: ['Delight', 'system-ui'],   // Fuente personalizada
      },
      boxShadow: {
        'layer': '0px 2px 8px rgba(0, 0, 0, 0.1)'  // Sombra personalizada
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')     // Plugin de tipografía
  ]
}
```

### Fuentes Personalizadas (`app/globals.css`)
```css
@font-face {
  font-family: 'Delight';
  font-style: normal;
  font-weight: 100 900;  /* Variable font range */
  font-display: swap;
  src: url('./fonts/Delight-VF.woff2') format('woff2-variations'),
       url('./fonts/Delight-VF.woff') format('woff-variations');
}

/* 9 pesos específicos con fallbacks */
/* ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black, Heavy */
```

## API Routes y Server Actions

### Draft Mode API (`app/api/draft-mode/enable/route.ts`)
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Validación de secret para seguridad
  // Habilitación de draft mode
  // Redirect a preview URL con stega
}
```

### Server Actions (`app/actions.ts`)
```typescript
'use server'

export async function disableDraftMode(): Promise<void> {
  // Server-side draft mode disabling
  // Promise simulation con delay
  // Integration con Next.js draft mode
}
```

## Configuraciones de Build y Deploy

### Scripts del Proyecto (package.json raíz)
```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:next": "npm run dev --workspace=frontend",
    "dev:studio": "npm run dev --workspace=studio",
    "build": "npm run build --workspace=frontend",
    "import-sample-data": "npm run import-sample-data --workspace=studio"
  },
  "workspaces": ["frontend", "studio"]
}
```

### Variables de Entorno Requeridas
```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token

# Studio Configuration  
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

### Optimizaciones de Producción

#### Next.js Configuration (`next.config.ts`)
```typescript
const config: NextConfig = {
  compiler: {
    styledComponents: true,  // Styled-components optimization
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',  // Sanity CDN optimization
        port: '',
        pathname: '/images/**',
      }
    ]
  }
}
```

#### Performance Features
- **Static Generation** para rutas de locale
- **Image Optimization** automática de Next.js
- **CDN Integration** con Sanity para assets
- **Speed Insights** de Vercel integrados
- **Font optimization** con font-display: swap

## Características Técnicas Avanzadas

### 1. Sistema de Navegación 3D Sincronizada
- **Unique selling point**: Navegación por scroll que controla cámara 3D
- **Smooth transitions**: Interpolación matemática con lerp
- **State synchronization**: React state + 3D scene + HTML scroll
- **Performance optimized**: 60fps animations con requestAnimationFrame

### 2. Arquitectura de Componentes Moderna
- **Server/Client Components**: Optimización de hidratación
- **TypeScript estricto**: Type safety completa con discriminated unions
- **Composition patterns**: Props polymorphism y component flexibility
- **Error boundaries**: Manejo robusto de errores en producción

### 3. CMS Integration Avanzada
- **Live preview**: Edición visual en tiempo real
- **Internationalization**: Field-level translations con fallbacks
- **Draft mode**: Preview seguro de contenido no publicado
- **Type generation**: TypeScript types generados desde Sanity schemas

### 4. Optimizaciones de Rendimiento
- **Bundle optimization**: Code splitting automático de Next.js
- **Asset optimization**: Images, fonts, y 3D models optimizados
- **Caching strategy**: ISR con Sanity webhook revalidation
- **Core Web Vitals**: Optimizado para métricas de performance

### 5. Experiencia de Usuario Premium
- **Responsive design**: Mobile-first con breakpoints optimizados
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Loading states**: Skeleton loading y progressive enhancement
- **Error handling**: User-friendly error messages y recovery

---

*Esta documentación representa el análisis técnico completo del proyecto PIPO, incluyendo todos los componentes, configuraciones, y sistemas implementados.*