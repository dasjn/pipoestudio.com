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
      title: 'Título (ej: "APRENDE CON PIPO")',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'youtubeLabel',
      title: 'Etiqueta video YouTube (ej: "EN YOUTUBE")',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'instagramLabel',
      title: 'Etiqueta video Instagram (ej: "EN INSTAGRAM")',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'youtubeVideo',
      title: 'Video YouTube (vertical, loop)',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'Link YouTube (canal o vídeo)',
      type: 'url',
    }),
    defineField({
      name: 'instagramVideo',
      title: 'Video Instagram (vertical, loop)',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Link Instagram (perfil o reel)',
      type: 'url',
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
