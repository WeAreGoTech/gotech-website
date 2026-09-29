"use client";

import { useEffect, useRef, useState } from "react";
import { useFormAction } from "@/components/forms/use-form-action";
import { submitLead } from "@/features/leads/actions";
import { TOPIC_LABELS } from "@/features/leads/labels";
import { Arrow } from "./icons";
import f from "./contact.module.css";

// hata metni alanın etiketinin içinde: ekran okuyucu alanı hatasıyla birlikte okur
function Err({ message }: { message?: string }) {
  if (!message) return null;
  return <span className={f.err} role="alert">{message}</span>;
}

const invalid = (message?: string) => (message ? { "aria-invalid": true } : {});

/** İletişim formu (gerçek başvuru: submitLead). Alan adları Prefill'in beklediği gibi: topic, message, name. */
export function LeadForm({ submitLabel = "Gönderin" }: { submitLabel?: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(submitLead);
  const [dismissedAt, setDismissedAt] = useState<number | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  const sent = state.status === "success" && state.submittedAt !== dismissedAt;

  // gönderim hatalıysa odak ilk hatalı alana gitsin
  useEffect(() => {
    if (state.status !== "error") return;
    const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  if (sent) {
    return (
      <div className={f.done} role="status">
        <p className={f.doneMark} aria-hidden="true"><span className="plus" /></p>
        <h3 className="h3">Mesajınız bize ulaştı.</h3>
        <p>Ekibimiz size dönecek.</p>
        <button className="btn btn-line btn-sm" type="button" onClick={() => setDismissedAt(state.submittedAt)}>
          Yeni mesaj yazın
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={f.form} onSubmit={(e) => (pending ? e.preventDefault() : onSubmit(e))} noValidate key={dismissedAt}>
      <div className={f.row}>
        <label className={f.field}>
          <span>Ad soyad</span>
          <input type="text" name="name" required autoComplete="name" {...invalid(errorFor("name"))} />
          <Err message={errorFor("name")} />
        </label>
        <label className={f.field}>
          <span>E-posta</span>
          <input type="email" name="email" required autoComplete="email" {...invalid(errorFor("email"))} />
          <Err message={errorFor("email")} />
        </label>
      </div>

      <div className={f.row}>
        <label className={f.field}>
          <span>Telefon <i>isteğe bağlı</i></span>
          <input type="tel" name="phone" autoComplete="tel" placeholder="05xx xxx xx xx" {...invalid(errorFor("phone"))} />
          <Err message={errorFor("phone")} />
        </label>
        <label className={f.field}>
          <span>Firma <i>isteğe bağlı</i></span>
          <input type="text" name="company" autoComplete="organization" {...invalid(errorFor("company"))} />
          <Err message={errorFor("company")} />
        </label>
      </div>

      <label className={f.field}>
        <span>Konu</span>
        <select name="topic" defaultValue="">
          <option value="">Seçin</option>
          {Object.entries(TOPIC_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <label className={f.field}>
        <span>Mesajınız <i>isteğe bağlı</i></span>
        <textarea name="message" rows={4} placeholder="Ne kullandığınızı, kaç kişinin çalışacağını ve neye ihtiyacınız olduğunu kısaca yazın." {...invalid(errorFor("message"))} />
        <Err message={errorFor("message")} />
      </label>

      {/* honeypot: gerçek ziyaretçi bu alanı görmez, botlar doldurur */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={f.trap} />

      <div>
        {/* TODO(GoTech): KVKK aydınlatma metni gelince /kvkk sayfası açılıp bu cümleye bağlanacak */}
        <label className={f.consent}>
          <input type="checkbox" name="consent" {...invalid(errorFor("consent"))} />
          <span>Kişisel verilerimin iletişim amacıyla işlenmesine ilişkin aydınlatma metnini okudum, onaylıyorum.</span>
        </label>
        <Err message={errorFor("consent")} />
      </div>

      {state.status === "error" && state.message && <p className={f.bad} role="alert">{state.message}</p>}

      <div className={f.send}>
        {/* aria-disabled: odaklı buton devre dışı kalınca odak kaybolmasın; çift gönderimi onSubmit engelliyor */}
        <button className="btn" type="submit" aria-disabled={pending}>
          {pending ? "Gönderiliyor…" : submitLabel} {!pending && <Arrow />}
        </button>
      </div>
    </form>
  );
}
