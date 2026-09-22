"use client";

import { useRef, useState } from "react";
import "./showcase.css";
import { ADDONS, EDONUSUM, PRODUCTS } from "./content";
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
          <h2 className="h2">İşletmenizin büyüklüğüne uygun Mikro çözümü.</h2>
          <p className="lede">Mikro Yazılım&apos;ın güçlü altyapısını GoTech&apos;in uzmanlığıyla birleştiriyoruz. Hangisinin size uyduğunu birlikte belirliyoruz.</p>
          <ul className="services-index">
            {PRODUCTS.map((p, i) => (
              <li key={p.id}><a href={`#${p.id}`} className={i === active ? "is-active" : undefined}>{p.title}</a></li>
            ))}
          </ul>
        </div>
        <div className="service-list" ref={listRef}>
          {PRODUCTS.map((p) => (
            <article key={p.id} className="service" id={p.id}>
              <div className="ph">{p.image}</div>
              {p.badge && <span className="service-badge">{p.badge}</span>}
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <dl className="service-meta">
                <dt>Neler var</dt>
                <dd><ul className="chips">{p.includes.map((item) => <li key={item}>{item}</li>)}</ul></dd>
                <dt>Kimler için</dt>
                <dd>{p.audience}</dd>
              </dl>
            </article>
          ))}
        </div>
      </div>

      <div className="band">
        <h3 className="band-h">e-Dönüşüm çözümleri</h3>
        <p className="band-p">Tüm e-belge süreçleriniz tek platformda. Mikro Jump ve Mikro Fly ürünlerine dahildir.</p>
        <ul className="chips">{EDONUSUM.map((e) => <li key={e}>{e}</li>)}</ul>
      </div>

      <div className="band">
        <h3 className="band-h">Ek çözümler</h3>
        <p className="band-p">İşletmenizi güçlendiren entegre çözümler.</p>
        <ul className="addon-grid">
          {ADDONS.map((a) => (
            <li key={a.title} className="addon">
              <h4>{a.title}</h4>
              <p>{a.text}</p>
              <ul className="chips">{a.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
