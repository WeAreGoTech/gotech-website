import type { CSSProperties } from "react";
import { EDONUSUM_CONSULTING, EDONUSUM_DOCS, PROCESS_STEPS, SERVICES } from "@/components/kurumsal/urunler-data";
import { EDONUSUM_NOTES, SERVICE_ICONS } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx, REVEAL, SectionHead } from "./parts";
import s from "./sections.module.css";

export function Services() {
  return (
    <section className={h.sec} id="hizmetler">
      <div className={h.wrap}>
        <SectionHead eyebrow="Hizmetler" title="Size nasıl yardımcı olabiliriz?" lede="Lisans, kurulum, eğitim ve destek tek elden. Arada üçüncü bir firma yok." />
        <div className={cx(s.grid, s.cols3)}>
          {SERVICES.map((service, i) => (
            <article className={s.card} key={service.title} {...REVEAL}>
              <span className={s.ico}><Icon name={SERVICE_ICONS[i]} /></span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <ul className={s.tags}>{service.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** e-Dönüşüm: solda ne yaptığımız (urunler-data EDONUSUM_CONSULTING), sağda sekiz e-belge. */
export function EDonusum() {
  return (
    <section className={cx(h.sec, h.ground)} id="edonusum">
      <div className={cx(h.wrap, s.edo)}>
        <div className={s.edoCopy}>
          <SectionHead
            eyebrow="e-Dönüşüm"
            title="e-Belgelerinizi de biz kuruyoruz"
            lede="GİB başvurusu, entegratör bağlantısı ve Mikro'daki ayarlar tek elden. Hangi belgelerin sizin için zorunlu olduğunu da birlikte netleştiriyoruz."
          />
          <ul className={s.ticks} {...REVEAL}>{EDONUSUM_CONSULTING.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <ul className={s.docs}>
          {EDONUSUM_DOCS.map((doc) => (
            <li key={doc} {...REVEAL}><b>{doc}</b><span>{EDONUSUM_NOTES[doc]}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Yol haritası: bölüm görününce çizgi dolar, adımlar sırayla yanar (sections.module.css .road). */
export function Roadmap() {
  return (
    <section className={h.sec} id="surec">
      <div className={h.wrap}>
        <SectionHead center eyebrow="Yol haritası" title="İlk görüşmeden canlı kullanıma altı adım" lede="Keşif görüşmesinden sonra 24 saat içinde yazılı teklif ve takvim veriyoruz." />
        <ol className={s.road} {...REVEAL}>
          <li className={s.roadLine} aria-hidden="true"><i className={s.roadFill} /></li>
          {PROCESS_STEPS.map((step, i) => (
            <li className={s.step} key={step.title} style={{ "--i": i } as CSSProperties}>
              <span className={s.dot}>{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
