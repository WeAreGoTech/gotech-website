import { ArrowIcon } from "@/components/kurumsal/Icons";
import { EDONUSUM_CONSULTING, EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import { EDONUSUM_NOTES, SERVICE_CARDS } from "./home-content";
import h from "./home.module.css";
import { cx, PageLink, REVEAL, SectionHead } from "./parts";
import sv from "./services.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Ana sayfa Hizmetler: altı hizmet, iki sütun numaralı liste (ikon ve kart yok, ince ayraçlar). Ayrıntısı /hizmetlerimiz'de;
 * e-Dönüşüm ve Destek maddeleri ana sayfadaki kendi bölümlerine iner.
 */
export function Services() {
  return (
    <section className={cx(h.sec, h.ground)} id="hizmetler">
      <div className={h.wrap}>
        <SectionHead
          eyebrow="Hizmetlerimiz"
          title="Ürün seçiminden"
          accent="kurulum sonrası desteğe"
          lede="Lisans Mikro'dan; analizi, kurulumu, e-Dönüşümü, eğitimi ve desteği GoTech ekibi yapıyor."
        />
        <ol className={sv.list}>
          {SERVICE_CARDS.map((card, i) => (
            <li key={card.id} className={sv.item} {...REVEAL}>
              <span className={sv.num}>{pad(i + 1)}</span>
              <div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <PageLink className={h.link} link={card.link} arrow />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** e-Dönüşüm: solda ne yaptığımız ve iletişim, sağda sekiz e-belge; satır satır bir belge listesi. */
export function EDonusum() {
  return (
    <section className={cx(h.sec, h.ground)} id="edonusum">
      <div className={cx(h.wrap, sv.edo)}>
        <div className={sv.edoCopy}>
          <SectionHead
            eyebrow="e-Dönüşüm"
            title="e-Belgelerinizi de"
            accent="biz kuruyoruz"
            lede="GİB başvurusunu, entegratör bağlantısını ve Mikro'daki e-belge ayarlarını biz yapıyoruz. Belgeler programın içinden, kontörle kesilir."
          />
          <ul className={sv.ticks} {...REVEAL}>{EDONUSUM_CONSULTING.map((t) => <li key={t}>{t}</li>)}</ul>
          <a className={h.btn} href="#iletisim" data-konu="bilgi" data-mesaj="Hangi e-belgelerin bizim için zorunlu olduğunu öğrenmek istiyoruz." {...REVEAL}>
            Hangi e-belgeler size zorunlu? <ArrowIcon />
          </a>
        </div>
        <dl className={sv.docs} {...REVEAL}>
          {EDONUSUM_DOCS.map((doc) => (
            <div key={doc}><dt>{doc}</dt><dd>{EDONUSUM_NOTES[doc]}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
