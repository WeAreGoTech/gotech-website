"use client";

import Link from "next/link";

/**
 * Son çare: kök yerleşim (layout) bile çizilemediğinde çalışır, bu yüzden <html> ve <body>'yi
 * kendisi kurar ve hiçbir CSS dosyasına güvenmez — stiller satır içi.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, background: "#fff", color: "#16181D", fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 20px" }} role="alert">
          <h1 style={{ margin: 0, fontSize: "1.9rem", lineHeight: 1.15, letterSpacing: "-.02em" }}>Bir şeyler ters gitti</h1>
          <p style={{ margin: "14px 0 0", color: "rgba(22,24,29,.68)", lineHeight: 1.6 }}>
            Sayfa yüklenemedi. Yeniden denemek çoğu zaman yeterli oluyor.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
            <button
              type="button"
              onClick={reset}
              style={{ padding: ".9rem 1.4rem", border: 0, borderRadius: 8, background: "#C0261F", color: "#fff", fontWeight: 600, fontSize: ".96rem", cursor: "pointer" }}
            >
              Yeniden dene
            </button>
            <Link
              href="/"
              style={{ padding: ".9rem 1.4rem", borderRadius: 8, boxShadow: "inset 0 0 0 1px rgba(22,24,29,.2)", color: "#16181D", fontWeight: 600, fontSize: ".96rem", textDecoration: "none" }}
            >
              Ana sayfa
            </Link>
          </div>
          {error.digest && (
            <p style={{ margin: "18px 0 0", fontSize: ".84rem", color: "rgba(22,24,29,.6)" }}>Hata kodu: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
