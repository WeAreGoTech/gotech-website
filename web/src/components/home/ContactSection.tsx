import Link from "next/link";
import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { ContactForm } from "@/components/kurumsal/ContactForm";
import { GoTechLogoHeader } from "@/components/kurumsal/Logo";
import { HOME_ANCHORS, PORTAL_HREF, PRODUCT_LINKS, SITE_NAV } from "./home-content";
import c from "./contact.module.css";
import h from "./home.module.css";
import { cx, REVEAL, telHref } from "./parts";

type ContactProps = {
  settings: SiteSettings;
  content: SiteContent;
  title?: string;
  lead?: string;
  // gönder butonu ve altındaki not; varsayılanı keşif görüşmesi (demo) bağlamı
  submitLabel?: string;
  note?: string;
};

const DISCOVERY_NOTE = "Mesajınız doğrudan ekibimize düşer.";
const mapsHref = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\n/g, " "))}`;

/**
 * Her sayfanın sonundaki iletişim kartı (id="iletisim"): menüdeki ve sayfadaki "demo" butonları buraya iner.
 * Başlık ve açıklama panelden (Site içeriği > Kapanış); ürün sayfaları kendi başlığını verir. Form gerçek başvuru formu.
 */
export function Contact({ settings, content, title, lead, submitLabel, note = DISCOVERY_NOTE }: ContactProps) {
  return (
    <section className={h.sec} id="iletisim">
      <div className={h.wrap}>
        <div className={c.contact} {...REVEAL}>
          <div className={h.head}>
            <h2>{title ?? content.ctaTitle}</h2>
            <p className={cx(h.lede, c.onRed)}>{lead ?? content.ctaLead}</p>
            <dl className={c.info}>
              {settings.salesPhone && <div><dt>Satış</dt><dd><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></dd></div>}
              {settings.supportPhone && <div><dt>Destek</dt><dd><a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a></dd></div>}
              <div><dt>E-posta</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div>
              <div><dt>Çalışma saatleri</dt><dd>{settings.workingHours}</dd></div>
              <div>
                <dt>Adres</dt>
                <dd>{settings.address}</dd>
                <dd><a className={c.mapLink} href={mapsHref(settings.address)} target="_blank" rel="noopener noreferrer">Haritada açın</a></dd>
              </div>
            </dl>
          </div>
          <div className={c.formBox}>
            <ContactForm submitLabel={submitLabel} />
            <p className={c.next}>{note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

type FooterProps = { settings: SiteSettings; content: SiteContent; onHome?: boolean };

/** Sitenin tek alt bilgisi; ana sayfada ek olarak o sayfanın bölümlerini listeler. */
export function HomeFooter({ settings, content, onHome = false }: FooterProps) {
  return (
    <footer className={c.foot}>
      <div className={h.wrap}>
        <div className={c.footTop}>
          <div className={c.footBrand}>
            <Link className={c.footLogo} href="/" aria-label="GoTech ana sayfa"><GoTechLogoHeader /></Link>
            <p>{content.footerAbout}</p>
          </div>
          <div><h4>Sayfalar</h4><ul>{SITE_NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
          <div><h4>Ürünler ve hizmetler</h4><ul>{PRODUCT_LINKS.map((l) => <li key={l.href}>{l.href.includes("#") ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>)}</ul></div>
          {onHome && <div><h4>Bu sayfada</h4><ul>{HOME_ANCHORS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul></div>}
          <div>
            <h4>İletişim</h4>
            <ul>
              {settings.salesPhone && <li><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></li>}
              {settings.supportPhone && <li><a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a></li>}
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li>{settings.workingHours}</li>
            </ul>
          </div>
        </div>
        <div className={c.footBot}>
          <span>{content.footerCopyright}</span>
          <nav aria-label="Alt bağlantılar">
            <Link href={PORTAL_HREF}>Destek portalı</Link>
            {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          </nav>
        </div>
      </div>
    </footer>
  );
}
