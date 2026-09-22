import Link from "next/link";
import type { SiteContent, SiteSettings } from "./content";
import { GoTechLogoWhite } from "./Logo";

const SITE_LINKS = [
  { href: "/", label: "Ana sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hizmetlerimiz", label: "Hizmetler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const PRODUCT_LINKS = ["Mikro Run", "Mikro Jump", "Mikro Fly", "Mikro Müşavir", "e-Dönüşüm"];

export function Footer({ settings, content }: { settings: SiteSettings; content: SiteContent }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="logo">
              <GoTechLogoWhite />
            </span>
            <p>{content.footerAbout}</p>
          </div>

          <div>
            <h3>Hızlı linkler</h3>
            <ul>
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/giris">Destek portalı</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Ürünlerimiz</h3>
            <ul>
              {PRODUCT_LINKS.map((label) => (
                <li key={label}>
                  <Link href="/urunler">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>İletişim</h3>
            <ul>
              <li style={{ whiteSpace: "pre-line" }}>{settings.address}</li>
              <li>
                <a href={`tel:${settings.salesPhone.replace(/\s/g, "")}`}>{settings.salesPhone}</a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bot">
          <span>{content.footerCopyright}</span>
          {settings.linkedin && (
            <nav>
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
