import Link from "next/link";
import type { SiteContent, SiteSettings } from "./content";

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export function Hero({ settings, content }: { settings: SiteSettings; content: SiteContent }) {
  return (
    <section className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-bg" src="/images/depo.jpg" alt="" fetchPriority="high" />

      <div className="wrap hero-inner">
        <h1 className="d1">{content.heroTitle}</h1>
        <p className="lede">{content.heroLead}</p>
        <Link className="btn" href={content.ctaButtonLink}>{content.ctaButtonText}</Link>
      </div>

      <div className="hero-bar">
        <div className="wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mikro-logo.png" alt="Mikro Yazılım" />
          <p>Yetkili iş ortağı · Jumper ve Flyer Silver Partner</p>
          <div className="lines">
            <a href={telHref(settings.salesPhone)}>
              <span>Satış</span>
              {settings.salesPhone}
            </a>
            <a href={telHref(settings.supportPhone)}>
              <span>Destek</span>
              {settings.supportPhone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
