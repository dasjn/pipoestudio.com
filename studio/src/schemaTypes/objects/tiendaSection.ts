import {defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

export const tiendaSection = defineType({
  name: 'tiendaSection',
  title: 'Tienda Section',
  type: 'object',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Green 200', value: 'bg-green-200'},
          {title: 'Gray 100', value: 'bg-gray-100'},
          {title: 'White', value: 'bg-white'},
          {title: 'Clean Gray', value: 'bg-clean-gray'},
        ],
      },
      initialValue: 'bg-green-200',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      const displayTitle = Array.isArray(title) ? title[0]?.value || 'Untitled' : 'Untitled'
      return {
        title: displayTitle,
        subtitle: 'Tienda Section',
      }
    },
  },
})