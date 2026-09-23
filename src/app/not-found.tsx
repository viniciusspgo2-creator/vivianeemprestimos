import Link from "next/link";
import type { Metadata } from "next";
import { getSettings, siteUrl } from "@/lib/settings";
import { whatsappUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Página não encontrada",
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const wa = whatsappUrl(settings);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        background: "linear-gradient(120deg,#0a174f 0%,#17378e 65%,#245bd6 100%)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div>
        <img
          src="/images/logo.webp"
          alt={settings.siteName}
          width={160}
          height={84}
          style={{ margin: "0 auto 30px", objectFit: "contain" }}
        />
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "#ff9e2c",
            marginBottom: 10,
          }}
        >
          Erro 404
        </p>
        <h1
          style={{
            fontSize: "clamp(34px,5vw,54px)",
            letterSpacing: "-.05em",
            lineHeight: 1.05,
            margin: "0 0 16px",
          }}
        >
          Página não encontrada.
        </h1>
        <p style={{ color: "#dbe5ff", maxWidth: 520, margin: "0 auto 28px" }}>
          O endereço acessado não existe ou foi movido. Volte para a página
          inicial ou fale com a equipe da {settings.siteName}.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link className="btn btn-orange" href="/">
            Voltar ao início
          </Link>
          <a
            className="btn btn-outline-light"
            href={wa}
            target="_blank"
            rel="noopener"
          >
            Falar no WhatsApp
          </a>
        </div>
        <p
          style={{
            marginTop: 26,
            fontSize: 12,
            color: "#aebce3",
          }}
        >
          {base}
        </p>
      </div>
    </div>
  );
}
