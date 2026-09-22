import Link from "next/link";
import "@/app/globals.css";
import "@/components/app/app.css";

export default function NotFound() {
  return (
    <div className="auth wise">
      <div className="auth-card">
        <h1>Aradığınız sayfa bulunamadı</h1>
        <p className="muted" style={{ margin: 0 }}>Bağlantı yanlış olabilir ya da bu sayfayı görme yetkiniz olmayabilir.</p>
        <div className="cta-row">
          <Link className="btn" href="/">Ana sayfaya dön</Link>
          <Link className="btn btn-ghost" href="/giris">Panele git</Link>
        </div>
      </div>
    </div>
  );
}
