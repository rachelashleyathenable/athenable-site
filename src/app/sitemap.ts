import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";
import { siteConfig } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

const staticRoutes = ["", "/a-propos", "/services", "/blog", "/contact"];

function localePath(locale: string, route: string) {
  return locale === routing.defaultLocale ? route : `/${locale}${route}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  type PostForSitemap = { slug: { current: string }; publishedAt: string };
  const posts = await client.fetch<PostForSitemap[]>(POSTS_QUERY).catch(() => []);

  const staticEntries = routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${siteConfig.siteUrl}${localePath(locale, route)}`,
      lastModified: new Date(),
    })),
  );

  const postEntries = routing.locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${siteConfig.siteUrl}${localePath(locale, `/blog/${post.slug.current}`)}`,
      lastModified: new Date(post.publishedAt),
    })),
  );

  return [...staticEntries, ...postEntries];
}
