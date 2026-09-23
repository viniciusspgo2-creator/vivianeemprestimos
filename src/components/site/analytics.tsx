"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * GA4 + GTM carregados de forma otimizada (afterInteractive),
 * além de eventos automáticos de CTA (whatsapp, simulador, FGTS)
 * e generate_lead via delegação global — preparado para campanhas.
 */
export function Analytics({
  ga4Id,
  gtmId,
}: {
  ga4Id?: string;
  gtmId?: string;
}) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || !window.dataLayer) return;
      const href = anchor.getAttribute("href") || "";
      let cta: string | null = null;
      if (href.includes("wa.me")) cta = "whatsapp";
      else if (href.includes("simulador") || href.includes("simular"))
        cta = "simulador";
      else if (href.includes("icred.app")) cta = "contratacao_fgts";
      if (cta) {
        window.dataLayer.push({ event: "cta_click", cta_name: cta });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{page_path:window.location.pathname});`}
          </Script>
        </>
      ) : null}
      {gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
    </>
  );
}
