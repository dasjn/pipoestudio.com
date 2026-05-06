import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{ ..., contactEmail }`);

export const blogPageQuery = defineQuery(`
  *[_type == "settings"][0]{
    "blogTitle": coalesce(blogTitle[_key == $language][0].value, blogTitle[_key == "es"][0].value, blogTitle[0].value),
    "blogPostClosing": coalesce(blogPostClosing[_key == $language][0].value, blogPostClosing[_key == "es"][0].value, blogPostClosing[0].value)
  }
`);

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
        "statement": coalesce(statement[_key == $language][0].value, statement[_key == "es"][0].value, statement[0].value),
        "buttonText": coalesce(buttonText[_key == $language][0].value, buttonText[_key == "es"][0].value, buttonText[0].value),
        buttonUrl,
        "fotos": fotos[]{
          "url": image.asset->url,
          "nombre": coalesce(nombre[_key == $language][0].value, nombre[_key == "es"][0].value, nombre[0].value),
          "descripcion": coalesce(descripcion[_key == $language][0].value, descripcion[_key == "es"][0].value, descripcion[0].value),
        },
      },
      _type == "algunaIdeaSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "description": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
        backgroundColor,
      },
      _type == "cursosSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "youtubeLabel": coalesce(youtubeLabel[_key == $language][0].value, youtubeLabel[_key == "es"][0].value, youtubeLabel[0].value),
        "instagramLabel": coalesce(instagramLabel[_key == $language][0].value, instagramLabel[_key == "es"][0].value, instagramLabel[0].value),
        "youtubeVideo": youtubeVideo { "url": asset->url },
        youtubeUrl,
        "instagramVideo": instagramVideo { "url": asset->url },
        instagramUrl,
        "presencialLabel": coalesce(presencialLabel[_key == $language][0].value, presencialLabel[_key == "es"][0].value, presencialLabel[0].value),
        "presencialTitle": coalesce(presencialTitle[_key == $language][0].value, presencialTitle[_key == "es"][0].value, presencialTitle[0].value),
        "presencialHighlight": coalesce(presencialHighlight[_key == $language][0].value, presencialHighlight[_key == "es"][0].value, presencialHighlight[0].value),
        "presencialInfo": coalesce(presencialInfo[_key == $language][0].value, presencialInfo[_key == "es"][0].value, presencialInfo[0].value),
        "presencialButtonText": coalesce(presencialButtonText[_key == $language][0].value, presencialButtonText[_key == "es"][0].value, presencialButtonText[0].value),
        presencialUrl,
      },
      _type == "tiendaSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "subtitle": coalesce(description[_key == $language][0].value, description[_key == "es"][0].value, description[0].value),
      },
      _type == "contactoSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "instagramLabel": coalesce(instagramLabel[_key == $language][0].value, instagramLabel[_key == "es"][0].value, instagramLabel[0].value),
        instagramUrl,
        "youtubeLabel": coalesce(youtubeLabel[_key == $language][0].value, youtubeLabel[_key == "es"][0].value, youtubeLabel[0].value),
        youtubeUrl,
        "formularioLabel": coalesce(formularioLabel[_key == $language][0].value, formularioLabel[_key == "es"][0].value, formularioLabel[0].value),
        formularioUrl,
        "whatsappLabel": coalesce(whatsappLabel[_key == $language][0].value, whatsappLabel[_key == "es"][0].value, whatsappLabel[0].value),
        whatsappNumber,
        "emailLabel": coalesce(emailLabel[_key == $language][0].value, emailLabel[_key == "es"][0].value, emailLabel[0].value),
        email,
        "footerText": coalesce(footerText[_key == $language][0].value, footerText[_key == "es"][0].value, footerText[0].value),
      },
      _type == "SobreMiSection" => {
        "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value),
        "body": coalesce(body[_key == $language][0].value, body[_key == "es"][0].value, body[0].value),
      },
      _type == "postFooterSection" => {
        "thankYouText": coalesce(thankYouText[_key == $language][0].value, thankYouText[_key == "es"][0].value, thankYouText[0].value),
        "musicButtonText": coalesce(musicButtonText[_key == $language][0].value, musicButtonText[_key == "es"][0].value, musicButtonText[0].value),
        "musicUrl": musicFile.asset->url,
      },
    },
  }
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title[_key == $language][0].value, title[_key == "es"][0].value, title[0].value, "Untitled"),
  "slug": slug.current,
  "label": coalesce(label[_key == $language][0].value, label[_key == "es"][0].value, label[0].value),
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
