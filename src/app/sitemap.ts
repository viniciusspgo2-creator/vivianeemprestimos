import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSettings, siteUrl } from "@/lib/settings";
import { ensureSeedPosts } from "@/lib/blog-seed";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/fgts`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/servicos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    await ensureSeedPosts();
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...staticPages, ...blogPages];
  } catch {
    // banco indisponível no build — sitemap com as páginas estáticas
    return staticPages;
  }
}
