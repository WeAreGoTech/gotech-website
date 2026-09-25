/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { CSSProperties } from "react";
import type { SiteContent } from "@/components/kurumsal/content";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { REFERENCES } from "@/components/kurumsal/referanslar";
import { HERO_INTRO, HERO_SLIDES, type HeroSlide } from "./home-content";
import { HeroSlider } from "./HeroSlider";
import h from "./home.module.css";

/**
 * Giriş: slider (HeroSlider). İlk slaydın başlığı, metni ve buton yazısı panelden (Site içeriği > Ana sayfa girişi),
 * diğer slaytlar home-content.ts'te.
 */
export function Hero({ content }: { content: SiteContent }) {
  const slides: HeroSlide[] = [
    { ...HERO_INTRO, title: content.heroTitle, lede: content.heroLead, cta: { label: content.ctaButtonText, href: "#iletisim", konu: "demo" } },
    ...HERO_SLIDES,
  ];
  return <HeroSlider slides={slides} />;
}

/** Özel yazılım geliştirdiğimiz kurumların logoları (kurumsal/referanslar.ts); /referanslar sayfası şimdilik gizli. */
export function ReferenceStrip() {
  return (
    <section className={h.refs} aria-label="Referanslar">
      <div className={h.wrap}>
        <p>Özel yazılım geliştirdiğimiz kurumlar</p>
        <ul className={h.refLogos}>
          {REFERENCES.map((ref) => (
            <li key={ref.name}><img src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Mikro logosu + Silver Partner rozetleri + panelden gelen rakamlar (boş bırakılan gösterilmez). Zemin TAM BEYAZ (logo kuralı). */
export function PartnerBand({ content }: { content: SiteContent }) {
  const stats = [
    { value: content.stat1Value, label: content.stat1Label },
    { value: content.stat2Value, label: content.stat2Label },
    { value: content.stat3Value, label: content.stat3Label },
    { value: content.stat4Value, label: content.stat4Label },
  ].filter((s) => s.value.trim());
  return (
    <section className={h.band} aria-label="İş ortaklığı">
      <div className={h.wrap} style={{ "--n": Math.max(stats.length, 1) } as CSSProperties}>
        <div className={h.partner} data-in="">
          <MikroLogo className={h.mikroLogo} />
          <div className={h.badges}>
            <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} loading="lazy" />
            <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} loading="lazy" />
          </div>
        </div>
        {stats.map((s) => (
          <div className={h.stat} key={s.label} data-in=""><b>{s.value}</b><span>{s.label}</span></div>
        ))}
      </div>
    </section>
  );
}
