/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { ContactForm } from "@/components/kurumsal/ContactForm";
import { GoTechLogoWhite, MikroLogo } from "@/components/kurumsal/Logo";
import { HOME_ANCHORS, PORTAL_HREF, PRODUCT_LINKS, SITE_NAV } from "./home-content";
import c from "./contact.module.css";
import h from "./home.module.css";
import { Icon } from "./icons";
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
 * Her sayfanın sonundaki iletişim bölümü (id="iletisim"): lacivert zeminde solda iletişim bilgileri, sağda beyaz form kartı.
 * Menüdeki ve sayfadaki "demo" butonları buraya iner. Başlık ve açıklama panelden (Site içeriği > Kapanış); ürün sayfaları
 * kendi başlığını verir. Form gerçek başvuru formu.
 */
export function Contact({ settings, content, title, lead, submitLabel, note = DISCOVERY_NOTE }: ContactProps) {
  return (
    <section className={cx(h.sec, h.navySec, c.section)} id="iletisim">
      <div className={cx(h.wrap, c.contact)}>
        <div className={c.copy} {...REVEAL}>
          <span className={h.eyebrow}>İletişim</span>
          <h2>{title ?? content.ctaTitle}</h2>
          <p className={c.lead}>{lead ?? content.ctaLead}</p>
          <ul className={c.info}>
            {settings.salesPhone && (
              <li><span><small>Satış</small><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></span></li>
            )}
            {settings.supportPhone && (
              <li><span><small>Destek</small><a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a></span></li>
            )}
            <li><span><small>E-posta</small><a href={`mailto:${settings.email}`}>{settings.email}</a></span></li>
            <li><span><small>Çalışma saatleri</small>{settings.workingHours}</span></li>
            <li>
              
              <span>
                <small>Adres</small>
                <span className={c.address}>{settings.address}</span>
                <a className={c.mapLink} href={mapsHref(settings.address)} target="_blank" rel="noopener noreferrer">Haritada açın</a>
              </span>
            </li>
          </ul>
        </div>
        <div className={c.formBox} {...REVEAL}>
          <ContactForm submitLabel={submitLabel} />
          <p className={c.next}>{note}</p>
        </div>
      </div>
    </section>
  );
}

type FooterProps = { settings: SiteSettings; content: SiteContent; onHome?: boolean };

/**
 * Sitenin tek alt bilgisi (lacivert). Üstte Mikro iş ortaklığı beyaz kartta (logo ve rozetler yalnız beyaz zeminde),
 * altında sütunlar; ana sayfada ek olarak o sayfanın bölümleri listelenir.
 */
export function HomeFooter({ settings, content, onHome = false }: FooterProps) {
  const phones = [settings.salesPhone, settings.supportPhone].filter(Boolean);
  return (
    <footer className={c.foot}>
      <div className={h.wrap}>
        <div className={c.partner}>
          <div className={c.partnerCard}>
            <MikroLogo className={c.mikro} />
            <span className={c.badges}>
              <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
              <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
            </span>
          </div>
          <p className={c.partnerText}>
            <b>Mikro Yazılım Yetkili İş Ortağı</b>
            2017&apos;den beri; Mikro&apos;nun Jumper ve Flyer iş ortaklığı programlarında Silver seviyesindeyiz.
          </p>
        </div>

        <div className={c.footTop}>
          <div className={c.footBrand}>
            <Link className={c.footLogo} href="/" aria-label="GoTech ana sayfa"><GoTechLogoWhite /></Link>
            <p>{content.footerAbout}</p>
            {settings.linkedin && (
              <a className={c.social} href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="GoTech LinkedIn sayfası">
                <Icon name="linkedin" size={16} />
              </a>
            )}
          </div>
          <div><h4>Sayfalar</h4><ul>{SITE_NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
          <div><h4>Ürünler ve hizmetler</h4><ul>{PRODUCT_LINKS.map((l) => <li key={l.href}>{l.href.includes("#") ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>)}</ul></div>
          {onHome && <div><h4>Bu sayfada</h4><ul>{HOME_ANCHORS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul></div>}
          <div>
            <h4>İletişim</h4>
            <ul className={c.footContact}>
              {phones.map((p) => <li key={p}><a href={telHref(p)}>{p}</a></li>)}
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li>{settings.workingHours}</li>
              <li>{settings.address.replace(/\n/g, ", ")}</li>
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
