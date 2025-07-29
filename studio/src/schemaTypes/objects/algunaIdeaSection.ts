import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

export const algunaIdeaSection = defineType({
  name: 'algunaIdeaSection',
  title: 'Alguna Idea Section',
  type: 'object',
  icon: BulbOutlineIcon,
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
          {title: 'Purple 200', value: 'bg-purple-200'},
          {title: 'Gray 100', value: 'bg-gray-100'},
          {title: 'White', value: 'bg-white'},
          {title: 'Clean Gray', value: 'bg-clean-gray'},
        ],
      },
      initialValue: 'bg-purple-200',
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
        subtitle: 'Alguna Idea Section',
      }
    },
  },
})