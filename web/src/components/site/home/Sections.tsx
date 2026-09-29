// e-Dönüşüm bölümü (hizmetler sayfası kullanıyor). Ana sayfa bölümleri components/vitrin'de; destek: Support.tsx.

import { EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import { EDOC_NOTES, HOME_EDOCS } from "../content";
import { cx, Go, Head } from "../ui/parts";
import s from "./home.module.css";

/** e-Dönüşüm: solda ne yaptığımız (yapışkan), sağda büyük puntoyla e-belge dizini. */
export function EDocs() {
  return (
    <section className="sec sec-line" id="edonusum">
      <div className={cx("wrap", s.docs)}>
        <div className={s.docsSide}>
          <Head label={HOME_EDOCS.label} title={HOME_EDOCS.title} lede={HOME_EDOCS.body} />
          <Go link={HOME_EDOCS.link} reveal />
        </div>
        <ul className={s.docList}>
          {EDONUSUM_DOCS.map((doc) => (
            <li key={doc} data-reveal="">
              <i className={s.rule} data-draw="" aria-hidden="true" />
              <span className={s.docName}>{doc}</span>
              <span className={s.docNote}>{EDOC_NOTES[doc]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
