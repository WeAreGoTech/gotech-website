/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { GoTechLogoHeader, MikroLogo } from "@/components/kurumsal/Logo";
import { FOOTER_PRODUCTS, FOOTER_SERVICES, mapsHref, PORTAL_HREF } from "../content";
import { LiveHours } from "../home/LiveHours";
import { telHref } from "../ui/parts";
import s from "./footer.module.css";
import { ToTop } from "./ToTop";

type Props = { settings: SiteSettings; content: SiteContent };

/**
 * Sitenin alt bilgisi: solda logo ve kısa tanım, ortada bağlantı sütunları, sağda iletişim (adres, saat ve şu anki durum,
 * e-posta; telefon panelden girildiyse). Altında Mikro iş ortaklığı (logo yalnız beyaz zeminde) ve telif satırı.
 */
export function Footer({ settings, content }: Props) {
  const phones = [settings.salesPhone, settings.supportPhone].filter(Boolean);

  return (
    <footer className={s.foot}>
      <div className="wrap">
        <div className={s.top}>
          <div className={s.brand}>
            <Link className={s.logo} href="/" aria-label="GoTech ana sayfa"><GoTechLogoHeader /></Link>
            <p>{content.footerAbout}</p>
          </div>

          <nav className={s.cols} aria-label="Alt menü">
            <div>
              <h2>Ürünler</h2>
              <ul>{FOOTER_PRODUCTS.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </div>
            <div>
              <h2>Hizmetler</h2>
              <ul>{FOOTER_SERVICES.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </div>
            <div>
              <h2>GoTech</h2>
              <ul>
                <li><Link href="/hakkimizda">Hakkımızda</Link></li>
                <li><Link href="/iletisim">İletişim</Link></li>
                <li><Link href={PORTAL_HREF}>Destek portalı</Link></li>
                {settings.linkedin && <li><a href={settings.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>}
              </ul>
            </div>
          </nav>

          <div className={s.contact}>
            <h2>İletişim</h2>
            <address>
              {settings.address}
              <a href={mapsHref(settings.address)} target="_blank" rel="noopener noreferrer">Haritada açın</a>
            </address>
            <p className={s.lines}>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
              {phones.map((ph) => <a key={ph} href={telHref(ph)}>{ph}</a>)}
            </p>
            <LiveHours hours={settings.workingHours} reveal={false} />
          </div>
        </div>

        <div className={s.partner}>
          <MikroLogo className={s.mikro} />
          <span className={s.badges}>
            <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} loading="lazy" />
            <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} loading="lazy" />
          </span>
          <p><b>Mikro Yazılım yetkili iş ortağı</b>2017&apos;den beri · Jumper ve Flyer programlarında Silver Partner</p>
        </div>

        <div className={s.bottom}>
          <span>{content.footerCopyright}</span>
          <div className={s.bottomEnd}>
            <Link href={PORTAL_HREF}>Destek portalı</Link>
            <Link href="/iletisim">İletişim</Link>
            <ToTop className={s.toTop} />
          </div>
        </div>
      </div>
    </footer>
  );
}
