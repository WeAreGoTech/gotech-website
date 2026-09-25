import Link from "next/link";
import type { ReactNode } from "react";

// brand: başlığın üstünde duran logo (ör. /urunler'de Mikro logosu; yalnız beyaz zeminde)
export function PageHeader({ eyebrow, title, accent, titleAfter, lead, brand }: {
  eyebrow: string;
  title: string;
  accent?: string;
  // noktalama ise boşluksuz, kelime ise başında boşlukla verilir
  titleAfter?: string;
  lead?: string;
  brand?: ReactNode;
}) {
  const heading = (
    <h1 className="d2">
      {accent ? `${title} ${accent}` : title}
      {titleAfter}
    </h1>
  );
  return (
    <section className="phead">
      <div className="wrap">
        <nav className="crumb" aria-label="Konum">
          <Link href="/">Ana sayfa</Link>
          <span aria-hidden="true">/</span>
          <span>{eyebrow}</span>
        </nav>
        {brand ? <div className="phead-brand">{brand}{heading}</div> : heading}
        {lead && <p className="lede">{lead}</p>}
      </div>
    </section>
  );
}
