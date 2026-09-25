"use client";

import { useState } from "react";
import { Select, type SelectOption } from "@/components/forms/Select";
import { prefersReducedMotion } from "@/components/site/motion";
import {
  ACCESS_OPTIONS,
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

// finder.module.css'teki dikey raf eşiği ve kartın açılma süresinin yarısı
const NARROW = "(max-width: 900px)";
const OPEN_SETTLE_MS = 350;

type PickProps = { name: string; label: string; value: string; options: SelectOption[]; onChange: (v: string) => void };

/** Cümle içindeki seçim: sitenin kendi açılır listesi (işletim sisteminin menüsü değil), hap görünümünde. */
function Pick({ name, label, value, options, onChange }: PickProps) {
  return <Select className={f.pick} name={name} aria-label={label} value={value} options={options} onValueChange={onChange} />;
}

function Sentence({ answers, set }: { answers: FinderAnswers; set: (next: Partial<FinderAnswers>) => void }) {
  return (
    <form className={f.say} aria-label="İşletmenizi anlatın" onSubmit={(e) => e.preventDefault()} {...REVEAL}>
      {/* div: Select bir <div> çiziyor, <p> içinde olamaz */}
      <div className={f.sayLine}>
        Biz{" "}
        <span className={f.nowrap}>
          <Pick name="buyukluk" label="İşletme büyüklüğü" value={answers.size} options={SIZE_OPTIONS} onChange={(v) => set({ size: v as CompanySize })} />,
        </span>
        {" "}
        <span className={f.nowrap}>
          <Pick name="uretim" label="Üretim" value={answers.production ? "1" : "0"} options={PRODUCTION_OPTIONS} onChange={(v) => set({ production: v === "1" })} />,
        </span>
        {" "}<Pick name="sirket" label="Şirket sayısı" value={answers.multiCompany ? "n" : "1"} options={COMPANY_OPTIONS} onChange={(v) => set({ multiCompany: v === "n" })} />
        {" "}ve{" "}
        <span className={f.nowrap}>
          <Pick name="erisim" label="Programa erişim" value={answers.cloud ? "1" : "0"} options={ACCESS_OPTIONS} onChange={(v) => set({ cloud: v === "1" })} />.
        </span>
      </div>
    </form>
  );
}

/** Ürün bulucu: cümleyi değiştirdikçe uygun Mikro ürünü rafta öne çıkar; başka ürüne tıklayınca o açılır. */
export function ProductFinder() {
  const [answers, setAnswers] = useState<FinderAnswers>(DEFAULT_ANSWERS);
  // ziyaretçi cümleyi değiştirmeden "Size önerimiz" demeyelim: varsayılan cevaplar onun cevabı değil
  const [touched, setTouched] = useState(false);
  const rec = recommend(answers);
  const [openKey, setOpenKey] = useState<ShelfKey>(rec.key);

  const set = (next: Partial<FinderAnswers>) => {
    const merged = { ...answers, ...next };
    const key = recommend(merged).key;
    setAnswers(merged);
    setTouched(true);
    setOpenKey(key);
    // dar ekranda raf alt alta: önerilen kart ekran dışında açılırsa ziyaretçi değişikliği görmez
    if (window.matchMedia(NARROW).matches) {
      window.setTimeout(() => {
        document.getElementById(`urun-${key}`)?.closest("article")?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }, OPEN_SETTLE_MS);
    }
  };

  return (
    <>
      <Sentence answers={answers} set={set} />
      <div className={f.shelf} {...REVEAL}>
        {SHELF.map((item) => (
          <ShelfCard key={item.key} item={item} open={openKey === item.key} recommended={touched && rec.key === item.key} onOpen={() => setOpenKey(item.key)} />
        ))}
      </div>
      <p className={f.why} aria-live="polite" key={touched ? rec.why.join() : "ipucu"}>
        {touched
          ? <><b>Neden {shelfName(rec.key)}?</b> <span>{rec.why.join(" · ")}</span></>
          : <span>Cümleyi işletmenize göre değiştirin; size uygun ürün öne çıksın.</span>}
      </p>
    </>
  );
}
