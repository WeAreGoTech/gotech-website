import { ArrowIcon } from "@/components/kurumsal/Icons";
import { EDONUSUM_CONSULTING, EDONUSUM_DOCS, PROCESS_STEPS } from "@/components/kurumsal/urunler-data";
import type { SiteSettings } from "@/components/kurumsal/content";
import { EDONUSUM_NOTES, JOURNEY_SCOPE, SERVICE_TABS, supportTab } from "./home-content";
import h from "./home.module.css";
import { cx, REVEAL, SectionHead } from "./parts";
import s from "./sections.module.css";
import { ServiceExplorer } from "./ServiceExplorer";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Ana sayfa Hizmetler: analiz, kurulum, e-Dönüşüm, eğitim ve destek tek bölümde (ServiceExplorer). e-Dönüşüm ve Destek'in
 * ayrıntılı bölümleri /hizmetlerimiz'de. Destek sekmesi çalışma saatlerini ve telefonu panelden alır.
 */
export function Services({ settings }: { settings: SiteSettings }) {
  return (
    <section className={h.sec} id="hizmetler">
      <div className={h.wrap}>
        <SectionHead
          eyebrow="Hizmetler"
          title="Ürün seçiminden kurulum sonrası desteğe"
          lede="Lisans Mikro'dan; analizi, kurulumu, e-Dönüşümü, eğitimi ve desteği GoTech ekibi yapıyor."
        />
        <ServiceExplorer tabs={[...SERVICE_TABS, supportTab(settings.workingHours, settings.supportPhone)]} />
      </div>
    </section>
  );
}

/**
 * /hizmetlerimiz: ilk görüşmeden canlı kullanıma altı adım (PROCESS_STEPS) ve her adımda yaptığımız iş (JOURNEY_SCOPE).
 * head={false}: sayfa başlığı zaten var.
 */
export function ServiceJourney({ head = true }: { head?: boolean }) {
  return (
    <section className={h.sec} id="hizmetler">
      <div className={cx(h.wrap, s.journey)}>
        <div className={s.journeyHead}>
          {head && (
            <SectionHead
              eyebrow="Hizmetler"
              title="İlk görüşmeden canlı kullanıma tek ekip"
              lede="Lisans, kurulum, eğitim ve destek için tek muhatabınız GoTech."
            />
          )}
          <a className={h.btn} href="#iletisim" data-konu="demo" {...REVEAL}>Keşif görüşmesi isteyin <ArrowIcon /></a>
        </div>
        <ol className={s.journeyList}>
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} {...REVEAL}>
              <span className={s.jNum}>{pad(i + 1)}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <p className={s.scope}>{JOURNEY_SCOPE[i].join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** e-Dönüşüm: solda ne yaptığımız, sağda sekiz e-belge; kart değil, satır satır bir belge listesi. */
export function EDonusum() {
  return (
    <section className={cx(h.sec, h.ground)} id="edonusum">
      <div className={cx(h.wrap, s.edo)}>
        <div className={s.edoCopy}>
          <SectionHead
            eyebrow="e-Dönüşüm"
            title="e-Belgelerinizi de biz kuruyoruz"
            lede="GİB başvurusunu, entegratör bağlantısını ve Mikro'daki e-belge ayarlarını biz yapıyoruz. Belgeler programın içinden, kontörle kesilir."
          />
          <ul className={s.ticks} {...REVEAL}>{EDONUSUM_CONSULTING.map((t) => <li key={t}>{t}</li>)}</ul>
          <a className={h.link} href="#iletisim" data-konu="bilgi" data-mesaj="Hangi e-belgelerin bizim için zorunlu olduğunu öğrenmek istiyoruz." {...REVEAL}>
            Hangi e-belgeler size zorunlu? Birlikte bakalım <ArrowIcon />
          </a>
        </div>
        <dl className={s.ledger} {...REVEAL}>
          {EDONUSUM_DOCS.map((doc) => (
            <div key={doc}><dt>{doc}</dt><dd>{EDONUSUM_NOTES[doc]}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
