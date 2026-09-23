import type { Metadata } from "next";
import { getSettings, siteUrl } from "@/lib/settings";
import { buildMetadata, faqSchema, webPageSchema, breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { SpriteIcon } from "@/components/site/icons";
import { AccordionGroup } from "@/components/site/motion";
import { whatsappUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const SERVICES: { icon: string; title: string; text: string }[] = [
  { icon: "person", title: "Consignado INSS", text: "Crédito consignado para aposentados e pensionistas do INSS." },
  { icon: "doc", title: "Consignado público", text: "Crédito consignado para servidores públicos." },
  { icon: "shield", title: "Consignado federal", text: "Solução de crédito consignado para servidores federais." },
  { icon: "wallet", title: "Consignado privado / CLT", text: "Crédito com desconto direto na folha para trabalhadores elegíveis." },
  { icon: "fgts", title: "Antecipação Saque FGTS", text: "Antecipe parcelas anuais do Saque-Aniversário, conforme as condições disponíveis." },
  { icon: "wallet", title: "Crédito pessoal", text: "Crédito pessoal com contratação sujeita à análise." },
  { icon: "home", title: "Crédito imobiliário", text: "Soluções para apoiar a realização do imóvel próprio." },
  { icon: "car", title: "Crédito para veículos", text: "Opções de financiamento para veículo novo ou usado." },
  { icon: "card", title: "Cartão consignado", text: "Cartão com limite e desconto direto na folha." },
  { icon: "card", title: "Cartão Credcesta", text: "Consulte benefícios, elegibilidade e condições disponíveis." },
  { icon: "store", title: "Abertura de conta", text: "Orientação para abertura de conta nas instituições disponíveis." },
  { icon: "umbrella", title: "Seguros", text: "Opções de proteção para você, sua família e seu patrimônio." },
  { icon: "shield", title: "BPC / LOAS", text: "Consulte as soluções disponíveis para beneficiários elegíveis." },
  { icon: "home", title: "Consórcios", text: "Planejamento para conquistar bens por meio de consórcio." },
  { icon: "person", title: "Bolsa Família", text: "Consulte a disponibilidade de soluções para beneficiários." },
];

const FAQS = [
  {
    q: "O que é o Empréstimo Consignado INSS?",
    a: "É uma modalidade de crédito para quem possui benefício previdenciário consignável, com parcelas descontadas diretamente do benefício.",
  },
  {
    q: "Como funciona o Empréstimo Consignado INSS?",
    a: "Após a escolha da instituição e da proposta, a solicitação passa por análise. Se aprovada, o contrato é assinado e o valor é liberado conforme as condições contratadas.",
  },
  {
    q: "Quando o Empréstimo Consignado está disponível?",
    a: "A disponibilidade depende de benefício elegível, margem consignável e análise da instituição financeira.",
  },
  {
    q: "Quanto tempo demora para cair na conta?",
    a: "O prazo varia conforme a instituição, a análise, a assinatura e a validação dos dados da operação.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    baseUrl: siteUrl(settings),
    title: settings.seoServicosTitle,
    description: settings.seoServicosDescription,
    path: "/servicos",
  });
}

export default async function ServicosPage() {
  const settings = await getSettings();
  const base = siteUrl(settings);
  const waService = (title: string) =>
    whatsappUrl(settings, `Olá! Gostaria de informações sobre ${title}.`);

  const bannerStyle = settings.bannerServicos
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(13,27,94,.9), rgba(36,91,214,.78)), url(${settings.bannerServicos})`,
      }
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            settings,
            base,
            "/servicos",
            settings.seoServicosTitle,
            settings.seoServicosDescription
          ),
          breadcrumbSchema(base, [
            { name: "Início", path: "/" },
            { name: "Serviços", path: "/servicos" },
          ]),
          serviceSchema(
            settings,
            base,
            SERVICES.map((s) => ({ name: s.title, description: s.text }))
          ),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <section className="inner-hero" style={bannerStyle}>
        <div className="container">
          <span className="breadcrumb">Home / Serviços</span>
          <h1>
            Crédito e proteção
            <br />
            para diferentes objetivos.
          </h1>
          <p>
            Conheça as soluções apresentadas pela Viviane Empréstimos e
            consulte a disponibilidade para o seu perfil.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title reveal">
            <span>Soluções</span>
            <h2>Conectando você às melhores oportunidades financeiras.</h2>
            <p>
              Atendimento personalizado para orientar sua escolha,
              presencialmente ou de forma digital.
            </p>
          </div>
          <div className="catalog">
            {SERVICES.map((s) => (
              <article className="service-card reveal" key={s.title}>
                <span className="service-icon">
                  <SpriteIcon name={s.icon} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.title === "Antecipação Saque FGTS" ? (
                  <a href="/fgts">
                    Saiba mais <b>→</b>
                  </a>
                ) : (
                  <a href={waService(s.title)} target="_blank" rel="noopener">
                    Saiba mais <b>→</b>
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="legal-note" style={{ marginTop: 30 }}>
            A disponibilidade, os valores, as taxas, os prazos e a aprovação
            dependem do perfil do cliente e das condições da instituição
            responsável pela operação.
          </p>
        </div>
      </section>

      <section className="process">
        <div className="container">
          <div className="section-title centered reveal">
            <span>Atendimento</span>
            <h2>Suporte em cada etapa.</h2>
          </div>
          <div className="process-grid">
            <article className="reveal">
              <b>1</b>
              <h3>Atendimento personalizado</h3>
              <p>Cada cliente recebe orientação de acordo com sua necessidade.</p>
            </article>
            <article className="reveal">
              <b>2</b>
              <h3>Análise da solicitação</h3>
              <p>As informações são encaminhadas para análise da instituição responsável.</p>
            </article>
            <article className="reveal">
              <b>3</b>
              <h3>Acompanhamento</h3>
              <p>A equipe orienta você durante o andamento da contratação.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section faq">
        <div className="container faq-grid">
          <div className="section-title reveal">
            <span>Perguntas frequentes</span>
            <h2>Dúvidas sobre empréstimo consignado.</h2>
          </div>
          <AccordionGroup items={FAQS} />
        </div>
      </section>
    </>
  );
}
