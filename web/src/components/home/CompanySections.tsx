/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { REFERENCES } from "@/components/kurumsal/referanslar";
import { HOME_FAQ } from "./home-content";
import h from "./home.module.css";
import { cx, REVEAL, SectionHead } from "./parts";
import s from "./sections.module.css";
import { SoftwareTracks } from "./SoftwareTracks";

/**
 * Yazılım: üstte başlık ve özel yazılım geliştirdiğimiz kurumların logosu, altta iki iş türü (SoftwareTracks, yalnız iş adları).
 * Ayrıntısı /yazilim-cozumleri sayfasında.
 */
export function Beyond() {
  return (
    <section className={cx(h.sec, h.ground)} id="yazilim">
      <div className={h.wrap}>
        <div className={s.beyondTop}>
          <SectionHead
            eyebrow="Yazılım"
            title="İşletmenize özel yazılım geliştiriyoruz"
            lede="Mikro'ya bağlı ek ekran ve raporların yanında kurumsal web sitesi, portal ve e-ticaret projelerini de kendi ekibimizle geliştiriyoruz."
          />
          <div className={s.beyondSide} {...REVEAL}>
            <div className={s.refRow}>
              <span>Özel yazılım geliştirdiğimiz kurumlar</span>
              {REFERENCES.map((ref) => <img key={ref.name} src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" />)}
            </div>
            <Link className={h.link} href="/yazilim-cozumleri">Yazılım çözümlerimiz <ArrowIcon /></Link>
          </div>
        </div>
        <SoftwareTracks compact />
      </div>
    </section>
  );
}

/** Hakkımızda özeti: solda şehir fotoğrafı (ofis değil, altında yeri yazar), sağda hikâye, üç doğrulanmış bilgi ve adres. */
export function About({ settings }: { settings: SiteSettings }) {
  const facts = [
    { term: "2017", text: "Mikro Yazılım yetkili iş ortağı" },
    { term: "Silver Partner", text: "Jumper ve Flyer programlarında" },
    { term: "Alsancak", text: "İzmir ve çevresine yerinde destek" },
  ];
  return (
    <section className={h.sec} id="hakkimizda">
      <div className={cx(h.wrap, s.about)}>
        {/* şehir fotoğrafı: ofisimiz değil, altındaki yazı da öyle söylüyor */}
        <figure className={s.aboutPhoto} {...REVEAL}>
          <img src="/images/stok/izmir-kordon.webp" alt="İzmir Kordon'da deniz kenarındaki tarihî sarı bina ve yürüyen insanlar" width={1024} height={768} loading="lazy" />
          <figcaption>Kordon, İzmir</figcaption>
        </figure>
        <div className={s.aboutCopy}>
          <SectionHead
            eyebrow="Hakkımızda"
            title="Mikro Yazılım'da başladık, 2017'den beri Mikro iş ortağıyız."
            lede="KOBİ'lere ve kurumlara Mikro ürünlerinde iş analizi, kurulum, eğitim ve destek veriyor; Mikro'yla entegre çalışan yazılımları kurup bağlıyoruz."
          />
          <dl className={s.aboutFacts} {...REVEAL}>
            {facts.map((f) => <div key={f.term}><dt>{f.term}</dt><dd>{f.text}</dd></div>)}
          </dl>
          <p className={s.aboutAddress} {...REVEAL}>{settings.address.replace(/\n/g, ", ")}<br />{settings.workingHours}</p>
          <Link className={h.link} href="/hakkimizda" {...REVEAL}>GoTech&apos;i tanıyın <ArrowIcon /></Link>
        </div>
      </div>
    </section>
  );
}

type FaqItem = { q: string; a: string };
// split: başlık solda (yapışkan), sorular sağda; /hizmetlerimiz'de
// side: split düzeninde başlığın altındaki ek içerik (ör. "projenizi anlatın" bağlantısı)
type FaqProps = { items?: FaqItem[]; eyebrow?: string; title?: string; id?: string; split?: boolean; side?: ReactNode };

/** SSS: yerel <details>, JS gerekmez; yükseklik geçişi sections.module.css'te. Ana sayfa, hizmetler ve ürün sayfalarında aynı. */
export function Faq({ items = HOME_FAQ, eyebrow = "SSS", title = "Sık sorulan sorular", id = "sss", split = false, side }: FaqProps) {
  return (
    <section className={cx(h.sec, h.ground)} id={id}>
      <div className={cx(h.wrap, split && s.faqSplit)}>
        <div>
          <SectionHead center={!split} eyebrow={eyebrow} title={title} lede={split ? "Burada olmayan bir sorunuz varsa formdan yazın, çalışma saatlerinde dönüyoruz." : undefined} />
          {side}
        </div>
        <div className={s.faq}>
          {items.map((item) => (
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
