"use client";

import { useRef, useState } from "react";
import "./showcase.css";
import { SERVICES } from "./content";
import { useScrollFrame } from "./scroll-frame";

const READING_LINE = 0.45;

export function Services() {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useScrollFrame(() => {
    const items = listRef.current?.querySelectorAll(".service") ?? [];
    let current = 0;
    items.forEach((item, i) => {
      if (item.getBoundingClientRect().top < window.innerHeight * READING_LINE) current = i;
    });
    setActive(current);
  });

  return (
    <section className="section services" id="hizmetler" data-nav-tone="light">
      <div className="services-grid">
        <div className="services-aside">
          <h2 className="h2">Üç iş yapıyoruz, üçü de birbirine bağlı.</h2>
          <p className="lede">İsterseniz birini, isterseniz üçünü birlikte kuruyoruz. Hepsi aynı ekipten çıktığı için birbirleriyle konuşur.</p>
          <ul className="services-index">
            {SERVICES.map((s, i) => (
              <li key={s.id}><a href={`#${s.id}`} className={i === active ? "is-active" : undefined}>{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div className="service-list" ref={listRef}>
          {SERVICES.map((s) => (
            <article key={s.id} className="service" id={s.id}>
              <div className="ph">{s.image}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <dl className="service-meta">
                <dt>Neler dahil</dt>
                <dd><ul className="chips">{s.includes.map((item) => <li key={item}>{item}</li>)}</ul></dd>
                <dt>Kimler için</dt>
                <dd>{s.audience}</dd>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
