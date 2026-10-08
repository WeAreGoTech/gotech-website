/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
// /hakkimizda: kim olduğumuz, nasıl çalıştığımız, neler yaptığımız. Yalnız doğrulanmış bilgiler (ekip ve ofis fotoğrafı gelince eklenecek).

import Link from "next/link";
import { WAYS } from "@/components/hakkimizda/content";
import { ABOUT_INDEX, ABOUT_STORY } from "../content";
import { Arrow } from "../ui/icons";
import { cx, Go, Head, typo } from "../ui/parts";
import p from "../ui/page.module.css";
import a from "./about.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Hikâye: solda şehir fotoğrafı (ofisimiz değil, altındaki yazı da öyle söylüyor), sağda iki paragraf. */
export function Story() {
  const { image } = ABOUT_STORY;
  return (
    <section className="sec sec-line" id="biz">
      <div className={cx("wrap", p.duo)}>
        <figure className={cx("media", p.duoPhoto)} data-media="" data-parallax="">
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
          <figcaption>{image.caption}</figcaption>
        </figure>
        <div className={p.duoCopy}>
          <Head label={ABOUT_STORY.label} title={ABOUT_STORY.title} />
          {ABOUT_STORY.paragraphs.map((text) => (
            <p key={text.slice(0, 24)} className={a.para} data-reveal="">{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Satış sonrası nasıl çalıştığımız: başlık solda, açıklama ve bağlantı sağda. */
export function Ways() {
  return (
    <section className="sec sec-line" id="nasil-calisiyoruz">
      <div className={cx("wrap", a.ways)}>
        <Head label="Satış sonrası" title="Satış sonrası hizmetlerimiz" />
        <ul className={p.rows}>
          {WAYS.map((w) => (
            <li key={w.title} className={p.row} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <h3 className={p.rowTitle}>{typo(w.title)}</h3>
              <div className={p.rowBody}>
                <p>{w.body}</p>
                {w.link && <Go link={w.link} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Neler yapıyoruz: sitenin diğer sayfalarına büyük puntolu dizin. */
export function WhatWeDo() {
  return (
    <section className="sec sec-line" aria-label="Neler yapıyoruz">
      <div className="wrap">
        <div className="split">
          <Head label="Faaliyet alanlarımız" title="Ürünler, hizmetler ve yazılım" />
        </div>
        <ul className={p.index}>
          {ABOUT_INDEX.map((item, i) => (
            <li key={item.href} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <Link className={p.indexRow} href={item.href}>
                <span className={p.indexNum}>{pad(i + 1)}</span>
                <span className={p.indexTitle}>{item.title}</span>
                <span className={p.indexText}>{item.text}</span>
                <span className={p.indexGo}><Arrow size={18} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
