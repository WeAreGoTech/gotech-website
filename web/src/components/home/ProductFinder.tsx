"use client";

import Link from "next/link";
import { useState } from "react";
import { Select, type SelectOption } from "@/components/forms/Select";
import { ArrowIcon } from "@/components/kurumsal/Icons";
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
} from "./finder";
import f from "./finder.module.css";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx, REVEAL } from "./parts";
import { ShelfCard } from "./ShelfCard";

type PickProps = { name: string; label: string; value: string; options: SelectOption[]; onChange: (v: string) => void };

/** Cümle içindeki seçim: sitenin kendi açılır listesi (işletim sisteminin menüsü değil), hap görünümünde. */
function Pick({ name, label, value, options, onChange }: PickProps) {
  return <Select className={f.pick} name={name} aria-label={label} value={value} options={options} onValueChange={onChange} />;
}

function Sentence({ answers, set }: { answers: FinderAnswers; set: (next: Partial<FinderAnswers>) => void }) {
  return (
    <form className={f.say} aria-label="İşletmenizi anlatın" onSubmit={(e) => e.preventDefault()}>
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

/**
 * Mikro ürünleri: üstte "hangisi size uygun?" cümlesi, altında dört ürün kartı (Mikro iş ortaklarının sitelerindeki logolu
 * ürün kartları). Cümle değişince uygun ürünün kartı işaretlenir ve nedeni cümlenin altında yazar.
 */
export function ProductFinder() {
  const [answers, setAnswers] = useState<FinderAnswers>(DEFAULT_ANSWERS);
  // ziyaretçi cümleyi değiştirmeden "Size önerimiz" demeyelim: varsayılan cevaplar onun cevabı değil
  const [touched, setTouched] = useState(false);
  const rec = recommend(answers);

  const set = (next: Partial<FinderAnswers>) => {
    setAnswers({ ...answers, ...next });
    setTouched(true);
  };

  return (
    <>
      <div className={f.finder} {...REVEAL}>
        <span className={h.iconBox}><Icon name="compass" size={24} /></span>
        <div className={f.finderBody}>
          <p className={f.finderTitle}><b>Hangisi size uygun?</b> Cümleyi işletmenize göre değiştirin, uygun ürün aşağıda işaretlensin.</p>
          <Sentence answers={answers} set={set} />
          <p className={f.why} aria-live="polite" key={touched ? rec.why.join() : "ipucu"}>
            {touched
              ? <><b>Önerimiz: {shelfName(rec.key)}.</b> <span>{rec.why.join(" · ")}</span></>
              : <span>Kesin seçimi ücretsiz keşif görüşmesinde birlikte yapıyoruz.</span>}
          </p>
        </div>
      </div>
      <div className={f.grid}>
        {SHELF.map((item) => (
          <ShelfCard key={item.key} item={item} recommended={touched && rec.key === item.key} />
        ))}
      </div>
      <div className={f.after}>
        <Link className={cx(h.btn, h.ghost)} href="/urunler">Tüm özellikleri karşılaştırın <ArrowIcon /></Link>
      </div>
    </>
  );
}
