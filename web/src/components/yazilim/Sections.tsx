/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import h from "@/components/home/home.module.css";
import { cx, REVEAL, SectionHead, telHref } from "@/components/home/parts";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ContactForm } from "@/components/kurumsal/ContactForm";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { REFERENCES, SOFTWARE_TRACKS } from "@/components/kurumsal/referanslar";
import { APPROACH, SOFTWARE_STEPS } from "./content";
import { WorkIndex } from "./WorkIndex";
import s from "./yazilim.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Giriş: tam ekran fotoğraf, üstünde başlık ve iki buton. Menü bu sayfada fotoğrafın üstünde
 * saydam duruyor (HomeNav OVER_HERO); sayfa kayınca normal beyaz menüye dönüyor.
 * Fotoğraf CC0 (public/images/stok/KAYNAK.md); okunabilirlik için üstünde koyu bir perde var.
 */
export function SoftwareCover() {
  return (
    <section className={s.cover}>
      <img className={s.coverPhoto} src="/images/stok/kod-inceleme.webp" alt="" width={960} height={640} fetchPriority="high" />
      <div className={s.coverScrim} aria-hidden="true" />
      <div className={cx(h.wrap, s.coverIn)}>
        <nav className={cx(s.crumb, s.crumbOver)} aria-label="Konum">
          <Link href="/">Ana sayfa</Link>
          <span aria-hidden="true">/</span>
          <span>Yazılım çözümleri</span>
        </nav>
        <h1 className={s.coverTitle}>
          İşinize özel yazılım,<br />Mikro&apos;ya bağlı ya da bağımsız
        </h1>
        <p className={s.coverLede}>
          Mikro kullanıyorsanız işletmenize özel ekran, rapor ve bağlantıları Mikro&apos;ya bağlı geliştiriyoruz; verileriniz
          Mikro&apos;da kalır. Kullanmıyorsanız da web sitenizi, portalınızı ya da iş uygulamanızı aynı ekip geliştirir.
        </p>
        <div className={s.coverCta}>
          <a className={h.btn} href="#iletisim" data-konu="bilgi" data-mesaj="Yazılım projemizi konuşmak istiyoruz.">
            Projenizi anlatın <ArrowIcon />
          </a>
          <a className={cx(h.btn, s.btnLight)} href="#ne-yapiyoruz">Ne geliştiriyoruz?</a>
        </div>
        <a className={s.scrollCue} href="#ne-yapiyoruz">
          <span>Aşağı kaydırın</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

/** Geliştirdiğimiz yazılım türleri: iki grup, numaralı dizin (WorkIndex). */
export function WorksSection() {
  return (
    <section className={h.sec} id="ne-yapiyoruz">
      <div className={h.wrap}>
        <SectionHead
          eyebrow="Ne geliştiriyoruz"
          title="Mikro'ya bağlı işler ve Mikro'dan bağımsız işler"
          lede="Aşağıdaki işlerin tamamını kendi yazılım ekibimiz geliştiriyor."
        />
        <div className={s.worksIn}>
          <WorkIndex />
        </div>
      </div>
    </section>
  );
}

/**
 * İki iş türü: Mikro'ya bağlı ve Mikro'dan bağımsız. Girişteki dizin işleri zaten sayıyor;
 * burada yalnız ikisi arasındaki fark anlatılıyor (fotoğraf + iki cümle), liste tekrar edilmiyor.
 */
export function TracksSection() {
  return (
    <section className={cx(h.sec, h.ground)} id="isler">
      <div className={h.wrap}>
        <SectionHead
          eyebrow="İki tür iş"
          title="Mikro'ya bağlı ya da tamamen bağımsız"
          lede="Mikro kullanıyorsanız ihtiyacınız olan ek geliştirmeyi Mikro'ya bağlı yapıyoruz; kullanmıyorsanız yazılımınızı baştan geliştiriyoruz. İki durumda da aynı ekip çalışıyor."
        />
        <div className={s.tracks}>
          {SOFTWARE_TRACKS.map((track) => (
            <article key={track.id} id={track.id} className={s.track} {...REVEAL}>
              <img className={s.trackPhoto} src={track.image} alt="" width={960} height={640} loading="lazy" />
              <div className={s.trackBody}>
                <span className={h.eyebrow}>{track.tag}</span>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Çalışma biçimi: ilk görüşmeden yayın sonrasına altı adım. Ana sayfadaki dikey raydan farklı
 * bir düzen: tam genişlik satırlar, solda büyük numara, ortada ne yaptığımız, sağda o adımın
 * kapsamı. Numara satır ekranın ortasına geldiğinde markaya dönüyor (animation-timeline:view()).
 */
export function HowWeWork() {
  return (
    <section className={h.sec} id="nasil-calisiyoruz">
      <div className={h.wrap}>
        <div className={s.flowTop}>
          <SectionHead
            eyebrow="Çalışma biçimi"
            title="İlk görüşmeden yayın sonrasına"
            lede="Kapsamı birlikte çıkarıyoruz, parça parça ilerliyoruz, yayından sonra da aynı ekip bakıyor."
          />
          <a className={h.btn} href="#iletisim" data-konu="bilgi" data-mesaj="Yazılım projemizi konuşmak istiyoruz." {...REVEAL}>
            Projenizi anlatın <ArrowIcon />
          </a>
        </div>
        <ol className={s.flow}>
          {SOFTWARE_STEPS.map((step, i) => (
            <li key={step.title} className={s.flowRow} {...REVEAL}>
              <span className={s.flowNum} aria-hidden="true">{pad(i + 1)}</span>
              {/* sıra bilgisi <ol>'den geliyor: numara yalnız görsel, "Adım 1" yazısı tekrar olurdu */}
              <div className={s.flowMain}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <ul className={s.flowScope}>
                {step.scope.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Her işte geçerli dört ilke: kartsız, ince ayraçlı dört sütun. */
export function Approach() {
  return (
    <section className={cx(h.sec, h.ground)} id="yaklasim">
      <div className={h.wrap}>
        <SectionHead
          eyebrow="Nasıl geliştiriyoruz"
          title="Geliştirirken dikkat ettiklerimiz"
          lede="Her projede uyguladığımız dört temel kural."
        />
        <dl className={s.approach}>
          {APPROACH.map((item) => (
            <div key={item.title} {...REVEAL}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/**
 * Özel yazılım geliştirdiğimiz kurumlar (referanslar.ts, yalnız GoTech'in onayladığı müşteriler).
 * Logo beyaz kutunun içinde: marka kılavuzu gereği logolar düz beyaz zeminde durur.
 */
export function ReferenceBand() {
  return (
    <section className={h.sec} id="referanslar">
      <div className={h.wrap}>
        <SectionHead
          eyebrow="Referanslar"
          title="Özel yazılım geliştirdiğimiz kurumlar"
          lede="Yaptığımız işin ayrıntısını görüşmede anlatıyoruz; burada yalnız adını paylaşmamıza izin verilen kurumlar var."
        />
        <ul className={s.refs}>
          {REFERENCES.map((ref) => (
            <li key={ref.name} {...REVEAL}>
              <span className={s.refLogo}>
                <img src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" />
              </span>
              <div>
                <b>{ref.sector}</b>
                <p>{ref.work}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Kapanış: tam ekran, tam kırmızı iletişim bölümü. Kırmızı zemin ayrı bir div (.ctaSkin):
 * bölüm ekrana girerken kenarlardan içeride ve yuvarlak köşeli başlıyor, kaydırdıkça
 * tam ekrana açılıyor; içerik aynı anda alttan yükseliyor (animation-timeline:view()).
 * Destek yoksa ya da hareket kapalıysa: doğrudan tam ekran kırmızı, animasyon yok.
 */
export function ProjectCta({ settings }: { settings: SiteSettings }) {
  const address = settings.address.replace(/\n/g, " ");
  return (
    <section className={s.cta} id="iletisim">
      <div className={s.ctaSkin} aria-hidden="true" />
      <div className={cx(h.wrap, s.ctaIn)}>
        <div className={s.ctaCopy} {...REVEAL}>
          <h2>Projenizi anlatın</h2>
          <p className={s.ctaLede}>
            Ne yapmak istediğinizi kısaca yazın; yazılım ekibimiz değerlendirip size dönsün. Ne kadar süreceğini ve
            neye mal olacağını da o görüşmede konuşuyoruz.
          </p>
          <dl className={s.ctaInfo}>
            {settings.salesPhone && (
              <div>
                <dt>Telefon</dt>
                <dd><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></dd>
              </div>
            )}
            <div>
              <dt>E-posta</dt>
              <dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd>
            </div>
            <div>
              <dt>Çalışma saatleri</dt>
              <dd>{settings.workingHours}</dd>
            </div>
            <div>
              <dt>Adres</dt>
              <dd>{address}</dd>
            </div>
          </dl>
        </div>
        <div className={s.ctaForm} {...REVEAL}>
          <ContactForm submitLabel="Projeyi anlatın" />
          <p className={s.ctaNote}>Mesajınız yazılım ekibimize düşer; ihtiyacınızı konuşmak için sizinle iletişime geçiyoruz.</p>
        </div>
      </div>
    </section>
  );
}

/** SSS'nin sol sütununda, başlığın altında duran küçük yönlendirme. */
export function FaqSide() {
  return (
    <div className={s.faqSide}>
      <a className={h.link} href="#iletisim" data-konu="bilgi" data-mesaj="Yazılım projemizi konuşmak istiyoruz.">
        Projenizi anlatın <ArrowIcon />
      </a>
      <Link className={h.link} href="/iletisim">
        İletişim bilgileri <ArrowIcon />
      </Link>
    </div>
  );
}
