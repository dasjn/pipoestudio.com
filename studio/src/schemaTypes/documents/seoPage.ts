import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const seoPage = defineType({
  name: 'seoPage',
  title: 'Página SEO',
  icon: SearchIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título (H1)',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Ej: carpinteria-artesanal-gran-canaria → la URL será /es/carpinteria-artesanal-gran-canaria',
      options: {
        source: (doc: any) => {
          if (Array.isArray(doc.title)) {
            const es = doc.title.find((t: any) => t._key === 'es')
            return es?.value || doc.title[0]?.value || ''
          }
          return doc.title || ''
        },
        maxLength: 128,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta descripción (SEO)',
      type: 'internationalizedArrayText',
      description: 'Aparece en Google bajo el título. Ideal entre 120-160 caracteres.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero — Subtítulo grande',
      type: 'internationalizedArrayString',
      description: 'Texto grande bajo el logo. Ej: Muebles a medida en Gran Canaria hechos a mano...',
    }),
    defineField({
      name: 'heroIntroText',
      title: 'Hero — Texto de introducción',
      type: 'internationalizedArrayText',
      description: 'Párrafo de intro que aparece en mayúsculas y negrita bajo el subtítulo.',
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'internationalizedArrayBlockContent',
      description: 'El cuerpo completo de la página. Usa H2/H3 para estructurar, listas, negritas, etc.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada / OG',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'internationalizedArrayString',
          title: 'Texto alternativo',
          description: 'Importante para SEO y accesibilidad.',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      media: 'coverImage',
    },
    prepare({title, slug, media}: any) {
      const displayTitle = Array.isArray(title)
        ? title.find((t: any) => t._key === 'es')?.value || title[0]?.value || 'Sin título'
        : 'Sin título'
      return {
        title: displayTitle,
        subtitle: slug?.current ? `/${slug.current}` : 'Sin slug',
        media,
      }
    },
  },
})
