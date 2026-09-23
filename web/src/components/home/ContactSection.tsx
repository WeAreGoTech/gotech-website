import Link from "next/link";
import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { ContactForm } from "@/components/kurumsal/ContactForm";
import { GoTechLogoHeader } from "@/components/kurumsal/Logo";
import { BEYOND, NAV_LINKS, PORTAL_HREF } from "./home-content";
import c from "./contact.module.css";
import h from "./home.module.css";
import { cx, REVEAL, telHref } from "./parts";

/** Kırmızı kart: iletişim bilgileri panelden, form gerçek başvuru formu (yönetim > Başvurular'a düşer). */
export function Contact({ settings }: { settings: SiteSettings }) {
  return (
    <section className={h.sec} id="iletisim">
      <div className={h.wrap}>
        <div className={c.contact} {...REVEAL}>
          <div className={h.head}>
            <h2>Ücretsiz keşif görüşmesi</h2>
            <p className={cx(h.lede, c.onRed)}>İşinizi dinleyip hangi ürünün uygun olduğunu söyleyelim. Görüşme ve demo için ücret almıyoruz.</p>
            <dl className={c.info}>
              <div><dt>Satış</dt><dd><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></dd></div>
              <div><dt>E-posta</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div>
              <div><dt>Adres</dt><dd>{settings.address}</dd></div>
            </dl>
          </div>
          <div className={c.formBox}><ContactForm /></div>
        </div>
      </div>
    </section>
  );
}

const PAGE_LINKS = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/hizmetlerimiz", label: "Hizmetler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function HomeFooter({ settings, content }: { settings: SiteSettings; content: SiteContent }) {
  return (
    <footer className={c.foot}>
      <div className={h.wrap}>
        <div className={c.footTop}>
          <div className={c.footBrand}>
            <Link className={c.footLogo} href="/" aria-label="GoTech ana sayfa"><GoTechLogoHeader /></Link>
            <p>{content.footerAbout}</p>
          </div>
          <div><h4>Bu sayfada</h4><ul>{NAV_LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul></div>
          <div><h4>Sayfalar</h4><ul>{PAGE_LINKS.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
          <div><h4>Yazılım</h4><ul>{BEYOND.map((b) => <li key={b.id}><a href={`#${b.id}`}>{b.title}</a></li>)}</ul></div>
          <div>
            <h4>İletişim</h4>
            <ul>
              <li><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></li>
              <li><a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a></li>
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
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
