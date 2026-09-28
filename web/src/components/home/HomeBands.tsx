import Link from "next/link";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { PROCESS_STEPS } from "@/components/kurumsal/urunler-data";
import b from "./bands.module.css";
import { MIKRO_MODULES, PROCESS_ICONS, SECTORS } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx, REVEAL, SectionHead, telHref } from "./parts";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Modüller ve sektörler (lacivert bölüm): Mikro Jump ve Fly'daki başlıca alanlar sekiz kartta, altında Mikro'nun sektörel
 * modülleri ve ek çözümleri. Bilgiler Mikro'nun ürün sayfalarından; GoTech'in sektör deneyimi iddiası değil.
 */
export function Modules() {
  return (
    <section className={cx(h.sec, h.navySec)} id="moduller">
      <div className={h.wrap}>
        <div className={b.modulesTop}>
          <SectionHead
            dark
            eyebrow="Mikro ile neler yönetilir?"
            title="Stoktan bordroya,"
            accent="tek programda"
            lede="Mikro Jump ve Fly'da ana pakette gelen ve modül olarak eklenen başlıca alanlar. Hangilerinin size gerektiğini keşif görüşmesinde birlikte çıkarıyoruz."
          />
          <Link className={cx(h.btn, b.onNavy)} href="/urunler" {...REVEAL}>Özellikleri karşılaştırın <ArrowIcon /></Link>
        </div>
        <ul className={b.modules}>
          {MIKRO_MODULES.map((m) => (
            <li key={m.title} className={b.module} {...REVEAL}>
              <span className={b.moduleIcon}><Icon name={m.icon} size={22} /></span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </li>
          ))}
        </ul>
        <div className={b.sectors} {...REVEAL}>
          <p>Mikro&apos;nun sektörel modülleri ve ek çözümleri</p>
          <ul>
            {SECTORS.map((s) => <li key={s.label}><Icon name={s.icon} size={17} />{s.label}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Süreç şeridi: ilk görüşmeden kurulum sonrası desteğe altı adım (PROCESS_STEPS), numaralı ve birbirine çizgiyle bağlı. */
export function Process() {
  return (
    <section className={h.sec} id="surec">
      <div className={h.wrap}>
        <SectionHead
          center
          eyebrow="Nasıl çalışıyoruz"
          title="Altı adımda"
          accent="Mikro'ya geçiş"
          lede="İlk görüşmeden kurulum sonrası desteğe aynı ekip. Süreyi keşif görüşmesinde işletmenize göre netleştiriyoruz."
        />
        <ol className={b.steps}>
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className={b.step} {...REVEAL}>
              <span className={b.stepIcon}><Icon name={PROCESS_ICONS[i]} size={24} /></span>
              <span className={b.stepNum}>{pad(i + 1)}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className={b.stepsAfter}>
          <Link className={h.link} href="/hizmetlerimiz">Hizmetlerin ayrıntısı <ArrowIcon /></Link>
        </div>
      </div>
    </section>
  );
}

/** Kırmızı çağrı bandı: mevcut kurulumu ücretsiz inceleme (keşif görüşmesi); telefon panelden girildiyse yanında. */
export function CtaBand({ settings }: { settings: SiteSettings }) {
  const phone = settings.salesPhone || settings.supportPhone;
  return (
    <section className={b.band}>
      <div className={cx(h.wrap, b.bandIn)}>
        <div className={b.bandCopy} {...REVEAL}>
          <span className={b.bandTag}>Ücretsiz keşif görüşmesi</span>
          <h2>Mevcut kurulumunuzu ücretsiz inceleyelim</h2>
          <p>
            Mikro&apos;ya ilk kez geçiyor, V16&apos;dan yükseltiyor ya da desteğinizi başka bir iş ortağından taşıyor olun;
            mevcut durumunuzu inceleyip hangi ürün ve modüllerin gerektiğini birlikte çıkaralım.
          </p>
        </div>
        <div className={b.bandActions} {...REVEAL}>
          <a className={cx(h.btn, b.white)} href="#iletisim" data-konu="gecis" data-mesaj="Mevcut kurulumumuzu incelemenizi istiyoruz.">
            Keşif görüşmesi isteyin <ArrowIcon />
          </a>
          {phone
            ? <a className={cx(h.btn, b.line)} href={telHref(phone)}><Icon name="phone" size={17} />{phone}</a>
            : <Link className={cx(h.btn, b.line)} href="/urunler">Ürünleri karşılaştırın</Link>}
        </div>
      </div>
    </section>
  );
}
