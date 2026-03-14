import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const contactoSection = defineType({
  name: 'contactoSection',
  title: 'Contacto Section',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instagramLabel',
      title: 'Label Instagram',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'URL Instagram',
      type: 'url',
    }),
    defineField({
      name: 'youtubeLabel',
      title: 'Label YouTube',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'URL YouTube',
      type: 'url',
    }),
    defineField({
      name: 'formularioLabel',
      title: 'Label Formulario de Contacto',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'formularioUrl',
      title: 'URL del Formulario (página interna)',
      type: 'url',
    }),
    defineField({
      name: 'whatsappLabel',
      title: 'Label WhatsApp',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Número WhatsApp (ej: 34612345678, sin + ni espacios)',
      type: 'string',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Label Email (texto visible en el botón)',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'footerText',
      title: 'Texto de pie (ej: PIPO. HECHO DESDE 2022 EN ARUCAS...)',
      type: 'internationalizedArrayText',
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
        subtitle: 'Contacto Section',
      }
    },
  },
})
