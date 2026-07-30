import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, tag, excerpt, externalUrl, publishedAt
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, tag, excerpt, externalUrl, body, publishedAt
  }
`);
