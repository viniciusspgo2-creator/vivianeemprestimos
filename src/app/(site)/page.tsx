import type { Metadata } from "next";
import { getSettings, siteUrl } from "@/lib/settings";
import { buildMetadata, faqSchema, serviceSchema, videoSchema, webPageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { SpriteIcon } from "@/components/site/icons";
import { AccordionGroup } from "@/components/site/motion";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: settings.seoHomeTitle,
    description: settings.seoHomeDescription,
    path: "/",
    keywords: settings.seoHomeKeywords,
  });
}

const PARTNERS = [
  "icred", "simplix", "porto", "credcesta", "finanto", "canopus",
  "rodobens", "bb-consorcios", "ancora", "itau", "azul", "zurich",
  "suhai", "allianz", "hdi", "mapfre", "bevi", "sim",
] as const;

const FAQS = [
  {
    q: "Quem pode solicitar um empréstimo na Viviane Empréstimos?",
    a: "Atendemos aposentados e pensionistas do INSS, servidores públicos, militares, trabalhadores com saldo de FGTS que optaram pelo Saque-Aniversário, além de outros perfis. Consulte a disponibilidade.",
  },
  {
    q: "Como funciona o atendimento digital e presencial?",
    a: "Você pode iniciar pelo site ou WhatsApp, enviando a documentação solicitada, ou optar pelo atendimento presencial em Bady Bassitt/SP.",
  },
  {
    q: "Quais os benefícios da antecipação do Saque FGTS?",
    a: "A modalidade utiliza o saldo do FGTS como garantia e não possui parcelas mensais; os valores são descontados anualmente do FGTS.",
  },
  {
    q: "Como saber qual opção é adequada para mim?",
    a: "Fale com a equipe para receber orientação sobre as soluções disponíveis para seu perfil.",
  },
];

const HOME_SERVICES = [
  { name: "Empréstimo Consignado", description: "Crédito com desconto em folha de pagamento." },
  { name: "Antecipação Saque FGTS", description: "Antecipe parcelas anuais do Saque-Aniversário." },
  { name: "Crédito Pessoal", description: "Soluções de crédito para seus planos e projetos." },
  { name: "Cartão Consignado", description: "Cartão consignado com desconto direto na folha." },
];

