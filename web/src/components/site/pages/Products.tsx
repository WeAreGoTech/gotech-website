/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
// /urunler: iki ürün ailesi, karşılaştırma tablosu, artılar ve sınırlar.

import Link from "next/link";
import { COMPARE_PRODUCTS } from "@/components/kurumsal/karsilastirma";
import { ProductLogo } from "@/components/kurumsal/ProductLogo";
import { FAQ as PRODUCT_DATA_FAQ, PRODUCTS } from "@/components/kurumsal/urunler-data";
import { findProductDetail } from "@/components/kurumsal/urun-detay";
import { HOME_FAQ, PRODUCT_LINES, PRODUCTS_FAQ_QUESTIONS } from "../content";
import type { FaqItem } from "../ui/Faq";
import { Arrow } from "../ui/icons";
import { cx, Head } from "../ui/parts";
import p from "../ui/page.module.css";
import { CompareTable } from "./Compare";
import x from "./products.module.css";

/** İki ürün ailesi yan yana, aralarında ince çizgi: fotoğraf, resmi logo, kime göre, sürümler ya da öne çıkanlar. */
export function ProductLines() {
  return (
    <section className="sec sec-line" id="aileler" aria-label="Ürün aileleri">
      <div className={cx("wrap", x.lines)}>
        {PRODUCT_LINES.map((line) => (
          <article key={line.id} className={x.line}>
            <figure className={cx("media", x.linePhoto)} data-media="">
              <img src={line.image.src} alt={line.image.alt} width={line.image.width} height={line.image.height} loading="lazy" />
            </figure>
            <h2 className={x.lineLogo} data-reveal=""><ProductLogo id={line.id} name={line.name} /></h2>
            <p className={x.lineFor} data-reveal="">{line.audience}</p>
            <p className={x.lineBody} data-reveal="">{line.body}</p>
            {line.versions && (
              <ul className={x.versions} data-reveal="">
                {line.versions.map((v) => (
                  <li key={v.href}>
                    <Link href={v.href}>
                      <b>{v.name}</b>
                      <span>{v.note}</span>
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {line.points && (
              <ul className={cx("ticks", x.points)} data-reveal="">
                {line.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            )}
            <div className="actions" data-reveal="">
              <Link className="btn btn-line btn-sm" href={line.page}>{line.name} sayfası <Arrow /></Link>
              <a className="tlink" href="#iletisim" data-konu="demo" data-mesaj={`${line.name} için demo istiyoruz.`}>Demo isteyin</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Tam karşılaştırma tablosu. */
export function CompareSection() {
  return (
    <section className="sec sec-line" id="karsilastirma">
      <div className="wrap">
        <div className="split">
          <Head label="Karşılaştırma" title="Hangi üründe ne var, ne yok?" />
          <p className="lede split-side" data-reveal="">
            Mikro ürünlerini çalışan sayısına göre konumluyor; son kararı programı aynı anda kullanacak kişi sayısı verir.
            &quot;Modül&quot;, ana pakette olmayan ve ayrıca alınan ya da kiralanan paket demek.
          </p>
        </div>
        <CompareTable />
      </div>
    </section>
  );
}

/** Her ürünün artıları ve sınırları: solda ürün, ortada artılar, sağda sınırlar. */
export function ProsCons() {
  return (
    <section className="sec sec-line" id="artilar">
      <div className="wrap">
        <div className="split">
          <Head label="Artıları ve sınırları" title="Her ürünün güçlü yanı ve sınırı" />
          <p className="lede split-side" data-reveal="">
            Hangi ürünün size fazla, hangisinin eksik geleceğini görebilmeniz için artılarını ve sınırlarını yan yana yazdık.
          </p>
        </div>
        <ul className={x.pc}>
          {PRODUCTS.map((product) => {
            const compare = COMPARE_PRODUCTS.find((c) => c.id === product.id);
            if (!compare) return null;
            return (
              <li key={product.id} className={x.pcRow}>
                <i className={p.rule} data-draw="" aria-hidden="true" />
                <div className={x.pcHead} data-reveal="">
                  <h3 className={x.pcLogo}><ProductLogo id={product.id} name={product.name} /></h3>
                  <p className={x.pcScale}>
                    {product.scale.replace("-", "–")}
                    {!product.scale.includes("kullanıcı") && ` · ${compare.users}`}
                  </p>
                  <p className={x.pcText}>{product.description}</p>
                  <Link className="tlink" href={product.page}>İnceleyin <Arrow /></Link>
                </div>
                <div data-reveal="">
                  <h4 className={x.pcTitle}>Artıları</h4>
                  <ul className="ticks">{compare.pros.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                </div>
                <div data-reveal="">
                  <h4 className={x.pcTitle}>Sınırları</h4>
                  <ul className={x.cons}>{compare.cons.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Ürünler sayfasının SSS'si: sitedeki doğrulanmış cevaplardan. */
export function productsFaq(): FaqItem[] {
  const jumpFaq = findProductDetail("mikro-jump")?.faq ?? [];
  const pool: FaqItem[] = [...HOME_FAQ, ...PRODUCT_DATA_FAQ, ...jumpFaq];
  return PRODUCTS_FAQ_QUESTIONS.map((q) => pool.find((item) => item.q === q)).filter((item): item is FaqItem => Boolean(item));
}
