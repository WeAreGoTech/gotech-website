/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
// Ana sayfanın bölümleri: ürünler, süreç, e-Dönüşüm, özel yazılım (destek: Support.tsx).

import { REFERENCES } from "@/components/kurumsal/referanslar";
import { EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import { WORKS } from "@/components/yazilim/content";
import { EDOC_NOTES, HOME_EDOCS, HOME_PROCESS, HOME_PRODUCTS, HOME_SOFTWARE, PROCESS_STEPS } from "../content";
import { cx, Go, Head, typo } from "../ui/parts";
import s from "./home.module.css";
import { Picker } from "./Picker";

const pad = (n: number) => String(n).padStart(2, "0");

/** Ürünler: "Jump mı, Fly mı?" — cümleyle çalışan ürün bulucu. */
export function Products() {
  return (
    <section className="sec sec-line" id="urunler">
      <div className="wrap">
        <div className="split">
          <Head label={HOME_PRODUCTS.label} title={HOME_PRODUCTS.title} soft={HOME_PRODUCTS.soft} />
          <p className="lede split-side" data-reveal="">{HOME_PRODUCTS.lede}</p>
        </div>
        <Picker />
        <div className={s.after} data-reveal="">
          <Go link={{ label: "Hangi üründe ne olduğunu tabloda görün", href: "/urunler#karsilastirma" }} />
        </div>
      </div>
    </section>
  );
}

/**
 * Süreç: altı adım, kutusuz. Masaüstünde solda yapışkan tek fotoğraf (etkin adımınki), sağda adımlar; kaydırdıkça
 * ekranın ortasındaki adım koyulaşır, soldaki çizgi dolar (Motion: data-steps). Telefonda her adım kendi fotoğrafıyla alt alta.
 */
export function Process() {
  return (
    <section className="sec sec-line" id="surec">
      <div className="wrap">
        <div className="split">
          <Head label={HOME_PROCESS.label} title={HOME_PROCESS.title} />
          <p className="lede split-side" data-reveal="">{HOME_PROCESS.lede}</p>
        </div>
        <div className={s.flow} data-steps="">
          <div className={s.flowMedia} aria-hidden="true">
            <div className={s.flowFrame} data-media="">
              {PROCESS_STEPS.map((step, i) => (
                <img key={step.image} src={step.image} alt="" width={960} height={640} loading="lazy" data-step-img="" data-active={i === 0 ? "" : undefined} />
              ))}
            </div>
          </div>
          <div className={s.stepsWrap}>
            <span className={s.rail} aria-hidden="true"><span className={s.railFill} data-steps-fill="" /></span>
            <ol className={s.steps}>
              {PROCESS_STEPS.map((step, i) => (
                <li key={step.title} className={s.step} data-step="" data-active={i === 0 ? "" : undefined}>
                  <span className={s.stepNum}>{pad(i + 1)}</span>
                  <div className={s.stepText}>
                    <figure className={cx("media", s.stepPhoto)}>
                      <img src={step.image} alt={step.alt} width={960} height={640} loading="lazy" />
                    </figure>
                    <h3 className={s.stepTitle}>{typo(step.title)}</h3>
                    <p className={s.stepBody}>{step.body}</p>
                    <ul className={cx("ticks", s.stepScope)}>
                      {step.scope.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** e-Dönüşüm: solda ne yaptığımız (yapışkan), sağda büyük puntoyla e-belge dizini. */
export function EDocs() {
  return (
    <section className="sec sec-line" id="edonusum">
      <div className={cx("wrap", s.docs)}>
        <div className={s.docsSide}>
          <Head label={HOME_EDOCS.label} title={HOME_EDOCS.title} lede={HOME_EDOCS.body} />
          <Go link={HOME_EDOCS.link} reveal />
        </div>
        <ul className={s.docList}>
          {EDONUSUM_DOCS.map((doc) => (
            <li key={doc} data-reveal="">
              <i className={s.rule} data-draw="" aria-hidden="true" />
              <span className={s.docName}>{doc}</span>
              <span className={s.docNote}>{EDOC_NOTES[doc]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Özel yazılım: fotoğraf, yaptığımız iş türleri ve referans. */
export function Software() {
  const { image } = HOME_SOFTWARE;
  return (
    <section className="sec sec-line" id="yazilim">
      <div className={cx("wrap", s.soft)}>
        <figure className={cx("media", s.softPhoto)} data-media="" data-parallax="">
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
        </figure>
        <div className={s.softCopy}>
          <Head label={HOME_SOFTWARE.label} title={HOME_SOFTWARE.title} lede={HOME_SOFTWARE.body} />
          <ul className={cx("ticks", s.softList)} data-reveal="">
            {WORKS.map((w) => <li key={w.title}>{w.title}</li>)}
          </ul>
          <div className={s.refs} data-reveal="">
            <span>Özel yazılım geliştirdiğimiz kurumlar</span>
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
