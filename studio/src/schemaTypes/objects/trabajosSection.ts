import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export const trabajosSection = defineType({
  name: 'trabajosSection',
  title: 'Trabajos Section',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título (interno)',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'statement',
      title: 'Texto',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'buttonText',
      title: 'Texto del botón',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'buttonUrl',
      title: 'URL del botón',
      type: 'url',
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos (máx. 4)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'trabajoFoto',
          title: 'Foto',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'nombre',
              title: 'Nombre / Título',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripción',
              type: 'internationalizedArrayString',
            }),
          ],
          preview: {
            select: {title: 'nombre', media: 'image'},
            prepare({title, media}: {title: any; media: any}) {
              const displayTitle = Array.isArray(title)
                ? title[0]?.value || 'Sin título'
                : title || 'Sin título'
              return {title: displayTitle, media}
            },
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    // Campos legacy — ocultos para no mostrar "unknown fields"
    defineField({
      name: 'description',
      title: 'Description (legacy)',
      type: 'internationalizedArrayText',
      hidden: true,
    }),
    defineField({
      name: 'maxPosts',
      title: 'Max Posts (legacy)',
      type: 'number',
      hidden: true,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color (legacy)',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      const displayTitle = Array.isArray(title) ? title[0]?.value || 'Trabajos Section' : 'Trabajos Section'
      return {
        title: displayTitle,
        subtitle: 'Trabajos Section',
      }
    },
  },
})
