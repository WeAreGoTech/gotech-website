// /urunler/[slug]: Mikro Jump ve Mikro Fly sayfalarının bölümleri. Ürün bilgisi kurumsal/urun-detay.ts (Mikro'nun ürün sayfalarından).

import { COMPARE_GROUPS, compareColumn, findCompareProduct, type CompareValue } from "@/components/kurumsal/karsilastirma";
import { ProductLogo } from "@/components/kurumsal/ProductLogo";
import type { ProductDetail } from "@/components/kurumsal/urun-detay";
import { cx, Head, typo } from "../ui/parts";
import p from "../ui/page.module.css";
import { CompareTable } from "./Compare";
import d from "./detail.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Genel bakış: solda başlık, sağda anlatım. */
export function Overview({ product }: { product: ProductDetail }) {
  return (
    <section className="sec sec-line" id="genel-bakis">
      <div className="wrap split split-top">
        <Head label="Genel bakış" title={product.intro.title} />
        <p className="lede split-side" data-reveal="">{product.intro.body}</p>
      </div>
    </section>
  );
}

/** Öne çıkan özellikler: iki sütun, numaralı, kutusuz. */
export function Features({ product }: { product: ProductDetail }) {
  return (
    <section className="sec sec-line" id="ozellikler">
      <div className="wrap">
        <div className="split">
          <Head label="Özellikler" title={`${product.name} ile neler yapılır?`} />
          <p className="lede split-side" data-reveal="">Başlıcalarını aşağıda sıraladık; demo görüşmesinde kendi işiniz üzerinden gösteriyoruz.</p>
        </div>
        <ol className={d.features}>
          {product.features.map((f, i) => (
            <li key={f.title} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <span className={d.num}>{pad(i + 1)}</span>
              <h3 className="h3">{typo(f.title)}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Jump'ın sürümleri (Basic, Jump, Bulut): üç açık sütun, çapaları menüdeki bağlantılar için. */
export function Versions({ product }: { product: ProductDetail }) {
  const versions = product.versions;
  if (!versions) return null;
  return (
    <section className="sec sec-line" id="surumler">
      <div className="wrap">
        <div className="split">
          <Head label="Sürümler" title={versions.title} />
          <p className="lede split-side" data-reveal="">{versions.lead}</p>
        </div>
        <div className={d.versions}>
          {versions.items.map((v) => (
            <article key={v.id} id={v.id} className={d.version} data-reveal="">
              <i className={d.versionRule} data-draw="" aria-hidden="true" />
              <h3 className={d.versionTitle}>{v.title}</h3>
              <p>{v.body}</p>
              <ul className="ticks">{v.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            </article>
          ))}
        </div>
        {versions.when && (
          <div className={d.when}>
            <h3 className="h3" data-reveal="">{versions.when.title}</h3>
            <ul className={p.rows}>
              {versions.when.items.map((item) => {
                const [need, answer] = item.split(": ");
                return (
                  <li key={item} className={p.row} data-reveal="">
                    <i className={p.rule} data-draw="" aria-hidden="true" />
                    <p className={d.need}>{need}</p>
                    <p className={d.answer}>{answer}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Value({ value }: { value: CompareValue }) {
  if (value === true) return <span className={d.yes}>Var</span>;
  if (value === false) return <span className={d.no}>Yok</span>;
  return <span>{value}</span>;
}

/** Fly: Jump'tan geçince değişenler (karşılaştırma tablosunun farklı satırları). */
export function DiffFrom({ product }: { product: ProductDetail }) {
  if (!product.diffFrom) return null;
  const from = findCompareProduct(product.diffFrom);
  const self = findCompareProduct(product.compareId);
  if (!from || !self) return null;
  const a = compareColumn(product.diffFrom);
  const b = compareColumn(product.compareId);
  const rows = COMPARE_GROUPS.flatMap((g) => g.rows).filter((row) => row.values[a] !== row.values[b]);

  return (
    <section className="sec sec-line" id="fark">
      <div className="wrap">
        <div className="split">
          <Head label={`${from.name} ile farkı`} title={`${from.name}'tan ${self.name}'a geçince değişenler`} />
          <p className="lede split-side" data-reveal="">
            {from.name}&apos;ta {from.users} sınırı var; {self.name}&apos;da kullanıcı sınırı yok. Özelliklerde farklı olan satırlar:
          </p>
        </div>
        <div className={d.diff} role="table" aria-label={`${from.name} ile ${self.name} farkı`}>
          <div className={d.diffHead} role="row">
            <span role="columnheader">Özellik</span>
            <span role="columnheader">{from.name}</span>
            <span role="columnheader">{self.name}</span>
          </div>
          {rows.map((row) => (
            <div key={row.label} className={d.diffRow} role="row" data-reveal="">
              <span role="rowheader">{row.label}</span>
              <span role="cell"><Value value={row.values[a]} /></span>
              <span role="cell" className={d.diffSelf}><Value value={row.values[b]} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Ana pakette gelenler, modül olarak eklenenler ve e-Dönüşüm: üç liste yan yana. */
export function Package({ product }: { product: ProductDetail }) {
  const lists = [
    { title: "Ana pakette", items: product.packageItems },
    { title: "Modül olarak eklenenler", items: product.moduleItems },
    { title: "e-Dönüşüm", items: product.edonusumItems },
  ];
  return (
    <section className="sec sec-line" id="paket">
      <div className="wrap">
        <div className="split">
          <Head label="Paket ve modüller" title="Ana pakette neler var, neler sonradan eklenir?" />
          <p className="lede split-side" data-reveal="">
            Ayrım Mikro&apos;nun ürün sayfasındaki gibidir. Modüller ayrıca alınır ya da kiralanır; e-belgeler programın içinden, kontörle kesilir.
          </p>
        </div>
        <div className={p.lists}>
          {lists.map((list) => (
            <div key={list.title} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <h3>{list.title}</h3>
              <ul className="ticks">{list.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Kimler için: başlık solda, açıklama sağda satırlar. */
export function ForWhom({ product }: { product: ProductDetail }) {
  return (
    <section className="sec sec-line" id="kimler-icin">
      <div className={cx("wrap", d.whom)}>
        <Head label="Kimler için" title={`${product.name} kimler için uygun?`} />
        <ul className={p.rows}>
          {product.forWhom.map((w) => (
            <li key={w.title} className={p.row} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <h3 className={p.rowTitle}>{w.title}</h3>
              <div className={p.rowBody}><p>{w.body}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Bir bakışta: artılar ve sınırlar, altında dört ürünün tam tablosu (kapalı). */
export function AtAGlance({ product }: { product: ProductDetail }) {
  const compare = findCompareProduct(product.compareId);
  if (!compare) return null;
  return (
    <section className="sec sec-line" id="karsilastirma">
      <div className="wrap">
        <div className="split">
          <Head label="Bir bakışta" title={`${compare.locative} neler var, neler yok?`} />
          <p className="lede split-side" data-reveal="">Ürünün size fazla ya da eksik geleceği yerleri baştan görün.</p>
        </div>
        <div className={d.pc}>
          <div data-reveal="">
            <h3 className={d.pcTitle}>Artıları</h3>
            <ul className="ticks">{compare.pros.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div data-reveal="">
            <h3 className={d.pcTitle}>Sınırları</h3>
            <ul className={d.cons}>{compare.cons.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <details className={d.more}>
          <summary>
            <span>Dört Mikro ürününün tam karşılaştırma tablosu</span>
            <i aria-hidden="true" />
          </summary>
          <CompareTable highlight={product.compareId} />
        </details>
      </div>
    </section>
  );
}

/** Birlikte kullanılan ek çözümler: açık sütunlar. */
export function Addons({ product }: { product: ProductDetail }) {
  return (
    <section className="sec sec-line" id="ek-cozumler">
      <div className="wrap">
        <div className="split">
          <Head label="Ek çözümler" title={`${product.name} ile birlikte kullanılanlar`} />
          <p className="lede split-side" data-reveal="">{product.name}&apos;la birlikte çalışan ek çözümler. Hangisinin işinize yarayacağını görüşmede konuşuyoruz.</p>
        </div>
        <ul className={p.cols}>
          {product.addons.map((a) => (
            <li key={a.title} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <h3 className="h3">{a.title}</h3>
              <p>{a.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Girişteki ürün logosu (kılavuz: en az 120px, beyaz zeminde). */
export function HeroLogo({ product }: { product: ProductDetail }) {
  return <ProductLogo id={product.compareId} name={product.name} />;
}
