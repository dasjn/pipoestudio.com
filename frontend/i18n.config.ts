export const i18n = {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  languageField: 'language'
} as const

export type Locale = (typeof i18n)['locales'][number]

export const languages = [
  { id: 'es', title: 'Español' },
  { id: 'en', title: 'English' }
] as const