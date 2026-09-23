import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings, siteUrl } from "@/lib/settings";
import {
  blogPostingSchema,
  breadcrumbSchema,
  buildMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { whatsappUrl } from "@/lib/site-config";
import { ensureSeedPosts } from "@/lib/blog-seed";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  try {
    return await db.blogPost.findFirst({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSettings();
  const post = await getPost(slug);
  if (!post) {
    return buildMetadata({
      settings,
      baseUrl: siteUrl(settings),
      title: "Artigo não encontrado",
      description: "O artigo solicitado não foi encontrado.",
      path: `/blog/${slug}`,
      robots: "noindex,nofollow",
    });
  }
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.title,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage || undefined,
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await ensureSeedPosts();
  const post = await getPost(slug);
  if (!post) notFound();

  const settings = await getSettings();
  const base = siteUrl(settings);
  const wa = whatsappUrl(
    settings,
    `Olá! Li o artigo "${post.title}" e quero tirar uma dúvida.`
  );

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(settings, base, post),
          breadcrumbSchema(base, [
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <section className="blog-hero">
        <div className="container">
          <span className="breadcrumb">Home / Blog</span>
          <h1>{post.title}</h1>
          <div className="blog-card__meta" style={{ marginTop: 14 }}>
            <span>
              {formatDate(post.publishedAt ?? post.updatedAt)}
            </span>
            <span>{post.author || "Equipe Viviane Empréstimos"}</span>
          </div>
        </div>
      </section>

      <section className="section blog-post-section">
        <div className="container blog-post-container">
          {post.coverImage ? (
            <figure className="blog-post-cover">
              <img
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={675}
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          ) : null}

          {post.excerpt ? (
            <p className="blog-post-lead">{post.excerpt}</p>
          ) : null}

          <article className="blog-post-content">
            {post.content.split("\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## ")) {
                return <h2 key={i}>{trimmed.slice(3)}</h2>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={i}>{trimmed.slice(4)}</h3>;
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <ul key={i}>
                    <li>{trimmed.slice(2)}</li>
                  </ul>
                );
              }
              return <p key={i}>{trimmed}</p>;
            })}
          </article>

          {post.tags ? (
            <div className="blog-post-tags">
              {post.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
            </div>
          ) : null}

          <aside className="blog-post-cta">
            <h2>Quer descobrir a solução ideal para o seu perfil?</h2>
            <p>
              Fale com a equipe da {settings.siteName}: analisamos as opções
              disponíveis para você, sem compromisso e com atendimento
              presencial ou digital.
            </p>
            <a
              className="btn btn-orange"
              href={wa}
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon className="icon" /> Falar no WhatsApp
            </a>
          </aside>

          <Link className="blog-post-back" href="/blog">
            <ArrowLeft className="icon" /> Voltar para todos os artigos
          </Link>
        </div>
      </section>
    </>
  );
}
