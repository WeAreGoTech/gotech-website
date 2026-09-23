/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { BEYOND, HOME_FAQ } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx, REVEAL, SectionHead } from "./parts";
import s from "./sections.module.css";

/** Mikro'nun yetmediği yer: Mikro'ya özel geliştirme ve Mikro'dan bağımsız yazılım. */
export function Beyond() {
  return (
    <section className={cx(h.sec, h.ground)} id="yazilim">
      <div className={h.wrap}>
        <SectionHead eyebrow="Yazılım" title="Mikro'nun yetmediği yerde de kendi yazılım ekibimiz var" />
        <div className={cx(s.grid, s.cols2)}>
          {BEYOND.map((card) => (
            <article className={s.bcard} id={card.id} key={card.id} {...REVEAL}>
              <span className={s.ico}><Icon name={card.icon} /></span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <ul>
                {card.items.map((item) => <li key={item.title}><b>{item.title}</b>{item.note && <span>{item.note}</span>}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className={h.sec} id="hakkimizda">
      <div className={cx(h.wrap, s.about)}>
        <figure className={s.aboutPhoto} {...REVEAL}>
          <img src="/images/ofis.jpg" alt="GoTech ofisi" width={1200} height={800} loading="lazy" />
          <figcaption>Alsancak, İzmir — Deren Plaza</figcaption>
        </figure>
        <div className={s.aboutCopy}>
          <SectionHead
            eyebrow="Hakkımızda"
            title="Mikro Yazılım'ı üreticinin içinde öğrendik, 2017'de kendi yolumuza çıktık."
            lede="KOBİ ve kurumlar için Mikro çözümlerine entegre iş analizi, 3. parti yazılımlar, kurulum, eğitim ve destek süreçlerinin tamamında yanınızdayız."
          />
          <a className={h.link} href="#iletisim" {...REVEAL}>Bizimle tanışın <ArrowIcon /></a>
        </div>
      </div>
    </section>
  );
}

/** SSS: yerel <details>, JS gerekmez; yükseklik geçişi sections.module.css'te. */
export function Faq() {
  return (
    <section className={cx(h.sec, h.ground)} id="sss">
      <div className={h.wrap}>
        <SectionHead center eyebrow="SSS" title="Sık sorulan sorular" />
        <div className={s.faq}>
          {HOME_FAQ.map((item) => (
            <details key={item.q} {...REVEAL}>
              <summary>{item.q}<i aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
