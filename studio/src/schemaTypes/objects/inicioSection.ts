import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const inicioSection = defineType({
  name: 'inicioSection',
  title: 'Inicio Section',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle1',
      title: 'Subtitle 1',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'subtitle2',
      title: 'Subtitle 2',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'highlightedWord',
      title: 'Highlighted Word',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'subtitle3',
      title: 'Subtitle 3',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'internationalizedArrayString',
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
        subtitle: 'Inicio Section',
      }
    },
  },
})