/* eslint-disable @next/next/no-img-element -- Mikro'nun resmi logoları public/images/mikro'dan olduğu gibi */
"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Select, type SelectOption } from "@/components/forms/Select";
import {
  ACCESS_OPTIONS,
  COMPANY_OPTIONS,
  DEFAULT_ANSWERS,
  featuresOf,
  PRODUCTION_OPTIONS,
  productOf,
  recommend,
  SHELF,
  shelfName,
  SIZE_OPTIONS,
  type CompanySize,
  type FinderAnswers,
  type ShelfItem,
  type ShelfKey,
} from "@/components/home/finder";
import { prefersReducedMotion } from "@/components/site/motion";
import { Arrow, Check, Minus } from "../ui/icons";
import { cx } from "../ui/parts";
import p from "./picker.module.css";

// picker.module.css'teki dikey raf eşiği ve kartın açılma süresinin yarısı
const NARROW = "(max-width: 960px)";
const OPEN_SETTLE_MS = 350;

type PickProps = { name: string; label: string; value: string; options: SelectOption[]; onChange: (v: string) => void };

/** Cümle içindeki seçim: sitenin kendi açılır listesi (işletim sisteminin menüsü değil). */
function Pick({ name, label, value, options, onChange }: PickProps) {
  return <Select className={p.pick} name={name} aria-label={label} value={value} options={options} onValueChange={onChange} />;
}

function Sentence({ answers, set }: { answers: FinderAnswers; set: (next: Partial<FinderAnswers>) => void }) {
  return (
    <form className={p.say} aria-label="İşletmenizi anlatın" onSubmit={(e) => e.preventDefault()} data-reveal="">
      {/* div: Select bir <div> çiziyor, <p> içinde olamaz */}
      <div className={p.sayLine}>
        Biz{" "}
        <span className={p.nowrap}>
          <Pick name="buyukluk" label="İşletme büyüklüğü" value={answers.size} options={SIZE_OPTIONS} onChange={(v) => set({ size: v as CompanySize })} />,
        </span>{" "}
        <span className={p.nowrap}>
          <Pick name="uretim" label="Üretim" value={answers.production ? "1" : "0"} options={PRODUCTION_OPTIONS} onChange={(v) => set({ production: v === "1" })} />,
        </span>{" "}
        <Pick name="sirket" label="Şirket sayısı" value={answers.multiCompany ? "n" : "1"} options={COMPANY_OPTIONS} onChange={(v) => set({ multiCompany: v === "n" })} />{" "}
        ve{" "}
        <span className={p.nowrap}>
          <Pick name="erisim" label="Programa erişim" value={answers.cloud ? "1" : "0"} options={ACCESS_OPTIONS} onChange={(v) => set({ cloud: v === "1" })} />.
        </span>
      </div>
    </form>
  );
}

type CardProps = { item: ShelfItem; open: boolean; recommended: boolean; onOpen: () => void };

/** Raftaki ürün: kapalıyken logo, ölçek ve kime uygun; açıkken açıklama, kapsam ve bağlantılar. */
function ShelfCard({ item, open, recommended, onOpen }: CardProps) {
  const product = productOf(item);
  const bodyId = `urun-${item.key}`;
  const logoStyle = { "--k": item.logo.wordmarkRatio } as CSSProperties;

  return (
    <article className={cx(p.card, open && p.open, recommended && p.isRec)}>
      <button className={p.head} type="button" aria-expanded={open} aria-controls={bodyId} onClick={onOpen}>
        <span className={p.rec}>Size uygun olan</span>
        <span className={p.brand}>
          <img className={p.logo} src={item.logo.src} alt={item.edition ? "Mikro Jump" : product.name} width={254} height={item.logo.height} style={logoStyle} />
          {item.edition && <span className={p.edition}>{item.edition}</span>}
        </span>
        <span className={p.meta}>
          <b>{product.scale.replace("-", "–")}</b>
          {item.forWho}
        </span>
        <span className={p.toggle} aria-hidden="true" />
      </button>
      {/* kapalı kartın gövdesi görünmez: inert ile odak ve ekran okuyucu dışında kalır */}
      <div className={p.body} id={bodyId} role="region" aria-label={product.name} inert={!open}>
        <div className={p.inner}>
          <p className={p.blurb}>{product.blurb}</p>
          <ul className={p.features}>
            {featuresOf(item).map((x) => (
              <li key={x.label} className={x.included ? p.yes : p.no}>
                {x.included ? <Check size={14} /> : <Minus size={14} />}
                <span>{x.label}</span>
              </li>
            ))}
          </ul>
          <div className={p.links}>
            <a className="btn btn-sm" href="#iletisim" data-konu="demo" data-mesaj={`${product.name} için demo istiyoruz.`}>
              Demo isteyin <Arrow />
            </a>
            <Link className="tlink" href={product.page}>{product.name} <Arrow /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Ürün bulucu: cümleyi değiştirdikçe uygun Mikro ürünü rafta öne çıkar; başka ürüne tıklayınca o açılır. */
export function Picker() {
  const [answers, setAnswers] = useState<FinderAnswers>(DEFAULT_ANSWERS);
  // ziyaretçi cümleyi değiştirmeden "size uygun olan" demeyelim: varsayılan cevaplar onun cevabı değil
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
    <div className={p.picker}>
      <Sentence answers={answers} set={set} />
      <div className={p.shelf} data-reveal="">
        {SHELF.map((item) => (
          <ShelfCard key={item.key} item={item} open={openKey === item.key} recommended={touched && rec.key === item.key} onOpen={() => setOpenKey(item.key)} />
        ))}
      </div>
      <p className={p.why} aria-live="polite" key={touched ? rec.why.join() : "ipucu"}>
        {touched ? (
          <>
            <b>Neden {shelfName(rec.key)}?</b> <span>{rec.why.join(" · ")}</span>
          </>
        ) : (
          <span>Cümledeki seçimleri değiştirin; size uyan ürün öne çıksın.</span>
        )}
      </p>
    </div>
  );
}
