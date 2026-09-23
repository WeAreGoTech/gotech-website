"use client";

import { useState } from "react";
import { Select, type SelectOption } from "@/components/forms/Select";
import {
  COMPANY_OPTIONS,
  DEFAULT_ANSWERS,
  PRODUCTION_OPTIONS,
  SHELF,
  SIZE_OPTIONS,
  recommend,
  shelfName,
  type CompanySize,
  type FinderAnswers,
  type ShelfKey,
} from "./finder";
import f from "./finder.module.css";
import { REVEAL } from "./parts";
import { ShelfCard } from "./ShelfCard";

type PickProps = { name: string; label: string; value: string; options: SelectOption[]; onChange: (v: string) => void };

/** Cümle içindeki seçim: sitenin kendi açılır listesi (işletim sisteminin menüsü değil), hap görünümünde. */
function Pick({ name, label, value, options, onChange }: PickProps) {
  return <Select className={f.pick} name={name} aria-label={label} value={value} options={options} onValueChange={onChange} />;
}

function Sentence({ answers, set }: { answers: FinderAnswers; set: (next: Partial<FinderAnswers>) => void }) {
  const musavir = answers.size === "musavir";
  return (
    <form className={f.say} aria-label="İşletmenizi anlatın" onSubmit={(e) => e.preventDefault()} {...REVEAL}>
      {/* div: Select bir <div> çiziyor, <p> içinde olamaz */}
      <div className={f.sayLine}>
        Biz{" "}
        <span className={f.nowrap}>
          <Pick name="buyukluk" label="İşletme türü ve büyüklüğü" value={answers.size} options={SIZE_OPTIONS} onChange={(v) => set({ size: v as CompanySize })} />
          {musavir ? "." : ","}
        </span>
        {!musavir && (
          <>
            {" "}<Pick name="uretim" label="Üretim" value={answers.production ? "1" : "0"} options={PRODUCTION_OPTIONS} onChange={(v) => set({ production: v === "1" })} />
            {" "}ve{" "}
            <span className={f.nowrap}>
              <Pick name="sirket" label="Şirket sayısı" value={answers.multiCompany ? "n" : "1"} options={COMPANY_OPTIONS} onChange={(v) => set({ multiCompany: v === "n" })} />.
            </span>
          </>
        )}
      </div>
    </form>
  );
}

/** Ürün bulucu: cümleyi değiştirdikçe uygun Mikro ürünü rafta öne çıkar; başka ürüne tıklayınca o açılır. */
export function ProductFinder() {
  const [answers, setAnswers] = useState<FinderAnswers>(DEFAULT_ANSWERS);
  const rec = recommend(answers);
  const [openKey, setOpenKey] = useState<ShelfKey>(rec.key);

  const set = (next: Partial<FinderAnswers>) => {
    const merged = { ...answers, ...next };
    setAnswers(merged);
    setOpenKey(recommend(merged).key);
  };

  return (
    <>
      <Sentence answers={answers} set={set} />
      <div className={f.shelf} {...REVEAL}>
        {SHELF.map((item) => (
          <ShelfCard key={item.key} item={item} open={openKey === item.key} recommended={rec.key === item.key} onOpen={() => setOpenKey(item.key)} />
        ))}
      </div>
      <p className={f.why} aria-live="polite" key={rec.why.join()}>
        <b>Neden {shelfName(rec.key)}?</b> <span>{rec.why.join(" · ")}</span>
      </p>
    </>
  );
}
