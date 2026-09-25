/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { CSSProperties } from "react";
import { Faq } from "@/components/home/CompanySections";
import { COMPARE_GROUPS, compareColumn, findCompareProduct, type CompareId, type CompareValue } from "./karsilastirma";
import { setupSteps } from "./kurulum";
import { AtAGlance } from "./ProductCompare";
import type { ProductDetail } from "./urun-detay";

const pad = (n: number) => String(n).padStart(2, "0");

// ürün sayfasındaki demo butonları sayfa sonundaki forma iner; konu ve mesaj önceden dolar (HomeEffects)
const demoProps = (name: string) => ({ href: "#iletisim", "data-konu": "demo", "data-mesaj": `${name} için demo istiyorum.` });

/** Giriş: solda logo ve ne olduğu, sağda Mikro'nun görseli üstünde GoTech'in iş ortaklığı rozeti; altta özellik şeridi. */
function ProductHero({ product }: { product: ProductDetail }) {
  return (
    <section className="pd-hero">
      <div className="wrap">
        <div className="pd-hero-in">
          <div className="pd-hero-copy">
            <nav className="crumb" aria-label="Konum">
              <Link href="/">Ana sayfa</Link>
              <span aria-hidden="true">/</span>
              <Link href="/urunler">Ürünler</Link>
              <span aria-hidden="true">/</span>
              <span>{product.name}</span>
            </nav>
            {/* logo başlığın parçası: okunan başlık "Mikro Fly Üretimden holdinge ..." */}
            <h1 className="pd-title">
              <img src={product.logo.src} alt={product.name} width={254} height={product.logo.height} />
              <span>{product.headline}</span>
            </h1>
            <p className="lede">{product.lead}</p>
            <div className="row-cta">
              <a className="btn" {...demoProps(product.name)}>Ücretsiz demo isteyin</a>
              <a className="btn btn-line" href="#karsilastirma">Özellikleri karşılaştırın</a>
            </div>
          </div>
          <figure className="pd-hero-photo">
            <img src={product.photo.src} alt={product.photo.alt} width={1080} height={700} fetchPriority="high" />
            <figcaption className="pd-badge">
              <img src={product.badge.src} alt="" width={product.badge.width} height={product.badge.height} />
              <span><b>{product.badge.name}</b>GoTech, Mikro iş ortağı</span>
            </figcaption>
          </figure>
        </div>
        <ul className="pd-specs">
          {product.highlights.map((h) => <li key={h.value}><b>{h.value}</b><span>{h.label}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

function Overview({ product }: { product: ProductDetail }) {
  return (
    <section className="sec">
      <div className="wrap">
        <span className="tag">Genel bakış</span>
        <h2 className="pd-h2">{product.intro.title}</h2>
        <p className="lede pd-intro">{product.intro.body}</p>
        <ol className="pd-feats">
          {product.features.map((f, i) => (
            <li key={f.title}>
              <span className="pd-n">{pad(i + 1)}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ForWhom({ product }: { product: ProductDetail }) {
  return (
    <section className="sec pd-ground">
      <div className="wrap">
        <span className="tag">Kimler için</span>
        <h2 className="pd-h2">{product.audience}</h2>
        <ul className="pd-who">
          {product.forWhom.map((w) => <li key={w.title}><b>{w.title}</b><span>{w.body}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

/** Ana pakette gelenler, sonradan modül olarak eklenenler ve e-belgeler (Mikro'daki ayrımla), üç sütun. */
function PackageList({ product }: { product: ProductDetail }) {
  return (
    <section className="sec">
      <div className="wrap">
        <span className="tag">Paket</span>
        <h2 className="pd-h2">Ana pakette ne var, ne sonradan eklenir?</h2>
        <p className="lede pd-intro">Modülleri ihtiyaç oldukça satın alır ya da kiralarsınız; hangilerinin gerektiğini keşif görüşmesinde birlikte çıkarıyoruz. e-Belgeler programın içinden, kontörle kesilir.</p>
        <div className="pkg-cols">
          <div><h3>Ana pakette</h3><ul>{product.packageItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="muted"><h3>Modül olarak eklenir</h3><ul>{product.moduleItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>e-Dönüşüm</h3><ul>{product.edonusumItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}

/** GoTech ile kurulum: keşiften canlı kullanıma, GoTech'in yaptığı işin kendisi (kurulum.ts). */
function Setup({ product, workingHours, hasPhone }: { product: ProductDetail; workingHours: string; hasPhone: boolean }) {
  return (
    <section className="sec pd-ground" id="kurulum">
      <div className="wrap setup">
        <div className="setup-head">
          <span className="tag">GoTech ile kurulum</span>
          <h2>Kurulumdan desteğe kadar tek ekip</h2>
          <p className="lede">Lisans Mikro&apos;dan; kurulumu, eğitimi ve desteği biz yapıyoruz.</p>
          <a className="btn" {...demoProps(product.name)}>Keşif görüşmesi isteyin</a>
        </div>
        <ol className="setup-list">
          {setupSteps({ slug: product.slug, workingHours, hasPhone }).map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {step.note && <em>{step.note}</em>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Ürünün sürümleri yan yana (Jump: Basic, Jump, Bulut); kartlar #id ile doğrudan açılabilir. */
function Versions({ versions }: { versions: NonNullable<ProductDetail["versions"]> }) {
  return (
    <section className="sec" id="surumler">
      <div className="wrap">
        <span className="tag">Sürümler</span>
        <h2 className="pd-h2">{versions.title}</h2>
        <p className="lede pd-intro">{versions.lead}</p>
        <ol className="pd-steps" style={{ "--n": versions.items.length } as CSSProperties}>
          {versions.items.map((v) => (
            <li key={v.id} id={v.id}>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
              <ul className="pd-points">{v.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </li>
          ))}
        </ol>
        {versions.when && (
          <div className="prod pd-when">
            <div><h3 className="d3">{versions.when.title}</h3></div>
            <ul>{versions.when.items.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        )}
      </div>
    </section>
  );
}

const show = (value: CompareValue) => (value === true ? "Var" : value === false ? "Yok" : value);

/** Fly: bir alt üründen (Jump) geçince değişenler; karşılaştırma tablosunun yalnız farklı satırları. */
function Diff({ from, to }: { from: CompareId; to: CompareId }) {
  const [a, b] = [findCompareProduct(from), findCompareProduct(to)];
  if (!a || !b) return null;
  const [ia, ib] = [compareColumn(from), compareColumn(to)];
  const rows = [
    { label: "Eş zamanlı kullanıcı", was: a.users, now: b.users },
    ...COMPARE_GROUPS.flatMap((g) => g.rows)
      .filter((r) => r.values[ia] !== r.values[ib])
      .map((r) => ({ label: r.label, was: show(r.values[ia]), now: show(r.values[ib]) })),
  ];
  return (
    <section className="sec" id="fark">
      <div className="wrap">
        <span className="tag">{a.name} ile farkı</span>
        <h2 className="pd-h2">Jump yerine Fly seçince ne değişir?</h2>
        <p className="lede pd-intro">İkisi de Mikro&apos;nun ERP&apos;si. Burada yalnız farklı olanlar var; ortak özellikler aşağıdaki tabloda.</p>
        <div className="diff" role="table" aria-label={`${a.name} ile ${b.name} arasındaki farklar`}>
          <div className="diff-row diff-head" role="row">
            <span role="columnheader">Özellik</span><span role="columnheader">{a.name}</span><span role="columnheader">{b.name}</span>
          </div>
          {rows.map((r) => (
            <div className="diff-row" role="row" key={r.label}>
              <b role="rowheader">{r.label}</b><span className="was" role="cell">{r.was}</span><span className="now" role="cell">{r.now}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Addons({ product }: { product: ProductDetail }) {
  return (
    <section className="sec">
      <div className="wrap">
        <span className="tag">Birlikte kullanılabilir</span>
        <h2 className="pd-h2">Ek çözümler</h2>
        <ul className="pd-addons">
          {product.addons.map((a) => <li key={a.title}><b>{a.title}</b><span>{a.body}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

/** Ürün sayfasının gövdesi (/urunler/[slug]); iletişim kartı sayfada ayrıca eklenir. */
type ViewProps = { product: ProductDetail; workingHours: string; hasPhone: boolean };

export function ProductDetailView({ product, workingHours, hasPhone }: ViewProps) {
  return (
    <>
      <ProductHero product={product} />
      <Overview product={product} />
      <ForWhom product={product} />
      <PackageList product={product} />
      <Setup product={product} workingHours={workingHours} hasPhone={hasPhone} />
      {product.versions && <Versions versions={product.versions} />}
      {product.diffFrom && <Diff from={product.diffFrom} to={product.compareId} />}
      <AtAGlance id={product.compareId} />
      <Addons product={product} />
      <Faq items={product.faq} title={`${product.name} hakkında`} />
    </>
  );
}
