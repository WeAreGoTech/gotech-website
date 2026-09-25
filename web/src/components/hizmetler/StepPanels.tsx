"use client";

/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import { useState } from "react";
import { JOURNEY_SCOPE } from "@/components/home/home-content";
import { cx } from "@/components/home/parts";
import { PROCESS_STEPS } from "@/components/kurumsal/urunler-data";
import { STEP_IMAGES } from "./content";
import s from "./hizmetler.module.css";

const IMG = { width: 960, height: 640 };
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Altı adım yan yana dar paneller; üstüne gelinen (ya da klavyeyle odaklanan, tıklanan) panel genişler, fotoğrafı ve ayrıntısı açılır.
 * Dar ekranda paneller alt alta, hepsi açık.
 */
export function StepPanels() {
  const [active, setActive] = useState(0);

  return (
    <ol className={s.panels}>
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.title} className={cx(s.panel, i === active && s.panelOn)} onMouseEnter={() => setActive(i)}>
          <button type="button" className={s.panelHit} aria-expanded={i === active} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
            <span className={s.panelNum}>{pad(i + 1)}</span>
            <span className={s.panelTitle}>{step.title}</span>
          </button>
          <div className={s.panelBody}>
            <img src={STEP_IMAGES[i]} alt="" width={IMG.width} height={IMG.height} loading="lazy" />
            <p>{step.body}</p>
            <ul>{JOURNEY_SCOPE[i].map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
