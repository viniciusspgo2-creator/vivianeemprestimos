import type { Metadata } from "next";
import { getSettings, siteUrl } from "@/lib/settings";
import { buildMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { SpriteIcon } from "@/components/site/icons";
import { LeadForm } from "@/components/site/lead-form";
import { mapsUrl, whatsappUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: settings.seoContatoTitle,
    description: settings.seoContatoDescription,
    path: "/contato",
  });
}

export default async function ContatoPage() {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const wa = whatsappUrl(settings);
  const waSite = whatsappUrl(
    settings,
    "Olá! Vim pelo site e gostaria de atendimento."
  );

  const bannerStyle = settings.bannerContato
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(13,27,94,.9), rgba(36,91,214,.78)), url(${settings.bannerContato})`,
      }
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            settings,
            base,
            "/contato",
            settings.seoContatoTitle,
            settings.seoContatoDescription
          ),
          breadcrumbSchema(base, [
            { name: "Início", path: "/" },
            { name: "Contato", path: "/contato" },
          ]),
        ]}
      />

      <section className="inner-hero" style={bannerStyle}>
        <div className="container">
          <span className="breadcrumb">Home / Contato</span>
          <h1>Fale conosco.</h1>
          <p>
            Estamos prontos para atender você, tirar suas dúvidas e orientar
            sobre as soluções disponíveis.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-card reveal">
            <span className="eyebrow">Canais de atendimento</span>
            <h2>Escolha como prefere conversar.</h2>
            <div className="mini-info">
              <span className="icon">
                <SpriteIcon name="phone" />
              </span>
              <p>
                <strong>WhatsApp e telefone</strong>
                <a href={wa} target="_blank" rel="noopener">
                  {settings.phoneDisplay}
                </a>
              </p>
            </div>
            <div className="mini-info">
              <span className="icon">
                <SpriteIcon name="store" />
              </span>
              <p>
                <strong>Atendimento presencial</strong>
                {settings.address}
              </p>
            </div>
            <div className="mini-info">
              <span className="icon">
                <SpriteIcon name="globe" />
              </span>
              <p>
                <strong>Atendimento digital</strong>
                Cobertura em nível nacional.
              </p>
            </div>
            <a className="btn btn-orange" href={waSite} target="_blank" rel="noopener">
              Iniciar conversa no WhatsApp
            </a>

            <LeadForm phone={settings.phone} siteName={settings.siteName} />
            <a href={mapsUrl(settings)} target="_blank" rel="noopener">
              Ver endereço no Google Maps →
            </a>
          </div>
          <figure className="media-card reveal">
            <img
              src="/images/fachada.webp"
              alt="Fachada da Viviane Empréstimos"
              width={600}
              height={520}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="info-band">
        <div className="container comparison">
          <article className="reveal">
            <span className="icon">
              <SpriteIcon name="store" />
            </span>
            <div>
              <h3>Atendimento em Bady Bassitt</h3>
              <p>Visite a unidade para receber atendimento presencial.</p>
            </div>
          </article>
          <article className="reveal">
            <span className="icon orange">
              <SpriteIcon name="phone" />
            </span>
            <div>
              <h3>Atendimento onde você estiver</h3>
              <p>
                Converse pelo WhatsApp e receba orientação de forma digital.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
