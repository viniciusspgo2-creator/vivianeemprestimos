import type { Metadata } from "next";
import Link from "next/link";
import { getSettings, siteUrl } from "@/lib/settings";
import { buildMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { db } from "@/lib/db";
import { ensureSeedPosts } from "@/lib/blog-seed";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: settings.seoBlogTitle,
    description: settings.seoBlogDescription,
    path: "/blog",
    keywords:
      "blog crédito, antecipação fgts, empréstimo consignado, crédito pessoal, saque aniversário, educação financeira",
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage() {
  const settings = await getSettings();
  const base = siteUrl(settings);

  await ensureSeedPosts();

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    posts = await getPosts();
  } catch {
    posts = [];
  }

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            settings,
            base,
            "/blog",
            settings.seoBlogTitle,
            settings.seoBlogDescription
          ),
          breadcrumbSchema(base, [
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />

      <section className="blog-hero">
        <div className="container">
          <span className="breadcrumb">Home / Blog</span>
          <h1>Conteúdo para decidir com segurança.</h1>
          <p>
            Guias práticos sobre antecipação do FGTS, empréstimo consignado,
            crédito pessoal e proteção contra golpes — escritos pela equipe
            Viviane Empréstimos.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <p>Os artigos estão sendo preparados. Volte em breve!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <article className="blog-card reveal" key={post.slug}>
                  <figure>
                    <img
                      src={post.coverImage || "/images/consultoria.webp"}
                      alt={post.title}
                      width={420}
                      height={210}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span>{formatDate(post.publishedAt ?? post.updatedAt)}</span>
                      {post.tags ? (
                        <span>{post.tags.split(",")[0]?.trim()}</span>
                      ) : null}
                    </div>
                    <h3>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <Link className="blog-card__more" href={`/blog/${post.slug}`}>
                      Ler artigo completo →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

async function getPosts() {
  return db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}
