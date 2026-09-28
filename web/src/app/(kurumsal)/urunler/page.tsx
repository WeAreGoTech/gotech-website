/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/home/CompanySections";
import { Contact } from "@/components/home/ContactSection";
import { HOME_FAQ } from "@/components/home/home-content";
import { REVEAL } from "@/components/home/parts";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { CompareTable, ProsCons } from "@/components/kurumsal/ProductCompare";
import { ProductLogo } from "@/components/kurumsal/ProductLogo";
import { FAQ, PRODUCT_CARDS, PRODUCTS } from "@/components/kurumsal/urunler-data";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Mikro Jump, Jump Bulut ve Fly · Ürünler",
  description: "Mikro Jump Basic, Mikro Jump, Mikro Jump Bulut ve Mikro Fly: kimin için, hangisinde ne var, ne yok. İzmir'de kurulum, eğitim ve destek GoTech'ten.",
};

// Ürünlere özel sorular: hepsi sitedeki doğrulanmış cevaplardan (urunler-data FAQ ve ana sayfanın fiyat sorusu)
const PRODUCT_FAQ = [
  ...FAQ.filter((x) => ["Hangi ürün bize uygun?", "e-Fatura ve e-Defter programın içinde mi?", "Depomuzla ya da bayilerimizle entegre olur mu?"].includes(x.q)),
  ...HOME_FAQ.filter((x) => x.q === "Fiyat neye göre belirleniyor?"),
];

/**
 * Ürünler: girişte "hangisi bana uygun?" sorusuna cevap (başlık, iki buton, iş ortaklığı, fotoğraf), hemen altında dört ürün
 * kartı (kimin için, öne çıkan üç madde, ürün sayfası ve demo), sonra tam karşılaştırma, artılar/eksikler, SSS ve iletişim.
 */
export default async function UrunlerPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <section className="pl-hero">
        <div className="wrap pl-hero-in">
          <div className="pl-hero-copy">
            <nav className="crumb" aria-label="Konum">
              <Link href="/">Ana sayfa</Link>
              <span aria-hidden="true">/</span>
              <span>Ürünler</span>
            </nav>
            <span className="tag">Mikro ERP ürünleri</span>
            <h1>Jump mı, Fly mı? İşletmenize uygun Mikro&apos;yu seçin</h1>
            <p className="lede">
              Küçük işletmeden grup şirketine dört ürün. Aşağıda kimin için olduklarını ve hangisinde ne olduğunu görebilirsiniz;
              kesin seçimi ücretsiz keşif görüşmesinde birlikte yapıyoruz.
            </p>
            <div className="row-cta">
              <a className="btn" href="#iletisim" data-konu="demo">Ücretsiz demo isteyin <ArrowIcon /></a>
              <Link className="btn btn-line" href="/#urunler">Hangisi bana uygun?</Link>
            </div>
            <div className="pl-partner">
              <MikroLogo className="pl-mikro" />
              <span className="pl-badges">
                <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
                <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
              </span>
              <span className="pl-partner-text"><b>Mikro Yazılım yetkili iş ortağı</b>2017&apos;den beri · Jumper ve Flyer programlarında Silver</span>
            </div>
          </div>
          <figure className="pl-hero-photo">
            <img src="/images/mikro-gorsel/depo-ofis.webp" alt="Depo ofisinde dizüstü bilgisayara birlikte bakan iki çalışan" width={1080} height={720} fetchPriority="high" />
          </figure>
        </div>
      </section>

      <section className="sec pl-products" id="urun-listesi">
        <div className="wrap">
          <ul className="pl-grid">
            {PRODUCTS.map((product) => {
              const card = PRODUCT_CARDS[product.id];
              return (
                <li key={product.id} className="pl-card" {...REVEAL}>
                  <span className="pl-audience">{card.audience}</span>
                  <h2><ProductLogo id={product.id} name={product.name} /></h2>
                  <p className="pl-scale">{product.scale}</p>
                  <ul className="pl-points">{card.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <div className="pl-actions">
                    <Link className="btn btn-sm" href={product.page}>İnceleyin <ArrowIcon /></Link>
                    <a className="pl-demo" href="#iletisim" data-konu="demo" data-mesaj={`${product.name} için demo istiyorum.`}>Demo isteyin</a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="sec pd-ground" id="karsilastirma">
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

      <Faq items={PRODUCT_FAQ} title="Ürünler hakkında sık sorulanlar" id="sss" />

      <Contact settings={settings} content={content} />
    </main>
  );
}
