"use client";

import { useState } from "react";

/**
 * Tek seferlik gösterilen değer (personelin müşteriye ileteceği geçici şifre).
 * Sayfa yenilenince kaybolur; hiçbir yerde saklanmaz.
 */
export function SecretBox({ value }: { value: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  async function kopyala() {
    try {
      await navigator.clipboard.writeText(value);
      setKopyalandi(true);
    } catch {
      // pano izni yoksa kullanıcı elle seçip kopyalar
      setKopyalandi(false);
    }
  }

  return (
    <div className="secret-box">
      <code>{value}</code>
      <button type="button" className="btn btn-small" onClick={kopyala}>
        {kopyalandi ? "Kopyalandı" : "Kopyala"}
      </button>
    </div>
  );
}
