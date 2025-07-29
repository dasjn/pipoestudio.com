import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const homeQuery = defineQuery(`
  *[_type == 'home'][0]{
    _id,
    _type,
    "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
    "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
    "sections": sections[]{
      ...,
      _key,
      _type == "inicioSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "subtitle1": coalesce(subtitle1[_key == $language][0].value, subtitle1[_key == "es"][0].value, subtitle1[0].value),
        "subtitle2": coalesce(subtitle2[_key == $language][0].value, subtitle2[_key == "es"][0].value, subtitle2[0].value),
        "highlightedWord": coalesce(highlightedWord[_key == $language][0].value, highlightedWord[_key == "es"][0].value, highlightedWord[0].value),
        "subtitle3": coalesce(subtitle3[_key == $language][0].value, subtitle3[_key == "es"][0].value, subtitle3[0].value),
        "location": coalesce(location[_key == $language][0].value, location[_key == "es"][0].value, location[0].value),
      },
      _type == "manifiestoSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "content": coalesce(content[_key == $language][0].value, content[_key == "es"][0].value, content[0].value),
        backgroundColor,
      },
      _type == "trabajosSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
        maxPosts,
        backgroundColor,
      },
      _type == "algunaIdeaSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
        backgroundColor,
      },
      _type == "cursosSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
        backgroundColor,
      },
      _type == "tiendaSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
        backgroundColor,
      },
      _type == "contactoSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
        backgroundColor,
      },
    },
  }
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value, "Untitled"),
  "slug": slug.current,
  "excerpt": coalesce(excerpt[_key == $language][0].value, excerpt[_key == "es"][0].value, excerpt[0].value),
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    "name": coalesce(name[_key == $language][0].value, name[_key == "es"][0].value, name[0].value),
    slug,
    "heading": coalesce(heading[_key == $language][0].value, heading[_key == "es"][0].value, heading[0].value),
    "subheading": coalesce(subheading[_key == $language][0].value, subheading[_key == "es"][0].value, subheading[0].value),
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
      _type == "inicioSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "subtitle1": coalesce(subtitle1[_key == $language][0].value, subtitle1[_key == "es"][0].value, subtitle1[0].value),
        "subtitle2": coalesce(subtitle2[_key == $language][0].value, subtitle2[_key == "es"][0].value, subtitle2[0].value),
        "highlightedWord": coalesce(highlightedWord[_key == $language][0].value, highlightedWord[_key == "es"][0].value, highlightedWord[0].value),
        "subtitle3": coalesce(subtitle3[_key == $language][0].value, subtitle3[_key == "es"][0].value, subtitle3[0].value),
        "location": coalesce(location[_key == $language][0].value, location[_key == "es"][0].value, location[0].value),
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    "content": coalesce(content[_key == $language][0].value, content[_key == "es"][0].value, content[0].value)[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const productsQuery = defineQuery(`
  *[_type == "product" && isActive == true] | order(sortOrder asc, _createdAt desc) {
    _id,
    "name": coalesce(name[_key == $language][0].value, name[_key == "es"][0].value, name[0].value),
    "subtitle": coalesce(subtitle[_key == $language][0].value, subtitle[_key == "es"][0].value, subtitle[0].value),
    image {
      asset,
      "alt": coalesce(alt[_key == $language][0].value, alt[_key == "es"][0].value, alt[0].value)
    },
    "buttonText": coalesce(buttonText[_key == $language][0].value, buttonText[_key == "es"][0].value, buttonText[0].value),
    "priceShippingInfo": coalesce(priceShippingInfo[_key == $language][0].value, priceShippingInfo[_key == "es"][0].value, priceShippingInfo[0].value),
    "soldText": coalesce(soldText[_key == $language][0].value, soldText[_key == "es"][0].value, soldText[0].value),
    "slug": slug.current,
    sortOrder,
    sold
  }
`);

export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && isActive == true] | order(sortOrder asc, _createdAt desc) [0...$limit] {
    _id,
    "name": coalesce(name[_key == $language][0].value, name[_key == "es"][0].value, name[0].value),
    "subtitle": coalesce(subtitle[_key == $language][0].value, subtitle[_key == "es"][0].value, subtitle[0].value),
    image {
      asset,
      "alt": coalesce(alt[_key == $language][0].value, alt[_key == "es"][0].value, alt[0].value)
    },
    "buttonText": coalesce(buttonText[_key == $language][0].value, buttonText[_key == "es"][0].value, buttonText[0].value),
    "priceShippingInfo": coalesce(priceShippingInfo[_key == $language][0].value, priceShippingInfo[_key == "es"][0].value, priceShippingInfo[0].value),
    "soldText": coalesce(soldText[_key == $language][0].value, soldText[_key == "es"][0].value, soldText[0].value),
    "slug": slug.current,
    sortOrder,
    sold
  }
`);
