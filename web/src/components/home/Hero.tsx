/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { CSSProperties } from "react";
import type { SiteContent } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { HERO_TRUST } from "./home-content";
import h from "./home.module.css";
import { cx } from "./parts";

// hero öğeleri açılışta sırayla yükselir (home.module.css .rise, gecikme = --i)
const order = (i: number) => ({ "--i": i }) as CSSProperties;

/** Giriş: başlık ve tanıtım cümlesi panelden (Site içeriği > Ana sayfa girişi). */
export function Hero({ content }: { content: SiteContent }) {
  return (
    <section className={h.hero}>
      <div className={h.wrap}>
        <div className={h.heroCopy}>
          <span className={cx(h.eyebrow, h.rise)} style={order(0)}>Mikro Yazılım Yetkili İş Ortağı · İzmir</span>
          <h1 className={cx(h.heroTitle, h.rise)} style={order(1)}>{content.heroTitle}</h1>
          <p className={cx(h.lede, h.rise)} style={order(2)}>{content.heroLead}</p>
          <div className={cx(h.heroCta, h.rise)} style={order(3)}>
            <a className={h.btn} href="#iletisim" data-konu="demo">{content.ctaButtonText} <ArrowIcon /></a>
            <a className={cx(h.btn, h.ghost)} href="#urunler">Size uygun ürünü bulun</a>
          </div>
          <ul className={cx(h.trust, h.rise)} style={order(4)}>
            {HERO_TRUST.map((t) => <li key={t.value}><b>{t.value}</b>{t.rest}</li>)}
          </ul>
        </div>
        <figure className={cx(h.heroPhoto, h.rise)} style={order(2)}>
          <img src="/images/analiz.jpg" alt="İş analizi toplantısı" width={1200} height={800} fetchPriority="high" />
        </figure>
      </div>
    </section>
  );
}

/** Mikro logosu + Silver Partner rozetleri + panelden gelen ilk üç rakam. Zemin TAM BEYAZ (logo kuralı). */
export function PartnerBand({ content }: { content: SiteContent }) {
  const stats = [
    { value: content.stat1Value, label: content.stat1Label },
    { value: content.stat2Value, label: content.stat2Label },
    { value: content.stat3Value, label: content.stat3Label },
  ];
  return (
    <section className={h.band} aria-label="İş ortaklığı">
      <div className={h.wrap}>
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
