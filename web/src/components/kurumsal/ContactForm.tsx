"use client";

import { useEffect, useRef, useState } from "react";
import { useFormAction } from "@/components/forms/use-form-action";
import { submitLead } from "@/features/leads/actions";
import { TOPIC_LABELS } from "@/features/leads/labels";

// hata metni alanın etiketinin içinde: ekran okuyucu alanı hatasıyla birlikte okur (ayrıca aria-describedby gerekmez)
function Err({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="err" role="alert">{message}</span>;
}

const invalid = (message?: string) => (message ? { "aria-invalid": true } : {});

export function ContactForm({ submitLabel = "Keşif görüşmesi isteyin" }: { submitLabel?: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(submitLead);
  const [dismissedAt, setDismissedAt] = useState<number | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  const sent = state.status === "success" && state.submittedAt !== dismissedAt;

  // gönderim hatalıysa odak ilk hatalı alana gitsin (dar ekranda hata üstte kalıp görünmez olmasın)
  useEffect(() => {
    if (state.status !== "error") return;
    const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  if (sent) {
    return (
      <div className="form-done" role="status">
        <h3>Mesajınız alındı.</h3>
        <p>Keşif görüşmesini planlamak için ekibimiz size dönecek.</p>
        <button className="btn btn-line" type="button" onClick={() => setDismissedAt(state.submittedAt)}>
          Yeni mesaj yazın
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="kform" onSubmit={(e) => (pending ? e.preventDefault() : onSubmit(e))} noValidate key={dismissedAt}>
      <div className="row">
        <label>
          Ad soyad *
          <input type="text" name="name" required autoComplete="name" {...invalid(errorFor("name"))} />
          <Err message={errorFor("name")} />
        </label>
        <label>
          E-posta *
          <input type="email" name="email" required autoComplete="email" {...invalid(errorFor("email"))} />
          <Err message={errorFor("email")} />
        </label>
      </div>

      <div className="row">
        <label>
          Telefon (isteğe bağlı)
          <input type="tel" name="phone" autoComplete="tel" placeholder="05xx xxx xx xx" {...invalid(errorFor("phone"))} />
          <Err message={errorFor("phone")} />
        </label>
        <label>
          Firma adı (isteğe bağlı)
          <input type="text" name="company" autoComplete="organization" {...invalid(errorFor("company"))} />
          <Err message={errorFor("company")} />
        </label>
      </div>

      <label>
        Konu
        <select name="topic" defaultValue="">
          <option value="">Konu seçin</option>
          {Object.entries(TOPIC_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <label>
        Mesajınız (isteğe bağlı)
        <textarea name="message" placeholder="İşletmenizden, kaç kişinin çalışacağından ve ihtiyacınızdan kısaca bahsedin." {...invalid(errorFor("message"))} />
        <Err message={errorFor("message")} />
      </label>

      {/* honeypot: gerçek ziyaretçi bu alanı görmez, botlar doldurur */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-10000px" }} />

      <div>
        {/* TODO(GoTech): KVKK aydınlatma metni hukuk danışmanından gelince /kvkk sayfası açılıp bu cümleye bağlanacak */}
        <label className="consent">
          <input type="checkbox" name="consent" {...invalid(errorFor("consent"))} />
          <span>Kişisel verilerimin iletişim amacıyla işlenmesine ilişkin aydınlatma metnini okudum, onaylıyorum.</span>
        </label>
        <Err message={errorFor("consent")} />
      </div>

      {state.status === "error" && state.message && <p className="note bad" role="alert">{state.message}</p>}

      <div className="cta-row">
        {/* disabled değil aria-disabled: odaklı buton devre dışı kalınca odak kaybolmasın; çift gönderimi onSubmit engelliyor */}
        <button className="btn" type="submit" aria-disabled={pending}>{pending ? "Gönderiliyor…" : submitLabel}</button>
      </div>
    </form>
  );
}
