import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const manifiestoSection = defineType({
  name: 'manifiestoSection',
  title: 'Manifiesto Section',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Blue 200', value: 'bg-blue-200'},
          {title: 'Gray 100', value: 'bg-gray-100'},
          {title: 'White', value: 'bg-white'},
          {title: 'Clean Gray', value: 'bg-clean-gray'},
        ],
      },
      initialValue: 'bg-blue-200',
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
        subtitle: 'Manifiesto Section',
      }
    },
  },
})