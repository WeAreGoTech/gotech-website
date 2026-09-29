"use client";

import Link from "next/link";

/** Sitenin hata sınırı: kabuğun (menü, alt bilgi) içinde, sitenin dilinde. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="sec">
      <div className="wrap head">
        <p className="label"><span className="plus" aria-hidden="true" />Bir sorun oluştu</p>
        <h1 className="h1">Bu sayfa açılamadı</h1>
        <p className="lede">Geçici bir sorun olabilir. Yeniden denemek çoğu zaman yeterli oluyor; sürerse bize yazın.</p>
        <div className="actions">
          <button className="btn" type="button" onClick={reset}>Yeniden deneyin</button>
          <Link className="btn btn-line" href="/">Ana sayfa</Link>
          <Link className="tlink" href="/iletisim">İletişim</Link>
        </div>
        {error.digest && <p className="small muted">Hata kodu: {error.digest}</p>}
      </div>
    </main>
  );
}
