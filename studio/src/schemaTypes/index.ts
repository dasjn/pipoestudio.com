import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {product} from './documents/product'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {inicioSection} from './objects/inicioSection'
import {manifiestoSection} from './objects/manifiestoSection'
import {trabajosSection} from './objects/trabajosSection'
import {algunaIdeaSection} from './objects/algunaIdeaSection'
import {cursosSection} from './objects/cursosSection'
import {tiendaSection} from './objects/tiendaSection'
import {contactoSection} from './objects/contactoSection'
import {settings} from './singletons/settings'
import {home} from './singletons/home'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  home,
  // Documents
  page,
  post,
  person,
  product,
  // Objects
  blockContent,
  infoSection,
  inicioSection,
  manifiestoSection,
  trabajosSection,
  algunaIdeaSection,
  cursosSection,
  tiendaSection,
  contactoSection,
  callToAction,
  link,
]
