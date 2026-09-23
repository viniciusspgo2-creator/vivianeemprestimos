import "server-only";
import { db } from "@/lib/db";
import { SEED_POSTS } from "@/lib/seed-posts";

const g = globalThis as unknown as { __blogSeedChecked?: boolean };

/**
 * Insere os 6 artigos estratégicos automaticamente quando o blog
 * está vazio (primeiro deploy / banco novo). Idempotente e
 * build-safe: nunca quebra a renderização se o banco falhar.
 */
export async function ensureSeedPosts(): Promise<void> {
  if (g.__blogSeedChecked) return;
  try {
    const count = await db.blogPost.count();
    if (count === 0) {
      await db.blogPost.createMany({
        data: SEED_POSTS.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage,
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          author: p.author,
          tags: p.tags,
          published: true,
          publishedAt: new Date(p.publishedAt),
        })),
      });
    }
    g.__blogSeedChecked = true;
  } catch {
    // banco indisponível (build frio, migração pendente) — segue o fluxo
  }
}
