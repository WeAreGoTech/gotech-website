"use client";

import { PageMessage } from "@/components/home/PageMessage";
import h from "@/components/home/home.module.css";

/** Ana sayfanın hata sınırı (hero, ürün bulucu ya da panelden gelen içerik patlarsa). */
export default function HomeError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageMessage
      title="Ana sayfa açılamadı"
      text="Geçici bir sorun olabilir. Yeniden denemek çoğu zaman yeterli oluyor; sürerse bize yazın."
      action={
        <button className={h.btn} type="button" onClick={reset}>
          Yeniden dene
        </button>
      }
      links={[
        { href: "/urunler", label: "Ürünler" },
        { href: "/iletisim", label: "İletişim" },
      ]}
      note={error.digest ? `Hata kodu: ${error.digest}` : undefined}
    />
  );
}
