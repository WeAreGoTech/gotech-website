import Link from "next/link";
import type { SiteContent, SiteSettings } from "./content";
import { ArrowIcon } from "./Icons";
import { FAQ, PRODUCTS, SERVICES } from "./urunler-data";

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

const SHOTS = [
  { src: "/images/analiz.jpg", alt: "İş analizi toplantısı", title: "İş analizi", note: "Süreçlerinizi yerinde çıkarıyoruz" },
  { src: "/images/depo.jpg", alt: "Depo ve stok yönetimi", title: "Depo ve stok", note: "Rafı ve barkodu ERP'ye bağlıyoruz" },
  { src: "/images/egitim.jpg", alt: "Kullanıcı eğitimi", title: "Eğitim", note: "Ekibinizi kullanır hâle getiriyoruz" },
];

export function ProductRows() {
  return (
    <section className="sec" id="urunler">
      <div className="wrap">
        <span className="tag">Ürünler</span>
        <h2 className="d2" style={{ marginTop: 14, maxWidth: "17ch" }}>
          Kaç kişisiniz? Mikro&apos;nun doğrusu ona göre.
        </h2>

        <div className="tiers">
          {PRODUCTS.map((product) => (
            <Link className="tier" key={product.id} href="/urunler">
              <span className="tier-scale">{product.scale}</span>
              <span className="tier-name">
                {product.name}
                {product.popular && <em className="tier-flag">en çok tercih edilen</em>}
              </span>
              <span className="tier-note">{product.blurb}</span>
              <span className="tier-go" aria-hidden="true">
                <ArrowIcon size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PhotoBand() {
  return (
    <section className="sec" style={{ background: "var(--ground)" }} id="sahada">
      <div className="wrap">
        <span className="tag">Sahada</span>
        <h2 className="d2" style={{ marginTop: 14, maxWidth: "18ch" }}>
          Kurulum masabaşında bitmiyor.
        </h2>

        <div className="shots">
          {SHOTS.map((shot) => (
            <figure className="shot" key={shot.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shot.src} alt={shot.alt} loading="lazy" />
              <figcaption>
                <b>{shot.title}</b>
                <span>{shot.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing({ settings, content }: { settings: SiteSettings; content: SiteContent }) {
  return (
    <section className="close on-deep" id="iletisim">
      <div className="wrap">
        <span className="tag">Ücretsiz danışmanlık</span>
        <h2 className="d2">{content.ctaTitle}</h2>
        <p className="lede">{content.ctaLead}</p>
        <Link className="btn btn-light" href={content.ctaButtonLink}>{content.ctaButtonText}</Link>

        <p className="close-stats">
          <span><b>{content.stat1Value}</b> {content.stat1Label}</span>
          <span><b>{content.stat2Value}</b> {content.stat2Label}</span>
          <span><b>{content.stat3Value}</b> {content.stat3Label}</span>
          <span><b>{content.stat4Value}</b> {content.stat4Label}</span>
        </p>

        <dl className="close-lines">
          <div>
            <dt>Satış</dt>
            <dd>
              <a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a>
            </dd>
          </div>
          <div>
            <dt>Destek</dt>
            <dd>
              <a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a>
            </dd>
          </div>
          <div>
            <dt>Çalışma saatleri</dt>
            <dd>{settings.workingHours}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function ServicesBlock() {
  return (
    <section className="sec" id="hizmetler">
      <div className="wrap">
        <span className="tag">Hizmetler</span>
        <h2 className="d2" style={{ marginTop: 14, maxWidth: "18ch" }}>
          Yazılımı satmakla bitmiyor.
        </h2>

        <div className="svcs">
          {SERVICES.map((service) => (
            <article className="svc" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqBlock() {
  return (
    <section className="sec" style={{ background: "var(--ground)" }} id="sss">
      <div className="wrap">
        <div className="faq">
          <div>
            <span className="tag">SSS</span>
            <h2 className="d2" style={{ marginTop: 14 }}>Sık sorulanlar</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
