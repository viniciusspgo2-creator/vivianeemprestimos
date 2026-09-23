"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { whatsappUrl, type SiteSettings } from "@/lib/site-config";

/**
 * Header 1:1 do original (sticky, encolhe no scroll, dropdown Serviços,
 * menu mobile). Comportamento do main.js portado para React.
 */
export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setDropOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const wa = whatsappUrl(settings);
  const waConsignado = whatsappUrl(
    settings,
    "Olá! Gostaria de informações sobre empréstimo consignado."
  );
  const waSeguros = whatsappUrl(
    settings,
    "Olá! Gostaria de informações sobre seguros."
  );

  const closeMenus = () => {
    setOpen(false);
    setDropOpen(false);
  };

  const activeCls = (path: string) =>
    pathname === path ? "active" : undefined;

  return (
    <header className={scrolled ? "header scrolled" : "header"}>
      <div className="container nav">
        <a className="logo" href="/" aria-label={settings.siteName}>
          <img
            src="/images/logo.webp"
            alt="Viviane Empréstimo Consignado"
            width={128}
            height={66}
          />
        </a>
        <button
          className="menu"
          aria-expanded={open}
          aria-controls="navlinks"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
        <nav id="navlinks" className={open ? "open" : undefined}>
          <a className={activeCls("/")} href="/" onClick={closeMenus}>
            Home
          </a>
          <a
            className={activeCls("/sobre")}
            href="/sobre"
            onClick={closeMenus}
          >
            Sobre nós
          </a>
          <div className={dropOpen ? "dropdown open" : "dropdown"}>
            <button
              aria-expanded={dropOpen}
              className={pathname === "/servicos" ? "active" : undefined}
              onClick={() => setDropOpen((v) => !v)}
            >
              Serviços <span>⌄</span>
            </button>
            <div className="dropdown-menu">
              <a href="/servicos" onClick={closeMenus}>
                Todos os serviços
              </a>
              <a href="/fgts" onClick={closeMenus}>
                Antecipação FGTS
              </a>
              <a
                href={settings.simulatorUrl}
                target="_blank"
                rel="noopener"
                onClick={closeMenus}
              >
                Crédito pessoal
              </a>
              <a
                href={waConsignado}
                target="_blank"
                rel="noopener"
                onClick={closeMenus}
              >
                Empréstimo consignado
              </a>
              <a
                href={waSeguros}
                target="_blank"
                rel="noopener"
                onClick={closeMenus}
              >
                Seguros
              </a>
            </div>
          </div>
          <a
            className={activeCls("/fgts")}
            href="/fgts"
            onClick={closeMenus}
          >
            FGTS
          </a>
          <a
            className={activeCls("/contato")}
            href="/contato"
            onClick={closeMenus}
          >
            Contato
          </a>
          <a
            className="nav-cta"
            href={wa}
            target="_blank"
            rel="noopener"
            onClick={closeMenus}
          >
            Fale conosco
          </a>
        </nav>
      </div>
    </header>
  );
}
