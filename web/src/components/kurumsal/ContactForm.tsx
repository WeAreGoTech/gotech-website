"use client";

import { useState } from "react";
import { useFormAction } from "@/components/forms/use-form-action";
import { submitLead } from "@/features/leads/actions";
import { TOPIC_LABELS } from "@/features/leads/labels";

function Err({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="err">{message}</span>;
}

export function ContactForm() {
  const { state, pending, onSubmit, errorFor } = useFormAction(submitLead);
  const [dismissedAt, setDismissedAt] = useState<number | undefined>();
  const sent = state.status === "success" && state.submittedAt !== dismissedAt;

  if (sent) {
    return (
      <div className="form-done" role="status">
        <h3>Mesajınız alındı.</h3>
        <p>En kısa sürede size dönüş yapacağız.</p>
        <button className="btn btn-line" type="button" onClick={() => setDismissedAt(state.submittedAt)}>
          Yeni mesaj yazın
        </button>
      </div>
    );
  }

  return (
    <form className="kform" onSubmit={onSubmit} noValidate key={dismissedAt}>
      <div className="row">
        <label>
          Ad soyad
          <input type="text" name="name" required autoComplete="name" />
          <Err message={errorFor("name")} />
        </label>
        <label>
          E-posta
          <input type="email" name="email" required autoComplete="email" />
          <Err message={errorFor("email")} />
        </label>
      </div>

      <div className="row">
        <label>
          Telefon
          <input type="tel" name="phone" required autoComplete="tel" placeholder="05xx xxx xx xx" />
          <Err message={errorFor("phone")} />
        </label>
        <label>
          Firma adı
          <input type="text" name="company" autoComplete="organization" />
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
        Mesajınız
        <textarea name="message" required placeholder="İşletmenizden ve ihtiyacınızdan kısaca bahsedin." />
        <Err message={errorFor("message")} />
      </label>

      {/* honeypot: gerçek ziyaretçi bu alanı görmez, botlar doldurur */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-10000px" }} />

      <div>
        <label className="consent">
          <input type="checkbox" name="consent" />
          <span>Kişisel verilerimin iletişim amacıyla işlenmesine ilişkin aydınlatma metnini okudum, onaylıyorum.</span>
        </label>
        <Err message={errorFor("consent")} />
      </div>

      {state.status === "error" && state.message && <p className="note bad">{state.message}</p>}

      <div className="cta-row">
        <button className="btn" type="submit" disabled={pending}>{pending ? "Gönderiliyor…" : "Mesajı gönderin"}</button>
      </div>
    </form>
  );
}
