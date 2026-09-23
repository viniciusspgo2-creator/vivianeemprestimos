import {
  fgtsContractUrl,
  mapsUrl,
  telUrl,
  whatsappUrl,
  type SiteSettings,
} from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

/**
 * Footer 1:1 do original: seção "Precisa de ajuda?", 4 colunas,
 * footer-bottom, WhatsApp flutuante e botões de ação comercial.
 */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const wa = whatsappUrl(settings);
  const waFloat = whatsappUrl(settings, settings.whatsappFloatingMessage);

  return (
    <>
      <section className="help">
        <div className="container help-inner">
          <div>
            <h2>{settings.textHelpTitle}</h2>
            <p>{settings.textHelpSubtitle}</p>
          </div>
          <div>
            <a className="btn btn-orange" href={wa} target="_blank" rel="noopener">
              {settings.textHelpPrimary}
            </a>
            <a
              className="btn btn-outline-light"
              href={settings.simulatorUrl}
              target="_blank"
              rel="noopener"
            >
              {settings.textHelpSecondary}
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div>
            <img
              className="footer-logo"
              src="/images/logo.webp"
              alt="Viviane Empréstimos"
              loading="lazy"
            />
            <p>{settings.textFooterAbout}</p>
          </div>
          <div>
            <h3>Navegação</h3>
            <a href="/sobre">Sobre nós</a>
            <a href="/servicos">Serviços</a>
            <a href="/fgts">FGTS</a>
            <a href="/contato">Contato</a>
          </div>
          <div>
            <h3>Atendimento</h3>
            <p>Bady Bassitt/SP</p>
            <p>Cobertura digital nacional</p>
            <a href={telUrl(settings)}>{settings.phoneDisplay}</a>
          </div>
          <div>
            <h3>Endereço</h3>
            <p>{settings.address}</p>
            <a href={mapsUrl(settings)} target="_blank" rel="noopener">
              Ver no mapa
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          © {year} {settings.siteName}. Todos os direitos reservados.
          <span>Consulte condições e disponibilidade para seu perfil.</span>
        </div>
      </footer>

      <a
        className="float-wa"
        href={waFloat}
        target="_blank"
        rel="noopener"
        aria-label="Falar pelo WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}

/** Link de contratação FGTS reutilizável nas páginas */
export { fgtsContractUrl };
