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
      name: 'fotos',
      title: 'Fotos (máx. 4)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
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
