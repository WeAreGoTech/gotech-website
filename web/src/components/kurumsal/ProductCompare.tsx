"use client";

import Link from "next/link";
import { useState } from "react";
import { editionOf, ProductLogo } from "./ProductLogo";
import { COMPARE_GROUPS, COMPARE_PRODUCTS, findCompareProduct, type CompareId, type CompareValue } from "./karsilastirma";

function Cell({ value }: { value: CompareValue }) {
  if (value === true) return <span className="cmp-yes" role="img" aria-label="Var" />;
  if (value === false) return <span className="cmp-no" role="img" aria-label="Yok" />;
  return <span className="cmp-text">{value}</span>;
}

/**
 * Dört ürünün özellik tablosu; highlight verilirse o ürünün sütunu öne çıkar. 760px altında üstte ürün seçici çıkar
 * ve tablo iki sütuna iner (özellik | seçili ürün): dar ekranda yanlış ürünün sütunu görünmesin.
 */
export function CompareTable({ highlight }: { highlight?: CompareId }) {
  // ürün sayfasında dar ekran: "bu ürün" hep görünür, seçici yalnız karşılaştırılacak ikinci ürünü değiştirir
  const choices = COMPARE_PRODUCTS.filter((p) => p.id !== highlight);
  const [selected, setSelected] = useState<CompareId>(choices[highlight ? 0 : 1].id);
  const cls = (id: CompareId) => [id === highlight && "on", id === selected && "sel"].filter(Boolean).join(" ") || undefined;
  return (
    <>
      <div className="cmp-pick" role="group" aria-label={highlight ? "Karşılaştırılacak ürün" : "Tabloda gösterilecek ürün"}>
        {choices.map((p) => (
          <button key={p.id} type="button" aria-pressed={p.id === selected} onClick={() => setSelected(p.id)}>{p.name.replace(/^(Mikro|Jump) /, "")}</button>
        ))}
      </div>
      <div className="cmp-wrap" role="region" aria-label="Ürün karşılaştırması" tabIndex={0}>
        <table className="cmp">
          <thead>
            <tr>
              <th scope="col"><span className="cmp-corner">Özellik</span></th>
              {COMPARE_PRODUCTS.map((p) => (
                <th scope="col" key={p.id} className={cls(p.id)} data-col={p.id}>
                  {p.id === highlight && <em>Bu ürün</em>}
                  <Link href={p.page}><ProductLogo id={p.id} name={p.name} edition={false} /></Link>
                  <span>{editionOf(p.id) && `${editionOf(p.id)} · `}{p.users}</span>
                </th>
              ))}
            </tr>
          </thead>
          {COMPARE_GROUPS.map((group) => (
            <tbody key={group.title}>
              <tr className="cmp-group">
                <th scope="colgroup" colSpan={COMPARE_PRODUCTS.length + 1}>{group.title}</th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, i) => (
                    <td key={COMPARE_PRODUCTS[i].id} className={cls(COMPARE_PRODUCTS[i].id)} data-col={COMPARE_PRODUCTS[i].id}><Cell value={value} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
}

/** Bir ürünün artıları ve eksikleri, iki sütun. */
export function ProsCons({ id }: { id: CompareId }) {
  const product = findCompareProduct(id);
  if (!product) return null;
  return (
    <div className="pc">
      <div className="pc-col pc-pros">
        <h3>Artıları</h3>
        <ul>{product.pros.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="pc-col pc-cons">
        <h3>Eksikleri, sınırları</h3>
        <ul>{product.cons.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </div>
  );
}

/**
 * Ürün sayfasında: artılar/eksikler ve tüm ürünlerle karşılaştırma ("Özellikleri karşılaştırın" buraya iner).
 * Tam tablo kapalı gelir: sayfada aynı farklar zaten başka bölümlerde geçiyor; /urunler'de tablo açık.
 */
export function AtAGlance({ id }: { id: CompareId }) {
  const product = findCompareProduct(id);
  if (!product) return null;
  return (
    <section className="sec pd-ground" id="karsilastirma">
      <div className="wrap">
        <span className="tag">Bir bakışta</span>
        <h2 className="pd-h2">{product.locative} neler var, neler yok?</h2>
        <ProsCons id={id} />
        <details className="cmp-more">
          <summary>Dört Mikro ürününün tam karşılaştırma tablosu</summary>
          <p className="cmp-note">&quot;Modül&quot;: ana pakette yok, ek paket olarak satın alınır ya da kiralanır.</p>
          <CompareTable highlight={id} />
        </details>
      </div>
    </section>
  );
}
