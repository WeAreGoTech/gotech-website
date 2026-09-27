import Link from "next/link";

/** Panel içindeki 404: panelin dilinde kalır (giriş ekranlarıyla aynı kart). */
export default function PanelNotFound() {
  return (
    <div className="auth wise">
      <div className="auth-card">
        <h1>Aradığınız sayfa bulunamadı</h1>
        <p className="muted" style={{ margin: 0 }}>
          Bağlantı yanlış olabilir ya da bu sayfayı görme yetkiniz olmayabilir.
        </p>
        <div className="cta-row">
          <Link className="btn" href="/panel">Panele dön</Link>
          <Link className="btn btn-ghost" href="/">Siteye git</Link>
        </div>
      </div>
    </div>
  );
}
