"use client";

import { useRef, useState } from "react";
// Ortak kaydırma altyapısı: tek rAF döngüsü + Lenis (v2 landing'i de bunu kullanıyor).
import { clamp, pinProgress } from "@/components/site/motion";
import { useScrollFrame } from "@/components/site/scroll-frame";
import { ErpPanel } from "./ErpPanel";

const STAGES = [
  {
    n: "01",
    node: "Sipariş",
    title: "Sipariş düşer",
    lead: "Müşteri arar, bayi girer ya da e-ticaretten gelir. Hepsi aynı ekrana düşer; kimse Excel'e ikinci kez yazmaz.",
  },
  {
    n: "02",
    node: "Stok",
    title: "Stok kendiliğinden düşer",
    lead: "Sipariş onaylandığı anda depodan iner. Kritik seviyeye inen ürün aynı ekranda uyarır.",
  },
  {
    n: "03",
    node: "e-Fatura",
    title: "Fatura GİB'e gider",
    lead: "e-Fatura, e-Arşiv ya da e-İrsaliye. Başvurudan entegratör bağlantısına kadar kurulumu biz yapıyoruz.",
  },
  {
    n: "04",
    node: "Rapor",
    title: "Akşam rapora işler",
    lead: "Günün cirosu, kârlılığı ve tahsilatı aynı gün görünür. Ay sonunu beklemeye gerek kalmaz.",
  },
];

export function FlowSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const packetRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [passed, setPassed] = useState(0);

  useScrollFrame(() => {
    const pin = pinRef.current;
    if (!pin) return;
    const progress = pinProgress(pin);
    // çizgi ve paket her karede doğrudan DOM'a yazılıyor: React state'i 60fps'te döndürmüyoruz
    if (fillRef.current) fillRef.current.style.width = `${progress * 100}%`;
    if (packetRef.current) packetRef.current.style.left = `${progress * 100}%`;
    setActive(clamp(Math.floor(progress * STAGES.length), 0, STAGES.length - 1));
    setPassed(Math.floor(progress * STAGES.length + 0.001));
  });

  return (
    <section className="flow on-deep" id="akis">
      <div className="flow-pin" ref={pinRef}>
        <div className="flow-sticky">
          <div className="wrap">
            <header className="flow-head">
              <span className="tag">Akış</span>
              <h2 className="d2">Bir sipariş girilir, dört durakta işi biter.</h2>
            </header>

            <div className="flow-rail" aria-hidden="true">
              <i className="flow-line" />
              <i className="flow-fill" ref={fillRef} />
              <ol className="flow-nodes">
                {STAGES.map((stage, index) => (
                  <li key={stage.node} className={`${index <= passed ? "done" : ""} ${index === active ? "on" : ""}`.trim()}>
                    {stage.node}
                  </li>
                ))}
              </ol>
              <i className="flow-packet" ref={packetRef} />
            </div>

            <div className="flow-body">
              <div className="flow-stages">
                {STAGES.map((stage, index) => (
                  <article className={index === active ? "flow-stage on" : "flow-stage"} key={stage.n}>
                    <p className="flow-n">{stage.n}</p>
                    <h3 className="d3">{stage.title}</h3>
                    <p className="lede">{stage.lead}</p>
                  </article>
                ))}
              </div>
              <ErpPanel active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
