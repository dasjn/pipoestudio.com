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
      name: 'maxPosts',
      title: 'Maximum Posts to Show',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Yellow 200', value: 'bg-yellow-200'},
          {title: 'Gray 100', value: 'bg-gray-100'},
          {title: 'White', value: 'bg-white'},
          {title: 'Clean Gray', value: 'bg-clean-gray'},
        ],
      },
      initialValue: 'bg-yellow-200',
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
        subtitle: 'Trabajos Section',
      }
    },
  },
})