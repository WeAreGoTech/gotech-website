import { ArrowIcon } from "@/components/kurumsal/Icons";
import { EDONUSUM_CONSULTING, EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import { EDONUSUM_ICONS, EDONUSUM_NOTES, SERVICE_CARDS } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx, PageLink, REVEAL, SectionHead } from "./parts";
import sv from "./services.module.css";

/**
 * Ana sayfa Hizmetler: ikonlu altı kart (analiz, kurulum, e-Dönüşüm, eğitim, destek, özel yazılım). Ayrıntısı /hizmetlerimiz'de;
 * e-Dönüşüm ve Destek kartları ana sayfadaki kendi bölümlerine iner.
 */
export function Services() {
  return (
    <section className={h.sec} id="hizmetler">
      <div className={h.wrap}>
        <SectionHead
          center
          eyebrow="Hizmetlerimiz"
          title="Ürün seçiminden kurulum sonrası desteğe"
          lede="Lisans Mikro'dan; analizi, kurulumu, e-Dönüşümü, eğitimi ve desteği GoTech ekibi yapıyor."
        />
        <ul className={sv.grid}>
          {SERVICE_CARDS.map((card) => (
            <li key={card.id} className={cx(h.card, sv.card)} {...REVEAL}>
              <span className={h.iconBox}><Icon name={card.icon} size={24} /></span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <PageLink className={cx(h.link, sv.more)} link={card.link} arrow />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** e-Dönüşüm: solda ne yaptığımız ve iletişim, sağda sekiz e-belge kartı (ikon, ad, tek satır açıklama). */
export function EDonusum() {
  return (
    <section className={cx(h.sec, h.ground)} id="edonusum">
      <div className={cx(h.wrap, sv.edo)}>
        <div className={sv.edoCopy}>
          <SectionHead
            eyebrow="e-Dönüşüm"
            title="e-Belgelerinizi de biz kuruyoruz"
            lede="GİB başvurusunu, entegratör bağlantısını ve Mikro'daki e-belge ayarlarını biz yapıyoruz. Belgeler programın içinden, kontörle kesilir."
          />
          <ul className={sv.ticks} {...REVEAL}>{EDONUSUM_CONSULTING.map((t) => <li key={t}>{t}</li>)}</ul>
          <a className={h.btn} href="#iletisim" data-konu="bilgi" data-mesaj="Hangi e-belgelerin bizim için zorunlu olduğunu öğrenmek istiyoruz." {...REVEAL}>
            Hangi e-belgeler size zorunlu? <ArrowIcon />
          </a>
        </div>
        <ul className={sv.docs}>
          {EDONUSUM_DOCS.map((doc) => (
            <li key={doc} className={sv.doc} {...REVEAL}>
              <span className={sv.docIcon}><Icon name={EDONUSUM_ICONS[doc]} size={20} /></span>
              <span><b>{doc}</b><small>{EDONUSUM_NOTES[doc]}</small></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
