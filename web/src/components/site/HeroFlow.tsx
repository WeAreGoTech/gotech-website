"use client";

import { useEffect, useRef } from "react";
import "./hero-flow.css";
import { createHeroFlow } from "./hero-flow-controller";
import { InvoiceCard, OrderCard, ReportCard, StockCard } from "./HeroFlowCards";
import { requestFrame, subscribeFrame } from "./scroll-frame";

const STEPS = [
  { title: "Sipariş düşer", text: "Web sitenizden, telefondan ya da mağazadan gelen sipariş aynı panele kaydolur.", card: <OrderCard />, short: "Sipariş" },
  { title: "Stok güncellenir", text: "Satılan ürün depodan düşer. Azalan ürün için tedarik taslağı kendiliğinden hazırlanır.", card: <StockCard />, short: "Stok" },
  { title: "Fatura kesilir", text: "e-Fatura hazırlanır ve müşterinize gönderilir. Kimse elle yazmaz.", card: <InvoiceCard />, short: "Fatura" },
  { title: "Rapor hazır", text: "Günün satışı, kârı ve kritik stoğu siz sormadan önünüzde.", card: <ReportCard />, short: "Rapor" },
];

export function HeroFlow() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const flow = createHeroFlow(rootRef.current!);
    const relayout = () => {
      flow.layout();
      requestFrame();
    };
    relayout();
    flow.enter();
    const unsubscribe = subscribeFrame(flow.update);
    window.addEventListener("resize", relayout);
    document.fonts?.ready.then(relayout);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", relayout);
      flow.destroy();
    };
  }, []);

  return (
    <section ref={rootRef} className="hero-flow" data-nav-tone="dark" aria-label="GoTech ile iş akışınız">
      <div className="pin b-pin">
        <div className="sticky b-stage">
          <div className="b-dots" aria-hidden="true" />
          <div className="b-stepper" aria-hidden="true">
            <ol>{STEPS.map((s, i) => <li key={s.short}><b>{i + 1}</b>{s.short}</li>)}</ol>
            <div className="b-stepper-track"><i /></div>
          </div>

          <div className="b-track">
            <svg className="b-line" aria-hidden="true">
              <defs><clipPath id="b-clip"><rect className="b-clip-rect" x="0" y="0" width="0" height="0" /></clipPath></defs>
              <path className="b-path-base" />
              <path className="b-path-lit" clipPath="url(#b-clip)" />
            </svg>

            <div className="b-panel b-intro">
              <h1 className="b-title">
                <span className="ln"><span>Siparişten</span></span>
                <span className="ln"><span>faturaya, işiniz</span></span>
                <span className="ln"><span>kendiliğinden akar.</span></span>
              </h1>
              <div className="b-intro-foot">
                <p className="lede">Web sitenizden gelen sipariş stoğa, stoktan faturaya, faturadan rapora kendiliğinden geçer. Bu akışı işletmenize göre kuruyoruz.</p>
                <div className="cta-row"><a className="btn btn-signal" href="#iletisim">Projenizi anlatın</a><a className="btn btn-ghost" href="#surec">Nasıl çalışır</a></div>
              </div>
            </div>

            {STEPS.map((step, i) => (
              <div key={step.short} className={`b-panel b-step${i % 2 ? " is-down" : ""}`}>
                <div className="b-cell b-cell-card">{step.card}</div>
                <div className="b-cell b-cell-text"><span className="b-num">{i + 1}</span><h2>{step.title}</h2><p>{step.text}</p></div>
              </div>
            ))}

            <div className="b-panel b-end">
              <div className="b-end-inner">
                <h2>Bu akışı sizin işinize göre kuralım.</h2>
                <p className="lede">İşletmenizi dinliyor, gereken modülleri seçiyor, web siteniz ve panelinizle birlikte kuruyoruz.</p>
                <div className="cta-row"><a className="btn btn-signal" href="#iletisim">Görüşme planlayın</a><a className="btn btn-ghost" href="#isler">Yaptığımız işler</a></div>
              </div>
            </div>

            {[...STEPS, "end"].map((_, i) => <i key={i} className="b-node" aria-hidden="true" />)}
            <div className="b-packet" aria-hidden="true"><div className="b-packet-chip"><i className="b-packet-dot" /><span className="b-packet-label">Yeni sipariş #1042</span></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
