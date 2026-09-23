import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/site-config";

type MetaInput = {
  settings: SiteSettings;
  baseUrl: string;
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogImage?: string;
  robots?: string;
};

/** Enterprise metadata builder: canonical, OG, Twitter, robots, geo tags */
export function buildMetadata(input: MetaInput): Metadata {
  const { settings, baseUrl, title, description, path } = input;
  const url = `${baseUrl}${path === "/" ? "" : path}`;
  const image = input.ogImage || settings.seoOgImage;
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;
  const robots = input.robots || settings.seoRobotsIndex;

  return {
    title: { absolute: title },
    description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: {
      index: robots.includes("index"),
      follow: robots.includes("follow"),
      googleBot: {
        index: robots.includes("index"),
        follow: robots.includes("follow"),
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: { telephone: true },
    other: {
      "geo.region": "BR-SP",
      "geo.placename": "Bady Bassitt",
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: settings.siteName,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Rua Bento Vieira, R. Hernildo Simonato, 251 - Colina Sul",
  addressLocality: "Bady Bassitt",
  addressRegion: "SP",
  postalCode: "15115-000",
  addressCountry: "BR",
};

export function organizationSchema(settings: SiteSettings, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.webp`,
    image: `${baseUrl}${settings.seoOgImage}`,
    telephone: `+${settings.phone}`,
    address: POSTAL_ADDRESS,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${settings.phone}`,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };
}

export function localBusinessSchema(settings: SiteSettings, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${baseUrl}/#localbusiness`,
    name: settings.siteName,
    telephone: `+${settings.phone}`,
    url: baseUrl,
    image: `${baseUrl}${settings.seoOgImage}`,
    logo: `${baseUrl}/images/logo.webp`,
    address: POSTAL_ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: -20.9164, longitude: -49.4406 },
    areaServed: [
      { "@type": "City", name: "Bady Bassitt" },
      { "@type": "Country", name: "Brasil" },
    ],
    description:
      "Soluções financeiras com atendimento presencial em Bady Bassitt/SP e digital em nível nacional: empréstimo consignado, antecipação FGTS, crédito pessoal, cartão consignado e seguros.",
    knowsAbout: [
      "Empréstimo Consignado",
      "Antecipação Saque-Aniversário FGTS",
      "Crédito Pessoal",
      "Cartão Consignado",
      "Consórcios",
      "Seguros",
    ],
    sameAs: [],
  };
}

export function websiteSchema(settings: SiteSettings, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: settings.siteName,
    url: baseUrl,
    inLanguage: "pt-BR",
    publisher: { "@id": `${baseUrl}/#localbusiness` },
  };
}

export function webPageSchema(
  settings: SiteSettings,
  baseUrl: string,
  path: string,
  name: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${path === "/" ? "" : path}#webpage`,
    name,
    description,
    url: `${baseUrl}${path === "/" ? "" : path}`,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${baseUrl}/#website` },
    about: { "@id": `${baseUrl}/#localbusiness` },
  };
}

export function breadcrumbSchema(
  baseUrl: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(
  settings: SiteSettings,
  baseUrl: string,
  services: { name: string; description: string }[]
) {
  return services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: s.name,
    name: s.name,
    description: s.description,
    provider: { "@id": `${baseUrl}/#localbusiness` },
    areaServed: [
      { "@type": "City", name: "Bady Bassitt" },
      { "@type": "Country", name: "Brasil" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${baseUrl}/contato`,
    },
  }));
}

export function videoSchema(settings: SiteSettings, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Vídeo institucional Viviane Empréstimos",
    description:
      "Conheça mais sobre o trabalho e o atendimento da Viviane Empréstimos: soluções financeiras com atendimento presencial e digital.",
    thumbnailUrl: [`${baseUrl}${settings.seoOgImage}`],
    uploadDate: "2025-01-15T08:00:00-03:00",
    embedUrl: `https://www.youtube-nocookie.com/embed/${settings.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${settings.youtubeId}`,
    publisher: { "@id": `${baseUrl}/#localbusiness` },
    inLanguage: "pt-BR",
  };
}

export function blogPostingSchema(
  settings: SiteSettings,
  baseUrl: string,
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    author: string | null;
    publishedAt: Date | null;
    updatedAt: Date;
  }
) {
  const url = `${baseUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: post.coverImage ? [`${baseUrl}${post.coverImage}`] : undefined,
    datePublished: (post.publishedAt ?? post.updatedAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author || "Equipe Viviane Empréstimos",
    },
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      logo: { "@type": "ImageObject", url: `${baseUrl}/images/logo.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "pt-BR",
  };
}
