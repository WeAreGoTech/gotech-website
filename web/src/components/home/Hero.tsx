/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { ReactNode } from "react";
import type { SiteContent } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { HERO, HERO_FACTS } from "./home-content";
import hr from "./hero.module.css";
import h from "./home.module.css";
import { cx } from "./parts";

// başlıkta marka renginde yazılan ilk ifade; panelden gelen başlıkta yoksa başlık tek renk kalır
const ACCENTS = ["Mikro Yazılım", "Mikro"];

function withAccent(title: string): ReactNode {
  for (const word of ACCENTS) {
    const i = title.indexOf(word);
    if (i >= 0) return <>{title.slice(0, i)}<em>{word}</em>{title.slice(i + word.length)}</>;
  }
  return title;
}

/**
 * Giriş: düz lacivert zeminde solda rozet, başlık, açıklama, iki buton ve güven maddeleri; sağda fotoğraf ve altında Mikro
 * iş ortaklığı kartı (logo ve rozetler beyaz kartta). Altında beyaz zeminde ince ayraçlı dört bilgi. Başlık, açıklama ve
 * buton yazısı panelden (Site içeriği > Ana sayfa girişi); rakamlar da panelden, boş kalanların yerini doğrulanmış sabit
 * bilgiler (HERO_FACTS) doldurur.
 */
export function Hero({ content }: { content: SiteContent }) {
  const panelStats = [
    { value: content.stat1Value, label: content.stat1Label },
    { value: content.stat2Value, label: content.stat2Label },
    { value: content.stat3Value, label: content.stat3Label },
    { value: content.stat4Value, label: content.stat4Label },
  ].filter((s) => s.value.trim());
  const stats = [...panelStats, ...HERO_FACTS.filter((f) => !panelStats.some((s) => s.value === f.value))].slice(0, 4);

  return (
    <>
      <section className={hr.hero}>
        <div className={cx(h.wrap, hr.in)}>
          <div className={hr.copy}>
            <span className={hr.badge}>{HERO.badge}</span>
            <h1>{withAccent(content.heroTitle)}</h1>
            <p className={hr.lede}>{content.heroLead}</p>
            <div className={hr.actions}>
              <a className={h.btn} href="#iletisim" data-konu="demo">{content.ctaButtonText} <ArrowIcon /></a>
              <a className={cx(h.btn, hr.outline)} href="#urunler">Size uygun ürünü bulun</a>
            </div>
            <ul className={hr.checks}>
              {HERO.checks.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <figure className={hr.visual}>
            <img className={hr.photo} src={HERO.image} alt={HERO.alt} width={1080} height={607} fetchPriority="high" />
            <figcaption className={hr.partner}>
              <MikroLogo className={hr.mikro} />
              <span className={hr.badges}>
                <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
                <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
      <div className={hr.statsBar}>
        <dl className={cx(h.wrap, hr.stats)}>
          {stats.map((s) => (
            <div key={s.value} className={hr.stat}><dt>{s.value}</dt><dd>{s.label}</dd></div>
          ))}
        </dl>
      </div>
    </>
  );
}
