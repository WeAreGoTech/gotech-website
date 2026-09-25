import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/home/ContactSection";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { CompareTable, ProsCons } from "@/components/kurumsal/ProductCompare";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { ProductLogo } from "@/components/kurumsal/ProductLogo";
import { PRODUCTS } from "@/components/kurumsal/urunler-data";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Mikro Jump, Jump Bulut ve Fly · Ürünler",
  description: "Mikro Jump Basic, Mikro Jump, Mikro Jump Bulut ve Mikro Fly: hangisinde ne var, ne yok. İzmir'de kurulum, eğitim ve destek GoTech'ten.",
};

export default async function UrunlerPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Ürünler"
        brand={<MikroLogo />}
        title="Mikro ERP ürünleri"
        lead="Mikro Jump Basic, Mikro Jump, Mikro Jump Bulut ve Mikro Fly'ın özelliklerini aşağıda karşılaştırabilirsiniz. İşletmenize uygun ürünü ücretsiz keşif görüşmesinde birlikte belirliyoruz."
      />

      <section className="sec" id="karsilastirma">
        <div className="wrap">
          <span className="tag">Karşılaştırma</span>
          <h2 className="pd-h2">Hangi üründe ne var, ne yok?</h2>
          <p className="cmp-note">Mikro ürünlerini çalışan sayısına göre konumluyor; son kararı programı aynı anda kullanacak kişi sayısı verir. &quot;Modül&quot;: ana pakette yok, ek paket olarak satın alınır ya da kiralanır.</p>
          <CompareTable />
        </div>
      </section>

      <section className="sec pd-ground">
        <div className="wrap">
          <span className="tag">Artıları ve eksikleri</span>
          <h2 className="pd-h2">Her ürünün güçlü ve zayıf yanı</h2>
          <div className="prods">
            {PRODUCTS.map((product) => (
              <article className="pc-row" key={product.id}>
                <div>
                  <h3><ProductLogo id={product.id} name={product.name} /></h3>
                  <p className="tag">{product.scale}</p>
                  <p>{product.description}</p>
                  <Link className="btn btn-line btn-sm pd-more" href={product.page}>{product.name} sayfası</Link>
                </div>
                <ProsCons id={product.id} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <Contact settings={settings} content={content} />
    </main>
  );
}
