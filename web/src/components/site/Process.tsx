"use client";

import { useEffect, useRef } from "react";
import "./showcase.css";
import { PROCESS_STEPS } from "./content";
import { clamp } from "./motion";
import { requestFrame, useScrollFrame } from "./scroll-frame";

const READING_LINE = 0.6;

export function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);

  // the rail runs from the first to the last number circle
  useEffect(() => {
    const layout = () => {
      const wrap = wrapRef.current;
      const rail = railRef.current;
      if (!wrap || !rail) return;
      const nums = wrap.querySelectorAll(".step-num");
      const top = wrap.getBoundingClientRect().top;
      const center = (el: Element) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 - top; };
      const first = center(nums[0]);
      rail.style.top = `${first}px`;
      rail.style.height = `${center(nums[nums.length - 1]) - first}px`;
      requestFrame();
    };
    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout);
    return () => window.removeEventListener("resize", layout);
  }, []);

  useScrollFrame(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!rail || !fill || !wrapRef.current) return;
    const line = window.innerHeight * READING_LINE;
    const r = rail.getBoundingClientRect();
    fill.style.transform = `scaleY(${clamp((line - r.top) / r.height)})`;
    wrapRef.current.querySelectorAll(".step").forEach((step) => {
      const n = step.querySelector(".step-num")!.getBoundingClientRect();
      step.classList.toggle("is-on", n.top + n.height / 2 < line);
    });
  });

  return (
    <section className="section process" id="surec" data-nav-tone="light">
      <div className="section-head">
        <h2 className="h2">İlk görüşmeden canlıya, altı adımda.</h2>
        <p className="lede">Baştan sona profesyonel ERP danışmanlığı. Neyin ne zaman yapılacağını baştan bilirsiniz.</p>
      </div>
      <div className="steps-wrap" ref={wrapRef}>
        <div className="steps-rail" ref={railRef} aria-hidden="true"><i ref={fillRef} /></div>
        <ol className="steps">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className="step">
              <span className="step-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p className="step-desc">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className="steps-after">Canlıya aldıktan sonra da buradayız. 7/24 teknik destek, güncelleme ve bakım için aynı ekiple çalışırsınız.</p>
    </section>
  );
}
