"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { COMPARE_GROUPS, COMPARE_PRODUCTS, type CompareId, type CompareValue } from "@/components/kurumsal/karsilastirma";
import { editionOf, ProductLogo } from "@/components/kurumsal/ProductLogo";
import { Check, Minus } from "../ui/icons";
import { cx } from "../ui/parts";
import c from "./compare.module.css";

function Cell({ value }: { value: CompareValue }) {
  if (value === true) return <span className={c.yes}><Check size={16} /><span className="sr">Var</span></span>;
  if (value === false) return <span className={c.no}><Minus size={16} /><span className="sr">Yok</span></span>;
  return <span className={c.text}>{value}</span>;
}

const shortName = (name: string) => name.replace(/^(Mikro|Jump) /, "");

/**
 * Dört ürünün özellik tablosu (kurumsal/karsilastirma.ts). highlight: ürün sayfasında o ürünün sütunu öne çıkar.
 * 760px altında tablo iki sütuna iner (özellik | seçili ürün) ve üstte ürün seçici çıkar.
 */
export function CompareTable({ highlight }: { highlight?: CompareId }) {
  const choices = COMPARE_PRODUCTS.filter((p) => p.id !== highlight);
  const [selected, setSelected] = useState<CompareId>(choices[highlight ? 0 : 1].id);
  const colClass = (id: CompareId) => cx(id === highlight && c.on, id === selected && c.sel);

  return (
    <div className={c.compare} style={{ "--cols": COMPARE_PRODUCTS.length } as CSSProperties}>
      <div className={c.pick} role="group" aria-label={highlight ? "Karşılaştırılacak ürün" : "Tabloda gösterilecek ürün"}>
        {choices.map((p) => (
          <button key={p.id} type="button" aria-pressed={p.id === selected} onClick={() => setSelected(p.id)}>
            {shortName(p.name)}
          </button>
        ))}
      </div>
      <table className={c.table}>
        <thead>
          <tr>
            <th scope="col" className={c.corner}>Özellik</th>
            {COMPARE_PRODUCTS.map((p) => (
              <th scope="col" key={p.id} className={colClass(p.id)}>
                {p.id === highlight && <em>Bu ürün</em>}
                <Link href={p.page} className={c.logo}><ProductLogo id={p.id} name={p.name} edition={false} /></Link>
                <span className={c.users}>{editionOf(p.id) && `${editionOf(p.id)} · `}{p.users}</span>
              </th>
            ))}
          </tr>
        </thead>
        {COMPARE_GROUPS.map((group) => (
          <tbody key={group.title}>
            <tr className={c.group}>
              <th scope="colgroup" colSpan={COMPARE_PRODUCTS.length + 1}>{group.title}</th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, i) => (
                  <td key={COMPARE_PRODUCTS[i].id} className={colClass(COMPARE_PRODUCTS[i].id)}><Cell value={value} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
