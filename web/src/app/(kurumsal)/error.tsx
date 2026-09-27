"use client";

import { PageMessage } from "@/components/home/PageMessage";
import h from "@/components/home/home.module.css";

/** İç sayfaların hata sınırı: sitenin dilinde, panelin kartı değil. */
export default function KurumsalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageMessage
      title="Bu sayfa açılamadı"
      text="Geçici bir sorun olabilir. Yeniden denemek çoğu zaman yeterli oluyor; sürerse bize yazın."
      action={
        <button className={h.btn} type="button" onClick={reset}>
          Yeniden dene
        </button>
      }
      links={[
        { href: "/", label: "Ana sayfa" },
        { href: "/iletisim", label: "İletişim" },
      ]}
      note={error.digest ? `Hata kodu: ${error.digest}` : undefined}
    />
  );
}
