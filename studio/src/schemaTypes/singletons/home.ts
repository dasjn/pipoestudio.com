import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  // Singleton - only one home page document
  __experimental_actions: [
    // 'create',
    'update',
    // 'delete',
    'publish',
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'internationalizedArrayText',
      description: 'Used for SEO meta description',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {type: 'inicioSection'},
        {type: 'manifiestoSection'},
        {type: 'trabajosSection'},
        {type: 'algunaIdeaSection'},
        {type: 'cursosSection'},
        {type: 'SobreMiSection'},
        {type: 'tiendaSection'},
        {type: 'contactoSection'},
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/section-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      const displayTitle = Array.isArray(title) ? title[0]?.value || 'Home Page' : 'Home Page'
      return {
        title: displayTitle,
        subtitle: 'Home Page Configuration',
      }
    },
  },
})