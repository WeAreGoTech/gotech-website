import Link from "next/link";

export function PageHeader({ eyebrow, title, accent, titleAfter, lead }: {
  eyebrow: string;
  title: string;
  accent?: string;
  // noktalama ise boşluksuz, kelime ise başında boşlukla verilir
  titleAfter?: string;
  lead?: string;
}) {
  return (
    <section className="phead">
      <div className="wrap">
        <nav className="crumb" aria-label="Konum">
          <Link href="/">Ana sayfa</Link>
          <span aria-hidden="true">/</span>
          <span>{eyebrow}</span>
        </nav>
        <h1 className="d2">
          {accent ? `${title} ${accent}` : title}
          {titleAfter}
        </h1>
        {lead && <p className="lede">{lead}</p>}
      </div>
    </section>
  );
}
