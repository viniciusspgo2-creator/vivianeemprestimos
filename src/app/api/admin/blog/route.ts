import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, posts });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const title = String(b.title || "").trim();
  const content = String(b.content || "").trim();
  if (!title || !content)
    return NextResponse.json(
      { ok: false, error: "Título e conteúdo são obrigatórios." },
      { status: 400 }
    );

  let slug = slugify(String(b.slug || title));
  let unique = slug;
  let i = 2;
  while (await db.blogPost.findUnique({ where: { slug: unique } })) {
    unique = `${slug}-${i++}`;
  }

  const published = Boolean(b.published);
  const post = await db.blogPost.create({
    data: {
      slug: unique,
      title,
      content,
      excerpt: String(b.excerpt || ""),
      coverImage: String(b.coverImage || ""),
      metaTitle: String(b.metaTitle || ""),
      metaDescription: String(b.metaDescription || ""),
      author: String(b.author || "Equipe Viviane Empréstimos"),
      tags: String(b.tags || ""),
      published,
      publishedAt: published ? new Date() : null,
    },
  });
  return NextResponse.json({ ok: true, post });
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = String(b.id || "");
  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json(
      { ok: false, error: "Post não encontrado." },
      { status: 404 }
    );

  const published = Boolean(b.published);
  const post = await db.blogPost.update({
    where: { id },
    data: {
      title: String(b.title ?? existing.title),
      content: String(b.content ?? existing.content),
      excerpt: String(b.excerpt ?? existing.excerpt ?? ""),
      coverImage: String(b.coverImage ?? existing.coverImage ?? ""),
      metaTitle: String(b.metaTitle ?? existing.metaTitle ?? ""),
      metaDescription: String(
        b.metaDescription ?? existing.metaDescription ?? ""
      ),
      author: String(b.author ?? existing.author ?? ""),
      tags: String(b.tags ?? existing.tags ?? ""),
      published,
      publishedAt:
        published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  await db.blogPost.deleteMany({ where: { id } });
  return NextResponse.json({ ok: true });
}
