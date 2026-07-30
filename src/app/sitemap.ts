import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";
import { siteConfig } from "@/lib/site-config";

const staticRoutes = ["", "/a-propos", "/services", "/blog", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  type PostForSitemap = { slug: { current: string }; publishedAt: string };
  const posts = await client.fetch<PostForSitemap[]>(POSTS_QUERY).catch(() => []);

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const postEntries = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...postEntries];
}
