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
    defineField({
      name: 'presencialLabel',
      title: 'Etiqueta curso presencial (ej: "EN PERSONA")',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'presencialTitle',
      title: 'Título del curso (ej: "PRÓXIMO CURSO: 13→15 DE NOVIEMBRE DE 2025")',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'presencialHighlight',
      title: 'Texto destacado / precio (negrita, ej: "150€/persona.")',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'presencialInfo',
      title: 'Descripción del curso (texto regular)',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'presencialButtonText',
      title: 'Texto del botón (ej: "Me apunto!")',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'presencialUrl',
      title: 'URL de inscripción',
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
