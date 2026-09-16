import Link from "next/link";
import "./closing.css";
import "./showcase.css";
import { COMPARE_ROWS, FAQ_ITEMS, PROJECTS, SERVICES } from "./content";

const LOGO_SLOTS = 6;

export function Logos() {
  return (
    <section className="logos" data-nav-tone="light" aria-label="Çalıştığımız işletmeler">
      <p>Stoklarını, siparişlerini ve sitelerini bize emanet eden işletmeler</p>
      <ul>{Array.from({ length: LOGO_SLOTS }, (_, i) => <li key={i}>Logo</li>)}</ul>
    </section>
  );
}

function Project({ project, feature = false }: { project: (typeof PROJECTS)[number]; feature?: boolean }) {
  return (
    <article className={`project${feature ? " is-feature" : ""}`}>
      <div className="ph">{project.image}</div>
      <dl className="project-meta">
        <div><dt>Sektör</dt><dd>{project.sector}</dd></div>
        <div><dt>Kapsam</dt><dd>{project.scope}</dd></div>
      </dl>
      <h3>{project.title}</h3>
      <p>{project.text}</p>
    </article>
  );
}

export function Work() {
  const [feature, ...rest] = PROJECTS;
  return (
    <section className="section work" id="isler" data-nav-tone="light">
      <div className="work-head">
        <div className="section-head">
          <span className="tag">Örnek içerik</span>
          <h2 className="h2">Son işlerimizden birkaçı.</h2>
        </div>
      </div>
      <div className="work-grid">
        <Project project={feature} feature />
        <div className="work-side">{rest.map((p) => <Project key={p.title} project={p} />)}</div>
      </div>
    </section>
  );
}

export function Compare() {
  return (
    <section className="section compare" data-nav-tone="dark" aria-labelledby="compare-title">
      <div className="section-head">
        <h2 className="h2" id="compare-title">Hazır paket program mı, işinize göre kurulan sistem mi?</h2>
        <p className="lede">Paket programlar çoğu işletme için iyi bir başlangıçtır. İşiniz programa sığmamaya başladığında fark burada ortaya çıkar.</p>
      </div>
      <table className="compare-table">
        <thead>
          <tr><th scope="col"><span className="sr-only">Konu</span></th><th scope="col">Hazır paket program</th><th scope="col" className="is-us">GoTech ile</th></tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.topic}>
              <th scope="row">{row.topic}</th>
              <td data-label="Hazır paket program">{row.packaged}</td>
              <td className="is-us" data-label="GoTech ile">{row.gotech}</td>
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
          <a className="logo" href="#top">GoTech</a>
          <p>Mikro ERP, web sitesi ve yönetim paneli. Tasarımından kurulumuna tek ekip.</p>
        </div>
        <div>
          <h2 className="footer-h">Çözümler</h2>
          <ul>{SERVICES.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
        </div>
        <div>
          <h2 className="footer-h">Şirket</h2>
          <ul><li><a href="#isler">İşler</a></li><li><a href="#surec">Süreç</a></li><li><a href="#sss">SSS</a></li><li><a href="#iletisim">İletişim</a></li></ul>
        </div>
        <div>
          <h2 className="footer-h">Müşteriler</h2>
          <ul><li><Link href="/giris">Müşteri girişi</Link></li><li><Link href="/panel/talep/yeni">Destek talebi aç</Link></li></ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 GoTech</span>
        <nav aria-label="Yasal bağlantılar"><a href="#">KVKK aydınlatma metni</a><a href="#">Çerez politikası</a></nav>
      </div>
    </footer>
  );
}
