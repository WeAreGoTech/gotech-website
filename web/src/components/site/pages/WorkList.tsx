"use client";

import { useState } from "react";
import { KIND_LABEL, WORKS, type WorkKind } from "@/components/yazilim/content";
import { cx } from "../ui/parts";
import p from "../ui/page.module.css";
import w from "./software.module.css";

type Filter = "hepsi" | WorkKind;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "hepsi", label: "Hepsi" },
  { id: "mikro", label: KIND_LABEL.mikro },
  { id: "bagimsiz", label: KIND_LABEL.bagimsiz },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Geliştirdiğimiz yazılım türleri: üstte süzgeç (Hepsi / Mikro'ya entegre / Web ve portal), altta büyük puntolu satırlar. */
export function WorkList() {
  const [filter, setFilter] = useState<Filter>("hepsi");
  const shown = WORKS.filter((x) => filter === "hepsi" || x.kind === filter);

  return (
    <div className={w.works}>
      <div className={w.filters} role="group" aria-label="Yazılım türü" data-reveal="">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
            <span>{f.id === "hepsi" ? WORKS.length : WORKS.filter((x) => x.kind === f.id).length}</span>
          </button>
        ))}
      </div>
      <ul className={p.index} key={filter} aria-live="polite">
        {shown.map((item, i) => (
          <li key={item.title} className={w.work} style={{ animationDelay: `${i * 60}ms` }}>
            <div className={cx(p.indexRow, w.workRow)}>
              <span className={p.indexNum}>{pad(i + 1)}</span>
              <span className={p.indexTitle}>{item.title}</span>
              <span className={p.indexText}>
                <small>{KIND_LABEL[item.kind]}</small>
                {item.body}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
