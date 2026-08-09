import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, tag, category, excerpt, externalUrl, publishedAt
  }
`);

export const POSTS_BY_LANGUAGE_QUERY = defineQuery(`
  *[_type == "post" && language == $language] | order(publishedAt desc) {
    _id, title, slug, tag, category, excerpt, externalUrl, publishedAt
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $language][0] {
    _id, title, slug, tag, category, excerpt, externalUrl, body, publishedAt
  }
`);

export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "post" && category == $category && language == $language] | order(publishedAt desc) {
    _id, title, slug, tag, category, excerpt, externalUrl, publishedAt
  }
`);