export default async function HomePage() {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const wa = (msg: string) =>
    `https://wa.me/${settings.phone}?text=${encodeURIComponent(msg)}`;

  const heroStyle = settings.bannerHome
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(10,23,79,.92) 0%, rgba(23,55,142,.84) 65%, rgba(36,91,214,.68) 100%), url(${settings.bannerHome})`,
      }
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            settings,
            base,
            "/",
            settings.seoHomeTitle,
            settings.seoHomeDescription
          ),
          serviceSchema(settings, base, HOME_SERVICES),
          videoSchema(settings, base),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      {/* Hero */}
      <section className="hero" style={heroStyle}>
        <div className="hero-lines" />
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <h1>
              Antecipe seu FGTS <em>com as melhores taxas do mercado!</em>
            </h1>
            <p>Simule o quanto você pode antecipar do seu FGTS.</p>
            <div className="actions">
              <a
                className="btn btn-orange"
                href={settings.simulatorUrl}
                target="_blank"
                rel="noopener"
              >
                Simule agora
              </a>
              <a
                className="btn btn-outline-light"
                href={wa("Olá! Quero saber mais sobre a antecipação do FGTS.")}
                target="_blank"
                rel="noopener"
              >
                Fale com a Viviane
              </a>
            </div>
            <small>
              A contratação está sujeita à análise e às condições da
              instituição responsável.
            </small>
          </div>
          <div className="hero-visual reveal">
            <div className="finance-card">
              <span>Simulação digital</span>
              <strong>FGTS</strong>
              <i />
              <i />
              <i />
            </div>
            <img
              className="character"
              src="/images/personagem.webp"
              alt="Personagem da Viviane Empréstimos"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Confiança */}
      <section className="trust">
        <div className="container trust-grid">
          <article>
            <span className="icon">
              <SpriteIcon name="store" />
            </span>
            <div>
              <strong>Atendimento</strong>
              <p>Presencial e digital</p>
            </div>
          </article>
          <article>
            <span className="icon">
              <SpriteIcon name="globe" />
            </span>
            <div>
              <strong>Cobertura</strong>
              <p>Nível nacional</p>
            </div>
          </article>
          <article>
            <span className="icon">
              <SpriteIcon name="shield" />
            </span>
            <div>
              <strong>Experiência</strong>
              <p>Mais de 15 anos de atuação</p>
            </div>
          </article>
        </div>
      </section>

      {/* Modalidades do FGTS */}
      <section className="section fgts-intro">
        <div className="container">
          <div className="section-title reveal">
            <span>FGTS</span>
            <h2>Entenda as modalidades do FGTS.</h2>
          </div>
          <div className="comparison">
            <article className="reveal">
              <span className="icon blue">
                <SpriteIcon name="doc" />
              </span>
              <div>
                <h3>Saque-Rescisão</h3>
                <p>
                  Em caso de demissão sem justa causa, o trabalhador poderá
                  sacar os valores disponíveis na conta vinculada do FGTS,
                  conforme as hipóteses previstas na legislação.
                </p>
              </div>
            </article>
            <article className="reveal">
              <span className="icon orange">
                <SpriteIcon name="fgts" />
              </span>
              <div>
                <h3>Saque-Aniversário</h3>
                <p>
                  Possibilidade de sacar um percentual anualmente, no mês do
                  aniversário, considerando o saldo das contas vinculadas
                  ativas e inativas.
                </p>
              </div>
            </article>
          </div>
          <a className="text-link" href="/fgts">
            Saiba mais sobre FGTS →
          </a>
        </div>
      </section>

      {/* Serviços */}
      <section className="section services-home">
        <div className="container">
          <div className="section-title centered reveal">
            <span>Serviços</span>
            <h2>Soluções financeiras para diferentes momentos.</h2>
            <p>
              Conheça as principais opções e fale com nossa equipe para
              verificar a solução adequada ao seu perfil.
            </p>
          </div>
          <div className="service-grid">
            <article className="service-card reveal">
              <span className="service-icon">
                <SpriteIcon name="wallet" />
              </span>
              <h3>Empréstimo Consignado</h3>
              <p>Crédito com desconto em folha de pagamento.</p>
              <a href="/servicos">
                Saiba mais <b>→</b>
              </a>
            </article>
            <article className="service-card reveal">
              <span className="service-icon">
                <SpriteIcon name="fgts" />
              </span>
              <h3>Antecipação Saque FGTS</h3>
              <p>Antecipe parcelas anuais do Saque-Aniversário.</p>
              <a href="/fgts">
                Saiba mais <b>→</b>
              </a>
            </article>
            <article className="service-card reveal">
              <span className="service-icon">
                <SpriteIcon name="person" />
              </span>
              <h3>Crédito Pessoal</h3>
              <p>Soluções de crédito para seus planos e projetos.</p>
              <a href="/servicos">
                Saiba mais <b>→</b>
              </a>
            </article>
            <article className="service-card reveal">
              <span className="service-icon">
                <SpriteIcon name="card" />
              </span>
              <h3>Cartão Consignado</h3>
              <p>Cartão consignado com desconto direto na folha.</p>
              <a href="/servicos">
                Saiba mais <b>→</b>
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="section about-home">
        <div className="container about-grid">
          <figure className="reveal">
            <img
              src="/images/fachada.webp"
              alt="Fachada da Viviane Empréstimos em Bady Bassitt"
              width={600}
              height={430}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="reveal">
            <span className="eyebrow">Sobre nós</span>
            <h2>Viviane Empréstimos: soluções completas onde você estiver.</h2>
            <p>
              Oferecemos suporte com atendimento presencial e digital,
              atendendo em nível nacional. São mais de 15 anos de atuação no
              mercado.
            </p>
            <div className="mini-info">
              <span className="icon">
                <SpriteIcon name="store" />
              </span>
              <p>
                <strong>Bady Bassitt/SP</strong>
                Atendimento presencial.
              </p>
            </div>
            <div className="mini-info">
              <span className="icon">
                <SpriteIcon name="phone" />
              </span>
              <p>
                <strong>{settings.phoneDisplay}</strong>
                Fale com a equipe.
              </p>
            </div>
            <a className="btn btn-blue" href="/sobre">
              Conheça nossa história
            </a>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="process">
        <div className="container">
          <div className="section-title centered reveal">
            <span>Como funciona</span>
            <h2>Atendimento simples e flexível.</h2>
          </div>
          <div className="process-grid">
            <article className="reveal">
              <b>1</b>
              <h3>Você entra em contato</h3>
              <p>Inicie pelo site, WhatsApp ou presencialmente.</p>
            </article>
            <article className="reveal">
              <b>2</b>
              <h3>Envia as informações</h3>
              <p>A equipe orienta sobre os dados necessários.</p>
            </article>
            <article className="reveal">
              <b>3</b>
              <h3>A solicitação é analisada</h3>
              <p>A contratação depende da análise e aprovação.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Vídeo institucional */}
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
              Conheça mais sobre o trabalho e o atendimento da{" "}
              {settings.siteName}.
            </p>
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section className="partners">
        <div className="container">
          <div className="section-title centered">
            <span>Relacionamentos</span>
            <h2>Nossos parceiros.</h2>
          </div>
          <div className="partner-track">
            {PARTNERS.map((p) => (
              <div key={p}>
                <img
                  src={`/images/partners/${p}.webp`}
                  alt={`Parceiro ${p.replace(/-/g, " ")}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container faq-grid">
          <div className="section-title reveal">
            <span>Perguntas frequentes</span>
            <h2>Respostas para suas dúvidas.</h2>
          </div>
          <AccordionGroup items={FAQS} />
        </div>
      </section>
    </>
  );
}
