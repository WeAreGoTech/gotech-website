/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
// Ana sayfanın (vitrin) bölümleri: kısa tanıtım, hizmet panelleri, Jump/Fly seçicisi, özel yazılım. Giriş: Stage.tsx.

import { REFERENCES, REFERENCES_LABEL } from "@/components/kurumsal/referanslar";
import { HOME_INTRO, HOME_LINKS, HOME_PROCESS, HOME_PRODUCTS, HOME_SOFTWARE, SOFTWARE_HERO } from "@/components/site/content";
import { cx, Go, Head, typo } from "@/components/site/ui/parts";
import { WORKS } from "@/components/yazilim/content";
import { Panels } from "./Panels";
import { ProductSwitch } from "./ProductSwitch";
import s from "./sections.module.css";

/** Kısa tanıtım: iki cümle, büyük puntoyla; kaydırdıkça kelimeler griden koyuya döner (Motion: data-words). */
export function Intro() {
  return (
    <section className={s.sec} aria-label="GoTech hakkında">
      <div className="wrap">
        <p className={s.intro} data-words="">{typo(`${HOME_INTRO.lead} ${HOME_INTRO.text}`)}</p>
      </div>
    </section>
  );
}

/** Hizmetler: başlık ve yanında tek bağlantı; altında genişleyen fotoğraf panelleri. */
export function Services() {
  return (
    <section className={s.sec} id="hizmetler">
      <div className="wrap">
        <div className={s.head}>
          <Head label="Hizmetler" title={HOME_PROCESS.title} />
          <Go link={HOME_LINKS.services} reveal />
        </div>
        <Panels />
      </div>
    </section>
  );
}

/** Ürünler: Jump mı, Fly mı? seçicisi ve karşılaştırma tablosuna bağlantı. */
export function Products() {
  return (
    <section className={s.sec} id="urunler">
      <div className="wrap">
        <div className={s.head}>
          <Head label={HOME_PRODUCTS.label} title={HOME_PRODUCTS.title} />
          <Go link={HOME_LINKS.compare} reveal />
        </div>
        <div data-reveal="">
          <ProductSwitch />
        </div>
      </div>
    </section>
  );
}

/** Özel yazılım: fotoğraf, kısa başlık, yaptığımız iş türleri (yalnız adları) ve referans. Mikro'yla yarış gibi okunan alt satır yok. */
export function Software() {
  const { image } = HOME_SOFTWARE;
  return (
    <section className={s.sec} id="yazilim">
      <div className={cx("wrap", s.soft)}>
        <figure className={cx("media", s.softPhoto)} data-media="" data-parallax="">
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
        </figure>
        <div className={s.softText}>
          <Head label={HOME_SOFTWARE.label} title={SOFTWARE_HERO.title} />
          <ul className={cx("ticks", s.works)} data-reveal="">
            {WORKS.map((w) => <li key={w.title}>{w.title}</li>)}
          </ul>
          <div className={s.refs} data-reveal="">
            <span>{REFERENCES_LABEL}</span>
            {REFERENCES.map((ref) => (
              <img key={ref.name} src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" />
            ))}
          </div>
          <Go link={HOME_SOFTWARE.link} reveal />
        </div>
      </div>
    </section>
  );
}
