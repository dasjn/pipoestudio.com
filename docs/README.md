# Documentación del Proyecto - Next.js + Sanity

Este proyecto es una plantilla de Next.js con Sanity CMS que proporciona un sistema completo para crear sitios web con edición visual en tiempo real.

## Estructura del Proyecto

### Archivos Raíz

#### `README.md`
- Documentación principal del proyecto
- Guía de instalación y configuración
- Instrucciones de desarrollo y despliegue
- Describe las características principales: Next.js 15, edición visual, Live Content API, drag-and-drop

#### `package.json`
- Configuración del monorepo usando workspaces
- Scripts principales:
  - `npm run dev`: Ejecuta frontend y studio en paralelo
  - `npm run import-sample-data`: Importa datos de ejemplo
- Dependencias de desarrollo: npm-run-all

#### `package-lock.json`
- Lockfile de npm que asegura versiones consistentes de dependencias

#### `sanity-next-preview.png`
- Screenshot del Sanity Studio usando la herramienta de presentación

### Carpeta `frontend/`

#### Archivos de Configuración
- **`package.json`**: Configuración del proyecto Next.js con dependencias como React 19, Next.js 15, Sanity, TailwindCSS
- **`next.config.ts`**: Configuración de Next.js, incluye configuración para styled-components
- **`tsconfig.json`**: Configuración de TypeScript
- **`tailwind.config.ts`**: Configuración de TailwindCSS para estilos
- **`postcss.config.mjs`**: Configuración de PostCSS
- **`vercel.json`**: Configuración específica para despliegue en Vercel

#### Archivos de Desarrollo
- **`next-env.d.ts`**: Definiciones de tipos para Next.js
- **`sanity.types.ts`**: Tipos generados automáticamente desde el esquema de Sanity
- **`sanity-typegen.json`**: Configuración para la generación de tipos

#### Estructura de la Aplicación (`app/`)
- **`layout.tsx`**: Layout raíz con configuración de metadatos, fuentes, y componentes globales
- **`page.tsx`**: Página principal de la aplicación
- **`globals.css`**: Estilos globales de la aplicación
- **`favicon.ico`**: Icono de la aplicación
- **`actions.ts`**: Server actions para operaciones del lado del servidor
- **`client-utils.ts`**: Utilidades para el cliente (manejo de errores, notificaciones)
- **`sitemap.ts`**: Generación del sitemap

#### Rutas Dinámicas
- **`[slug]/page.tsx`**: Páginas dinámicas basadas en slugs
- **`posts/[slug]/page.tsx`**: Páginas de posts individuales

#### API Routes
- **`api/draft-mode/enable/route.ts`**: Endpoint para habilitar el modo borrador

#### Componentes (`components/`)
- **`Avatar.tsx`**: Componente para mostrar avatares
- **`BlockRenderer.tsx`**: Renderizador de bloques de contenido
- **`CoverImage.tsx`**: Componente para imágenes de portada
- **`Cta.tsx`**: Componente de llamada a la acción
- **`Date.tsx`**: Componente para formatear fechas
- **`DraftModeToast.tsx`**: Notificación del modo borrador
- **`Footer.tsx`**: Pie de página
- **`GetStartedCode.tsx`**: Código de ejemplo para comenzar
- **`Header.tsx`**: Encabezado de la aplicación
- **`InfoSection.tsx`**: Sección informativa
- **`Onboarding.tsx`**: Componente de onboarding
- **`PageBuilder.tsx`**: Constructor de páginas con drag-and-drop
- **`PortableText.tsx`**: Renderizador de texto portable de Sanity
- **`Posts.tsx`**: Listado de posts
- **`ResolvedLink.tsx`**: Componente para enlaces resueltos
- **`SideBySideIcons.tsx`**: Componente de iconos lado a lado

#### Configuración de Sanity (`sanity/`)
- **`lib/api.ts`**: Funciones para interactuar con la API de Sanity
- **`lib/client.ts`**: Cliente de Sanity configurado
- **`lib/demo.ts`**: Datos de demostración
- **`lib/live.ts`**: Configuración de Live Content API
- **`lib/queries.ts`**: Consultas GROQ para obtener datos
- **`lib/token.ts`**: Manejo de tokens de autenticación
- **`lib/utils.ts`**: Utilidades generales para Sanity

#### Recursos Estáticos (`public/`)
- **`images/`**: Imágenes estáticas del proyecto

### Carpeta `studio/`

#### Archivos de Configuración
- **`package.json`**: Configuración del Sanity Studio con dependencias específicas
- **`sanity.config.ts`**: Configuración principal del studio con plugins y herramientas
- **`sanity.cli.ts`**: Configuración del CLI de Sanity
- **`tsconfig.json`**: Configuración de TypeScript para el studio
- **`schema.json`**: Esquema exportado en formato JSON
- **`sanity-typegen.json`**: Configuración para generación de tipos

#### Datos de Ejemplo
- **`sample-data.tar.gz`**: Archivo comprimido con datos de ejemplo

#### Código Fuente (`src/`)

##### Tipos de Esquema (`schemaTypes/`)
- **`index.ts`**: Exporta todos los tipos de esquema
- **`documents/`**: Tipos de documento
  - **`page.ts`**: Esquema para páginas
  - **`person.ts`**: Esquema para personas/autores
  - **`post.ts`**: Esquema para posts/artículos
- **`objects/`**: Tipos de objeto
  - **`blockContent.tsx`**: Configuración de contenido de bloque
  - **`callToAction.ts`**: Esquema para llamadas a la acción
  - **`infoSection.ts`**: Esquema para secciones informativas
  - **`link.ts`**: Esquema para enlaces
- **`singletons/`**: Documentos únicos
  - **`settings.tsx`**: Configuración global del sitio

##### Otros Archivos
- **`lib/initialValues.ts`**: Valores iniciales para documentos
- **`structure/index.ts`**: Estructura personalizada del studio

#### Recursos Estáticos (`static/`)
- **`page-builder-thumbnails/`**: Miniaturas para el constructor de páginas
  - **`callToAction.webp`**: Miniatura para llamada a la acción
  - **`infoSection.webp`**: Miniatura para sección informativa

## Funcionalidades Principales

### 1. **Edición Visual en Tiempo Real**
- Permite editar contenido directamente en el sitio web
- Cambios visibles inmediatamente sin necesidad de recargar

### 2. **Live Content API**
- Contenido dinámico sin complejidad de tiempo real
- Actualizaciones instantáneas sin reconstrucciones

### 3. **Page Builder**
- Constructor de páginas con drag-and-drop
- Componentes reutilizables y personalizables

### 4. **Gestión de Contenido**
- CMS headless con Sanity
- Colaboración en tiempo real
- Historial de revisiones detallado

### 5. **Optimización y Rendimiento**
- Next.js 15 con App Router
- Revalidación estática incremental
- Optimización automática de imágenes

## Comandos Principales

```bash
# Desarrollo
npm run dev

# Importar datos de ejemplo
npm run import-sample-data

# Desplegar el studio
npx sanity deploy

# Generar tipos
npm run typegen
```

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **CMS**: Sanity v3
- **Herramientas**: TypeScript, ESLint, Prettier
- **Despliegue**: Vercel (frontend), Sanity (studio)
- **Adicionales**: Styled Components, Date-fns, Sonner (toasts)