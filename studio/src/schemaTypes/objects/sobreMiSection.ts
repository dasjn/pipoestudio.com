import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const sobreMiSection = defineType({
  name: 'SobreMiSection',
  title: 'Sobre Pipo Section',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título (ej: "SOBRE PIPO")',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo (párrafos separados por línea en blanco)',
      type: 'internationalizedArrayText',
      description: 'Cada párrafo separado por una línea en blanco. El último párrafo se muestra en negrita.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'verMasUrl',
      title: 'URL del botón "Ver más"',
      type: 'string',
      description: 'Ej: /es/carpinteria-artesanal-gran-canaria. Déjalo vacío para ocultar el botón.',
    }),
  ],
  preview: {
    select: {
      statement: 'statement',
    },
    prepare({title}: {title: unknown}) {
      const text = Array.isArray(title) ? (title[0] as {value?: string})?.value || 'Sobre Pipo' : 'Sobre Pipo'
      return {
        title: text.slice(0, 60),
        subtitle: 'Sobre Pipo Section',
      }
    },
  },
})
