import type { Metadata } from "next";
import { getSettings, siteUrl } from "@/lib/settings";
import { buildMetadata, videoSchema, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { SpriteIcon } from "@/components/site/icons";
import { whatsappUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: settings.seoSobreTitle,
    description: settings.seoSobreDescription,
    path: "/sobre",
  });
}

export default async function SobrePage() {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const wa = whatsappUrl(settings);

  const bannerStyle = settings.bannerSobre
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(13,27,94,.9), rgba(36,91,214,.78)), url(${settings.bannerSobre})`,
      }
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            settings,
            base,
            "/sobre",
            settings.seoSobreTitle,
            settings.seoSobreDescription
          ),
          breadcrumbSchema(base, [
            { name: "Início", path: "/" },
            { name: "Sobre nós", path: "/sobre" },
          ]),
          videoSchema(settings, base),
        ]}
      />

      <section className="inner-hero" style={bannerStyle}>
        <div className="container">
          <span className="breadcrumb">Home / Sobre nós</span>
          <h1>
            Soluções completas
            <br />
            onde você estiver.
          </h1>
          <p>
            Atendimento presencial em Bady Bassitt/SP e digital em nível
            nacional, com mais de 15 anos de atuação no mercado.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <figure className="media-card reveal">
            <img
              src="/images/fachada.webp"
              alt="Fachada da Viviane Empréstimos em Bady Bassitt"
              width={600}
              height={480}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="reveal">
            <span className="eyebrow">Viviane Empréstimos</span>
            <h2>Suporte financeiro presencial e digital.</h2>
            <p className="lead">
              Em busca de soluções financeiras eficazes e transparentes? A
              Viviane Empréstimos oferece suporte completo, com a flexibilidade
              de um <strong>atendimento presencial e digital</strong>.
            </p>
            <p>
              Nossa atuação em nível nacional ajuda você a acessar as opções
              disponíveis onde estiver. Fale com a equipe e descubra as
              soluções adequadas para o seu perfil e seus objetivos.
            </p>
            <div className="stat-row">
              <div className="stat">
                <strong>+15</strong>
                <span>anos de atuação</span>
              </div>
              <div className="stat">
                <strong>2</strong>
                <span>formas de atendimento</span>
              </div>
              <div className="stat">
                <strong>Brasil</strong>
                <span>cobertura digital</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-band">
        <div className="container comparison">
          <article className="reveal">
            <span className="icon">
              <SpriteIcon name="store" />
            </span>
            <div>
              <h3>Atendimento presencial</h3>
              <p>
                Receba atendimento em Bady Bassitt/SP, com orientação durante
                as etapas da solicitação.
              </p>
            </div>
          </article>
          <article className="reveal">
            <span className="icon orange">
              <SpriteIcon name="phone" />
            </span>
            <div>
              <h3>Atendimento digital</h3>
              <p>
                Converse com a equipe pelo WhatsApp e acesse o atendimento de
                qualquer lugar do país.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section video-section">
        <div className="container video-grid">
          <div className="video reveal">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${settings.youtubeId}?rel=0`}
              title="Vídeo institucional Viviane Empréstimos"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="reveal">
            <span className="eyebrow">Vídeo institucional</span>
            <h2>O caminho para suas conquistas financeiras.</h2>
            <p>
              Conheça mais sobre o atendimento da Viviane Empréstimos e fale
              com nossa equipe para verificar as soluções disponíveis.
            </p>
            <a className="btn btn-blue" href={wa} target="_blank" rel="noopener">
              Fale com a Viviane
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
