import {defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Product Subtitle',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'internationalizedArrayString',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'internationalizedArrayString',
      initialValue: [
        {_key: 'es', value: '¡LO QUIERO!'},
        {_key: 'en', value: 'I WANT IT!'},
      ],
    }),
    defineField({
      name: 'priceShippingInfo',
      title: 'Price & Shipping Information',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'isActive',
      title: 'Active Product',
      type: 'boolean',
      description: 'Only active products will be shown on the website',
      initialValue: true,
    }),
    defineField({
      name: 'sold',
      title: 'Sold Out',
      type: 'boolean',
      description: 'Mark this product as sold out',
      initialValue: false,
    }),
    defineField({
      name: 'soldText',
      title: 'Sold Text',
      type: 'internationalizedArrayString',
      description: 'Text to display when product is sold out',
      initialValue: [
        {_key: 'es', value: '¡VENDIDO!'},
        {_key: 'en', value: 'SOLD OUT!'},
      ],
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Use this to control the order of products.',
      validation: (rule) => rule.required(),
      initialValue: 0,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Sort Order (Ascending)',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Sort Order (Descending)',
      name: 'sortOrderDesc',
      by: [{field: 'sortOrder', direction: 'desc'}],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'subtitle',
      media: 'image',
      sortOrder: 'sortOrder',
      isActive: 'isActive',
      sold: 'sold',
    },
    prepare({title, subtitle, media, sortOrder, isActive, sold}) {
      const displayTitle = Array.isArray(title) ? title[0]?.value || 'Untitled' : 'Untitled'
      const displaySubtitle = Array.isArray(subtitle) ? subtitle[0]?.value : ''
      const statusText = isActive ? '✅' : '❌'
      const soldText = sold ? '🔴' : ''

      return {
        title: `${statusText}${soldText} [${sortOrder}] ${displayTitle}`,
        subtitle: `${displaySubtitle}${sold ? ' (VENDIDO)' : ''}`,
        media,
      }
    },
  },
})
