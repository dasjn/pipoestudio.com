import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons'

export const cursosSection = defineType({
  name: 'cursosSection',
  title: 'Cursos Section',
  type: 'object',
  icon: BookIcon,
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
          {title: 'Orange 200', value: 'bg-orange-200'},
          {title: 'Gray 100', value: 'bg-gray-100'},
          {title: 'White', value: 'bg-white'},
          {title: 'Clean Gray', value: 'bg-clean-gray'},
        ],
      },
      initialValue: 'bg-orange-200',
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
        subtitle: 'Cursos Section',
      }
    },
  },
})