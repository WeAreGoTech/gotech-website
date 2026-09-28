/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { ReactNode } from "react";
import { EDONUSUM_NOTES, PORTAL_HREF, SUPPORT_CHANNELS } from "@/components/home/home-content";
import h from "@/components/home/home.module.css";
import { cx, REVEAL, telHref } from "@/components/home/parts";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { EDONUSUM_CONSULTING, EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import { ANALYSIS_ITEMS, QUESTIONS, questionById, TRAINING_ITEMS } from "./content";
import { StepPanels } from "./StepPanels";
import s from "./hizmetler.module.css";

const IMG = { width: 960, height: 640 };
const pad = (n: number) => String(n).padStart(2, "0");
const numberOf = (id: string) => pad(QUESTIONS.findIndex((x) => x.id === id) + 1);

/** Giriş: solda sayfanın ne olduğu, sağda beş soru; her soru kendi bölümüne iner. */
export function QuestionsHero() {
  return (
    <section className={s.hero}>
      <div className={cx(h.wrap, s.heroIn)}>
        <div className={s.heroCopy}>
          <nav className={s.crumb} aria-label="Konum"><Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span><span>Hizmetler</span></nav>
          <h1>Mikro&apos;ya geçerken sık sorulan beş soru</h1>
          <p className={h.lede}>Aşağıda her sorunun cevabını ve bu konuda ne yaptığımızı bulabilirsiniz. Sorunuz burada yoksa keşif görüşmesinde konuşalım.</p>
          <a className={h.btn} href="#iletisim" data-konu="demo">Keşif görüşmesi isteyin <ArrowIcon /></a>
        </div>
        <ol className={s.qlist}>
          {QUESTIONS.map((x, i) => (
            <li key={x.id} {...REVEAL}>
              <a href={`#${x.id}`}>
                <span className={s.qNum}>{pad(i + 1)}</span>
                <span className={s.qText}>
                  <b>{x.q}</b>
                  <small>{x.service}</small>
                </span>
                <ArrowIcon size={18} />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Her bölümün başı: numara ve hizmet adı, soru başlık olarak, cevap yanında. */
function Chapter({ id, ground, children }: { id: string; ground?: boolean; children: ReactNode }) {
  const x = questionById(id);
  return (
    <section className={cx(h.sec, ground && h.ground, s.chapter)} id={id}>
      <div className={h.wrap}>
        <header className={s.chHead}>
          <span className={s.chTag} {...REVEAL}>{numberOf(id)} · {x.service}</span>
          <h2 {...REVEAL}>{x.q}</h2>
          <p className={h.lede} {...REVEAL}>{x.a}</p>
        </header>
        {children}
      </div>
    </section>
  );
}

const Ticks = ({ items }: { items: string[] }) => <ul className={s.ticks}>{items.map((t) => <li key={t}>{t}</li>)}</ul>;

export function AnalysisChapter() {
  return (
    <Chapter id="analiz">
      <figure className={s.wide} {...REVEAL}>
        <img src="/images/stok/analiz-atolye.webp" alt="Toplantıda tahtaya not alan bir danışman" width={IMG.width} height={IMG.height} loading="lazy" />
      </figure>
      <div className={s.under} {...REVEAL}>
        <Ticks items={ANALYSIS_ITEMS} />
        <Link className={h.link} href="/urunler">Ürünleri karşılaştırın <ArrowIcon /></Link>
      </div>
    </Chapter>
  );
}

export function SetupChapter() {
  return (
    <Chapter id="kurulum" ground>
      <StepPanels />
    </Chapter>
  );
}

/** e-Dönüşüm: sekiz e-belge büyük punto bir dizin; her satır o belge için bilgi formunu açar. */
export function EDocChapter() {
  return (
    <Chapter id="edonusum">
      <Ticks items={EDONUSUM_CONSULTING} />
      <ol className={s.docs}>
        {EDONUSUM_DOCS.map((doc, i) => (
          <li key={doc} {...REVEAL}>
            <a href="#iletisim" data-konu="bilgi" data-mesaj={`${doc} hakkında bilgi almak istiyoruz.`}>
              <span className={s.docNum}>{pad(i + 1)}</span>
              <b>{doc}</b>
              <span className={s.docNote}>{EDONUSUM_NOTES[doc]}</span>
              <span className={s.docGo}>Bilgi alın <ArrowIcon /></span>
            </a>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

export function TrainingChapter() {
  return (
    <Chapter id="egitim" ground>
      <div className={s.training} {...REVEAL}>
        <img src="/images/stok/egitim-sunum.webp" alt="Ekrandaki sunumu izleyen bir ekip" width={IMG.width} height={IMG.height} loading="lazy" />
        <ul>{TRAINING_ITEMS.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </Chapter>
  );
}

/** Destek: kanallar; telefon satırı yalnız numara panelden girilince görünür. */
export function SupportChapter({ settings }: { settings: SiteSettings }) {
  const phone = settings.supportPhone;
  const channels: { title: string; when: string; body: string; href: string }[] = [
    ...(phone ? [{ title: "Destek hattı", when: settings.workingHours, body: phone, href: telHref(phone) }] : []),
    ...SUPPORT_CHANNELS.map((c) => ({ ...c, when: c.when || settings.workingHours, href: "" })),
  ];
  return (
    <Chapter id="destek">
      <ul className={s.channels}>
        {channels.map((c) => (
          <li key={c.title} {...REVEAL}>
            <h3>{c.title}</h3>
            <span className={s.when}>{c.when}</span>
            <p>{c.href ? <a href={c.href}>{c.body}</a> : c.body}</p>
          </li>
        ))}
      </ul>
      <Link className={cx(h.btn, s.portal)} href={PORTAL_HREF} {...REVEAL}>Destek portalına giriş <ArrowIcon /></Link>
    </Chapter>
  );
}
