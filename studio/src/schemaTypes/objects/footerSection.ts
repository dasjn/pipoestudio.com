import {defineField, defineType} from 'sanity'

export const footerSection = defineType({
  name: 'footerSection',
  title: 'Footer Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Título principal',
      type: 'internationalizedArrayString',
      description: 'Ej: LO ÚNICO ES LO NORMAL',
    }),
    defineField({
      name: 'captionText',
      title: 'Texto del pie',
      type: 'internationalizedArrayString',
      description: 'Ej: Made for Pipo with love byfugu',
    }),
    defineField({
      name: 'captionUrl',
      title: 'Enlace del pie',
      type: 'url',
      description: 'Ej: https://www.byfugu.com',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      const displayTitle = Array.isArray(title) ? title[0]?.value || 'Footer' : 'Footer'
      return {title: displayTitle, subtitle: 'Footer Section'}
    },
  },
})
