import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const postFooterSection = defineType({
  name: 'postFooterSection',
  title: 'Post Footer Section',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'thankYouText',
      title: 'Texto de agradecimiento',
      type: 'internationalizedArrayString',
      description: 'Ej: GRACIAS POR TU VISITA',
    }),
    defineField({
      name: 'musicButtonText',
      title: 'Texto del botón de música',
      type: 'internationalizedArrayString',
      description: 'Ej: PLAY MUSIC',
    }),
    defineField({
      name: 'musicFile',
      title: 'Archivo de música (MP3)',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
    }),
  ],
  preview: {
    select: {
      title: 'thankYouText',
    },
    prepare({title}) {
      const displayTitle = Array.isArray(title) ? title[0]?.value || 'Post Footer' : 'Post Footer'
      return {
        title: displayTitle,
        subtitle: 'Post Footer Section',
      }
    },
  },
})
