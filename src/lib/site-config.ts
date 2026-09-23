/**
 * Central site configuration defaults.
 * Mirrors the original PHP `config.php` + page content so the
 * conversion keeps 1:1 content parity. All values are editable
 * through the admin panel (stored in the SiteSetting table).
 */

export const SITE_SLUG = "Viviane Empréstimos";

export type SiteSettings = {
  // Identidade / contato
  siteName: string;
  phoneDisplay: string;
  phone: string; // digits only with DDI (wa.me / tel:)
  address: string;
  whatsappDefaultMessage: string;
  whatsappFloatingMessage: string;

  // Canais comerciais
  simulatorUrl: string; // simulador de crédito pessoal (externo)
  fgtsContractUrl: string; // contratação antecipação FGTS (externo)
  youtubeId: string; // vídeo institucional

  // Banners (vazio = gradiente CSS padrão de cada página)
  bannerHome: string;
  bannerSobre: string;
  bannerServicos: string;
  bannerFgts: string;
  bannerContato: string;

  // Textos editáveis
  textHelpTitle: string;
  textHelpSubtitle: string;
  textHelpPrimary: string;
  textHelpSecondary: string;
  textFooterAbout: string;

  // SEO global
  seoSiteUrl: string; // canonical domain e.g. https://vivianeemprestimos.com.br
  seoOgImage: string;
  seoThemeColor: string;
  seoTitleSuffix: string;
  seoRobotsIndex: string; // "index,follow" | "noindex,nofollow"

  // SEO por página
  seoHomeTitle: string;
  seoHomeDescription: string;
  seoHomeKeywords: string;
  seoSobreTitle: string;
  seoSobreDescription: string;
  seoServicosTitle: string;
  seoServicosDescription: string;
  seoFgtsTitle: string;
  seoFgtsDescription: string;
  seoContatoTitle: string;
  seoContatoDescription: string;
  seoBlogTitle: string;
  seoBlogDescription: string;

  // Analytics
  ga4Id: string;
  gtmId: string;
};

/** Defaults copied verbatim from the PHP site */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Viviane Empréstimos",
  phoneDisplay: "(17) 98819-2424",
  phone: "5517988192424",
  address:
    "Rua Bento Vieira, R. Hernildo Simonato, 251 - Colina Sul, Bady Bassitt - SP, 15115-000",
  whatsappDefaultMessage:
    "Olá! Gostaria de informações sobre as soluções da Viviane Empréstimos.",
  whatsappFloatingMessage:
    "Olá! Gostaria de informações sobre as soluções da Viviane Empréstimos.",

  simulatorUrl:
    "https://simulador.vivianeemprestimo.com.br/page/credito-pessoal/simular/indicacao/e26f3ab4-f8ab-464b-8879-87f57a81cfbb",
  fgtsContractUrl: "https://link.icred.app/9Rb3fSQ",
  youtubeId: "P7kjyLYzw4Y",

  bannerHome: "",
  bannerSobre: "",
  bannerServicos: "",
  bannerFgts: "",
  bannerContato: "",

  textHelpTitle: "Precisa de ajuda?",
  textHelpSubtitle: "Fale com a Viviane e encontre a solução adequada para você.",
  textHelpPrimary: "Fale pelo WhatsApp",
  textHelpSecondary: "Simule agora",
  textFooterAbout:
    "Soluções financeiras com atendimento presencial e digital.",

  seoSiteUrl: "",
  seoOgImage: "/images/og-viviane.jpg",
  seoThemeColor: "#0d1b5e",
  seoTitleSuffix: SITE_SLUG,
  seoRobotsIndex: "index,follow",

  seoHomeTitle:
    "Viviane Empréstimos | Antecipação FGTS em Bady Bassitt",
  seoHomeDescription:
    "Antecipe seu FGTS e conheça soluções de crédito consignado, crédito pessoal, cartão consignado e seguros. Atendimento presencial e digital.",
  seoHomeKeywords:
    "antecipação fgts, empréstimo consignado, crédito pessoal, saque aniversário fgts, cartão consignado, empréstimos bady bassitt",
  seoSobreTitle: "Sobre Nós | Viviane Empréstimos",
  seoSobreDescription:
    "Mais de 15 anos de atuação em soluções financeiras, com atendimento presencial em Bady Bassitt/SP e digital em nível nacional.",
  seoServicosTitle: "Serviços de Crédito e Seguros | Viviane Empréstimos",
  seoServicosDescription:
    "Consignado INSS e CLT, antecipação FGTS, crédito pessoal, cartão consignado, consórcios e seguros. Consulte a disponibilidade para seu perfil.",
  seoFgtsTitle: "Antecipação do Saque-Aniversário FGTS | Viviane Empréstimos",
  seoFgtsDescription:
    "Entenda como funciona a antecipação do Saque-Aniversário do FGTS: requisitos, quem pode solicitar e contratação com segurança.",
  seoContatoTitle: "Contato | Viviane Empréstimos",
  seoContatoDescription:
    "Fale com a Viviane Empréstimos: WhatsApp, atendimento presencial em Bady Bassitt/SP e cobertura digital em todo o Brasil.",
  seoBlogTitle: "Blog de Crédito, FGTS e Consignado | Viviane Empréstimos",
  seoBlogDescription:
    "Guias práticos sobre antecipação do FGTS, empréstimo consignado, crédito pessoal e como contratar com segurança.",

  ga4Id: "",
  gtmId: "",
};

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[];

export function whatsappUrl(settings: SiteSettings, message?: string): string {
  const msg = message ?? settings.whatsappDefaultMessage;
  return `https://wa.me/${settings.phone}?text=${encodeURIComponent(msg)}`;
}

export function simulatorUrl(settings: SiteSettings): string {
  return settings.simulatorUrl;
}

export function fgtsContractUrl(settings: SiteSettings): string {
  return settings.fgtsContractUrl;
}

export function mapsUrl(settings: SiteSettings): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.address
  )}`;
}

export function telUrl(settings: SiteSettings): string {
  return `tel:+${settings.phone}`;
}
