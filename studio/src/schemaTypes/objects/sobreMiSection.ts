import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const sobreMiSection = defineType({
  name: 'SobreMiSection',
  title: 'Sobre Pipo Section',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'internationalizedArrayText',
      description: 'Texto principal en verde. Ej: "EN PIPO NO HACEMOS COSAS DISTINTAS..."',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      statement: 'statement',
    },
    prepare({statement}) {
      const text = Array.isArray(statement) ? statement[0]?.value || 'Sobre Pipo' : 'Sobre Pipo'
      return {
        title: text.slice(0, 60),
        subtitle: 'Sobre Pipo Section',
      }
    },
  },
})
