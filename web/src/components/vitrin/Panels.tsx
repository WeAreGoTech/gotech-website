"use client";

/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import { useState, type PointerEvent } from "react";
import { Arrow } from "@/components/site/ui/icons";
import { cx } from "@/components/site/ui/parts";
import { PANELS } from "./content";
import s from "./panels.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Hizmetler yan yana fotoğraf panelleri: fareyle üstüne gelinen ya da tıklanan/odaklanan panel genişler, sekmesinde tek cümle
 * ve kısa etiketler görünür. Telefonda paneller alt alta; dokunulan uzar. Kapalı panelin içeriği klavyede atlanır (inert).
 */
export function Panels() {
  const [active, setActive] = useState(0);
  const hover = (i: number) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") setActive(i);
  };

  return (
    <div className={s.panels}>
      {PANELS.map((p, i) => {
        const on = i === active;
        return (
          <article key={p.id} className={cx(s.panel, on && s.on)} onPointerEnter={hover(i)} onClick={() => setActive(i)} data-reveal="">
            <img src={p.image} alt={p.alt} loading="lazy" />
            <div className={s.tab}>
              <h3>
                <button className={s.head} type="button" aria-expanded={on} aria-controls={`hizmet-${p.id}`} onFocus={() => setActive(i)}>
                  <span className={s.num}>{pad(i + 1)}</span>
                  <span className={s.title}>{p.title.split(" ").map((w, j) => <span key={j} className={s.word}>{j > 0 && " "}{w}</span>)}</span>
                </button>
              </h3>
              <div className={s.more} id={`hizmet-${p.id}`} inert={!on}>
                <div className={s.moreIn}>
                  <p className={s.text}>{p.text}</p>
                  <p className={s.tags}>{p.tags.join(" · ")}</p>
                  <Link className="tlink" href={`/hizmetlerimiz#${p.id}`}>Ayrıntılar <Arrow /></Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
