import type { Metadata } from "next";
import { getSettings, siteUrl } from "@/lib/settings";
import { buildMetadata, faqSchema, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { AccordionGroup } from "@/components/site/motion";
import { whatsappUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const FAQS = [
  {
    q: "O que é o Saque-Aniversário do FGTS?",
    a: "É uma sistemática que permite retirar anualmente, no mês do aniversário, parte do saldo das contas vinculadas ao FGTS. A simulação pode ser feita no aplicativo FGTS.",
  },
  {
    q: "Quem está elegível para a contratação?",
    a: "Trabalhadores com saldo disponível, opção ativa pelo Saque-Aniversário e autorização para a instituição consultar o saldo, sujeitos à análise e às regras vigentes.",
  },
  {
    q: "Quanto será possível contratar?",
    a: "O valor depende do saldo disponível, das parcelas anuais passíveis de antecipação e das condições da instituição responsável.",
  },
  {
    q: "Qual valor do FGTS será bloqueado?",
    a: "Será bloqueado o valor necessário para garantir a operação contratada, conforme informado pela instituição no momento da proposta.",
  },
  {
    q: "Como é feita a amortização?",
    a: "A amortização ocorre por meio dos repasses anuais do Saque-Aniversário, sem boleto mensal para o cliente.",
  },
  {
    q: "A empresa precisa aprovar a operação?",
    a: "Não. A contratação está vinculada ao saldo do FGTS e às autorizações do trabalhador, não à aprovação do empregador.",
  },
  {
    q: "Consigo antecipar a liquidação?",
    a: "Consulte a instituição responsável para conhecer as condições e o procedimento de liquidação antecipada.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: settings.seoFgtsTitle,
    description: settings.seoFgtsDescription,
    path: "/fgts",
    keywords:
      "antecipação fgts, saque aniversário, empréstimo com garantia fgts, antecipar fgts, saque-aniversário fgts",
  });
}

export default async function FgtsPage() {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const waFgts = whatsappUrl(
    settings,
    "Olá! Quero saber mais sobre a antecipação do FGTS."
  );
  const waDuvida = whatsappUrl(
    settings,
    "Olá! Tenho uma dúvida sobre a antecipação do FGTS."
  );

  const bannerStyle = settings.bannerFgts
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(13,27,94,.9), rgba(36,91,214,.78)), url(${settings.bannerFgts})`,
      }
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            settings,
            base,
            "/fgts",
            settings.seoFgtsTitle,
            settings.seoFgtsDescription
          ),
          breadcrumbSchema(base, [
            { name: "Início", path: "/" },
            { name: "Serviços", path: "/servicos" },
            { name: "Antecipação FGTS", path: "/fgts" },
          ]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <section className="inner-hero" style={bannerStyle}>
        <div className="container">
          <span className="breadcrumb">Home / Serviços / FGTS</span>
          <h1>
            Antecipe seu FGTS
            <br />
            com segurança e facilidade.
          </h1>
          <p>
            Entenda como funciona o Empréstimo com Garantia do
            Saque-Aniversário do FGTS e consulte as condições disponíveis.
          </p>
          <div className="actions">
            <a
              className="btn btn-orange"
              href={settings.fgtsContractUrl}
              target="_blank"
              rel="noopener"
            >
              Contrate agora
            </a>
            <a
              className="btn btn-outline-light"
              href={waFgts}
              target="_blank"
              rel="noopener"
            >
              Tire suas dúvidas
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="reveal">
            <span className="eyebrow">Entenda o produto</span>
            <h2>Empréstimo com garantia do Saque-Aniversário.</h2>
            <p className="lead">
              O Saque-Aniversário permite ao trabalhador retirar parte do saldo
              do FGTS anualmente, no mês do aniversário. Na antecipação, o
              cliente pode antecipar valores futuros dessa modalidade, e a
              instituição recebe por meio dos repasses anuais realizados a
              partir do saldo do FGTS.
            </p>
            <p>
              A Viviane Empréstimos informa a possibilidade de antecipação de
              até 5 anos de benefício, sempre sujeita às regras vigentes e às
              condições da instituição responsável.
            </p>
            <p className="legal-note">
              A adesão ao Saque-Aniversário altera a sistemática de saque do
              FGTS. Consulte as regras oficiais e avalie as condições antes de
              contratar.
            </p>
          </div>
          <div className="fgts-visual reveal">
            <img
              src="/images/fgts-phones.webp"
              alt="Aplicativo FGTS em celulares"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="info-band">
        <div className="container">
          <div className="section-title centered reveal">
            <span>Requisitos</span>
            <h2>O que você precisa para solicitar.</h2>
          </div>
          <div className="requirements">
            <article className="requirement reveal">
              <b>01</b>
              <h3>Ser maior de 18 anos</h3>
              <p>Ser maior de 18 anos ou emancipado e estar com o CPF regular.</p>
            </article>
            <article className="requirement reveal">
              <b>02</b>
              <h3>Saque-Aniversário FGTS</h3>
              <p>Optar pela modalidade Saque-Aniversário no aplicativo FGTS.</p>
            </article>
            <article className="requirement reveal">
              <b>03</b>
              <h3>Ter saldo no FGTS</h3>
              <p>
                Trabalhar ou ter trabalhado com carteira assinada e possuir
                saldo disponível.
              </p>
            </article>
            <article className="requirement reveal">
              <b>04</b>
              <h3>Conta ativa</h3>
              <p>
                Possuir conta-corrente ou poupança ativa para receber o
                crédito.
              </p>
            </article>
            <article className="requirement reveal">
              <b>05</b>
              <h3>Autorizar os bancos</h3>
              <p>
                Autorizar no aplicativo FGTS a consulta do saldo pelas
                instituições selecionadas.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="fgts-visual reveal">
            <img
              src="/images/app-fgts.webp"
              alt="Telas do aplicativo FGTS"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="reveal">
            <span className="eyebrow">Público elegível</span>
            <h2>Quem pode consultar a antecipação?</h2>
            <p className="lead">
              Trabalhadores com contrato formal, conta vinculada ao FGTS ativa
              ou inativa, saldo disponível e opção pelo Saque-Aniversário
              podem consultar a modalidade.
            </p>
            <p>
              Entre os públicos atendidos estão trabalhadores rurais,
              domésticos, temporários, avulsos, safreiros, atletas
              profissionais e intermitentes. Funcionários públicos, em regra,
              não têm FGTS; casos de vínculo celetista devem ser verificados
              individualmente.
            </p>
            <a
              className="btn btn-blue"
              href={settings.fgtsContractUrl}
              target="_blank"
              rel="noopener"
            >
              Consultar contratação
            </a>
          </div>
        </div>
      </section>

      <section className="section faq">
        <div className="container faq-grid">
          <div className="section-title reveal">
            <span>Perguntas frequentes</span>
            <h2>Ficou alguma dúvida?</h2>
            <a
              className="btn btn-blue"
              href={waDuvida}
              target="_blank"
              rel="noopener"
            >
              Fale conosco
            </a>
          </div>
          <AccordionGroup items={FAQS} />
        </div>
      </section>
    </>
  );
}
