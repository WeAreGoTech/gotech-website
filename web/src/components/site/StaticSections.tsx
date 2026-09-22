import Link from "next/link";
import "./closing.css";
import "./showcase.css";
import { COMPARE_ROWS, FAQ_ITEMS, PRODUCTS, SERVICES, STATS, VALUES } from "./content";

export function Stats() {
  return (
    <section className="stats" data-nav-tone="light" aria-label="GoTech rakamlarla">
      <p>Mikro Yazılım İş Ortağı olarak 2017&apos;den beri işletmelere ERP çözümleri sunuyoruz.</p>
      <ul>
        {STATS.map((s) => (
          <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
        ))}
      </ul>
    </section>
  );
}

export function Work() {
  return (
    <section className="section work" id="isler" data-nav-tone="light">
      <div className="work-head">
        <div className="section-head">
          <h2 className="h2">Yazılımı satmakla bitmiyor.</h2>
          <p className="lede">İş analizinden eğitime, kurulumdan 7/24 desteğe kadar sürecin tamamında yanınızdayız.</p>
        </div>
      </div>
      <ul className="service-cards">
        {SERVICES.map((s) => (
          <li key={s.title} className="service-card">
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </li>
        ))}
      </ul>
      <ul className="values">
        {VALUES.map((v) => (
          <li key={v.title}><h3>{v.title}</h3><p>{v.text}</p></li>
        ))}
      </ul>
    </section>
  );
}

export function Compare() {
  return (
    <section className="section compare" data-nav-tone="dark" aria-labelledby="compare-title">
      <div className="section-head">
        <h2 className="h2" id="compare-title">Hangi ürün size uygun?</h2>
        <p className="lede">İşletme profilinize göre önerimiz. Emin değilseniz ücretsiz danışmanlıkta birlikte netleştiriyoruz.</p>
      </div>
      <table className="compare-table">
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Özellik</span></th>
            <th scope="col">Mikro Run</th>
            <th scope="col" className="is-us">Mikro Jump</th>
            <th scope="col">Mikro Fly</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.topic}>
              <th scope="row">{row.topic}</th>
              <td data-label="Mikro Run">{row.run}</td>
              <td className={`is-us${row.jump === "—" ? " is-none" : ""}`} data-label="Mikro Jump">{row.jump}</td>
              <td data-label="Mikro Fly">{row.fly}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section faq" id="sss" data-nav-tone="light">
      <div className="faq-grid">
        <div className="faq-aside">
          <h2 className="h2">Sık sorulan sorular</h2>
          <p className="lede">Aradığınız cevap burada yoksa bize yazın, sorunuzu birlikte netleştirelim.</p>
          <a className="btn btn-ghost" href="#iletisim">Bize yazın</a>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <details key={item.q} className="faq-item" open={i === 0}>
              <summary>{item.q}<span className="faq-icon" aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer" data-nav-tone="dark">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="logo" href="#top" aria-label="GoTech ana sayfa">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
            <img src="/brand/gotech-logo-dark.svg" alt="" width={180} height={58} />
          </a>
          <p>Mikro Yazılım İş Ortağı olarak 2017&apos;den beri işletmelere ERP çözümleri sunuyoruz.</p>
        </div>
        <div>
          <h2 className="footer-h">Ürünler</h2>
          <ul>{PRODUCTS.map((p) => <li key={p.id}><a href={`#${p.id}`}>{p.title}</a></li>)}</ul>
        </div>
        <div>
          <h2 className="footer-h">Şirket</h2>
          <ul><li><a href="#isler">Hizmetler</a></li><li><a href="#surec">Süreç</a></li><li><a href="#sss">SSS</a></li><li><a href="#iletisim">İletişim</a></li></ul>
        </div>
        <div>
          <h2 className="footer-h">Müşteriler</h2>
          <ul><li><Link href="/giris">Destek portalı</Link></li><li><Link href="/panel/talep/yeni">Destek talebi aç</Link></li></ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 GoTech ERP Solutions</span>
        <nav aria-label="Yasal bağlantılar"><a href="#">KVKK aydınlatma metni</a><a href="#">Çerez politikası</a></nav>
      </div>
    </footer>
  );
}
