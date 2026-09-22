import type { Metadata } from "next";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { Closing, ProductRows } from "@/components/kurumsal/Sections";
import { PRODUCTS } from "@/components/kurumsal/urunler-data";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Ürünlerimiz",
  description: "Mikro Run, Mikro Jump, Mikro Fly ve Mikro Müşavir: işletmenizin ölçeğine uygun Mikro Yazılım ERP çözümleri.",
};

export default async function UrunlerPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Ürünler"
        title="İşletmenizin ölçeğine uygun"
        accent="Mikro ERP"
        titleAfter=" çözümü."
        lead="Dört üründen hangisinin size uyduğunu ücretsiz danışmanlıkta birlikte belirliyoruz."
      />

      <ProductRows />

      <section className="sec" style={{ background: "var(--ground)" }}>
        <div className="wrap">
          <span className="tag">Detaylar</span>
          <h2 className="d2" style={{ marginTop: 14, maxWidth: "16ch" }}>
            Her üründe neler var?
          </h2>

          <div className="prods">
            {PRODUCTS.map((product) => (
              <article className="prod" key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p className="tag">{product.scale}</p>
                  <p>{product.description}</p>
                </div>
                <ul>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Closing settings={settings} content={content} />
    </main>
  );
}
