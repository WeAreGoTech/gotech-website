/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
// /hizmetlerimiz: hizmet dizini ve her hizmetin bölümü (analiz, kurulum, eğitim; e-Dönüşüm ve destek ana sayfayla ortak).

import { SERVICE_ANALYSIS, SERVICE_INDEX, SERVICE_SETUP, SERVICE_TRAINING } from "../content";
import { Arrow } from "../ui/icons";
import { cx, Go, Head } from "../ui/parts";
import p from "../ui/page.module.css";
import v from "./services.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Hizmet dizini: büyük puntolu satırlar, her biri sayfadaki bölümüne iner. */
export function ServiceIndex() {
  return (
    <section className="sec sec-line" aria-label="Hizmetler">
      <div className="wrap">
        <ul className={p.index}>
          {SERVICE_INDEX.map((item, i) => (
            <li key={item.id} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <a className={p.indexRow} href={`#${item.id}`}>
                <span className={p.indexNum}>{pad(i + 1)}</span>
                <span className={p.indexTitle}>{item.title}</span>
                <span className={p.indexText}>{item.text}</span>
                <span className={p.indexGo}><Arrow size={18} /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type Image = { src: string; alt: string; width: number; height: number };

function Photo({ image, tall = false }: { image: Image; tall?: boolean }) {
  return (
    <figure className={cx("media", p.duoPhoto, tall && p.tall)} data-media="" data-parallax="">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
    </figure>
  );
}

/** Analiz ve teklif: fotoğraf solda, anlatım ve kapsam sağda. */
export function Analysis() {
  const a = SERVICE_ANALYSIS;
  return (
    <section className="sec sec-line" id="analiz">
      <div className={cx("wrap", p.duo)}>
        <Photo image={a.image} tall />
        <div className={p.duoCopy}>
          <Head label={a.label} title={a.title} lede={a.body} />
          <ul className={cx("ticks", v.items)} data-reveal="">{a.items.map((x) => <li key={x}>{x}</li>)}</ul>
          <Go link={a.link} reveal />
        </div>
      </div>
    </section>
  );
}

/** Kurulum: anlatım solda, fotoğraf sağda; altında kurup bağladığımız ek çözümler. */
export function Setup() {
  const k = SERVICE_SETUP;
  return (
    <section className="sec sec-line" id="kurulum">
      <div className={cx("wrap", p.duo, p.flip)}>
        <Photo image={k.image} tall />
        <div className={p.duoCopy}>
          <Head label={k.label} title={k.title} lede={k.body} />
          <ul className={v.extras}>
            {k.extras.map((x) => (
              <li key={x.title} data-reveal="">
                <b>{x.title}</b>
                <span>{x.text}</span>
              </li>
            ))}
          </ul>
          <Go link={{ label: "Ürünleri karşılaştırın", href: "/urunler#karsilastirma" }} reveal />
        </div>
      </div>
    </section>
  );
}

/** Eğitim: fotoğraf ve iki eğitim türü. */
export function Training() {
  const t = SERVICE_TRAINING;
  return (
    <section className="sec sec-line" id="egitim">
      <div className={cx("wrap", p.duo)}>
        <Photo image={t.image} />
        <div className={p.duoCopy}>
          <Head label={t.label} title={t.title} lede={t.body} />
          <ul className={cx("ticks", v.items)} data-reveal="">{t.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
