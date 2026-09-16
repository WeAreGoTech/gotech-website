"use client";

import { useState } from "react";
import { FormMessage, TextAreaField, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { submitLead } from "@/features/leads/actions";
import { TOPIC_LABELS } from "@/features/leads/labels";

export function ContactForm() {
  const { state, pending, onSubmit, errorFor } = useFormAction(submitLead);
  const [dismissedAt, setDismissedAt] = useState<number | undefined>();
  const sent = state.status === "success" && state.submittedAt !== dismissedAt;

  if (sent) {
    return (
      <div className="form-done" role="status">
        <span className="check" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h3>Mesajınız gönderildi.</h3>
        <p>Teşekkürler. İşinizi konuşmak için en kısa sürede size dönüş yapacağız.</p>
        <button className="btn btn-ghost" type="button" onClick={() => setDismissedAt(state.submittedAt)}>Yeni mesaj yazın</button>
      </div>
    );
  }

  const consentError = errorFor("consent");
  return (
    <form className="form" onSubmit={onSubmit} noValidate key={dismissedAt}>
      <TextField label="Ad soyad" name="name" autoComplete="name" error={errorFor("name")} />
      <TextField label="Şirket" name="company" autoComplete="organization" optional error={errorFor("company")} />
      <TextField label="E-posta" name="email" type="email" autoComplete="email" error={errorFor("email")} />
      <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" optional error={errorFor("phone")} />

      <fieldset className="field is-wide">
        <legend>Neyle ilgileniyorsunuz?</legend>
        <div className="choice-group">
          {Object.entries(TOPIC_LABELS).map(([value, label]) => (
            <label key={value} className="choice"><input type="checkbox" name="topic" value={value} /><span>{label}</span></label>
          ))}
        </div>
      </fieldset>

      <TextAreaField label="Mesajınız" name="message" rows={4} optional wide placeholder="İşinizden ve çözmek istediğiniz sorundan kısaca bahsedin." error={errorFor("message")} />

      {/* honeypot for bots: hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-10000px" }} />

      <div className={`consent${consentError ? " is-invalid" : ""}`}>
        <input type="checkbox" id="f-consent" name="consent" aria-invalid={consentError ? true : undefined} aria-describedby={consentError ? "f-consent-error" : undefined} />
        <label htmlFor="f-consent">Kişisel verilerimin iletişim amacıyla işlenmesine ilişkin <a href="#">aydınlatma metnini</a> okudum.</label>
        {consentError && <p className="field-error" id="f-consent-error">{consentError}</p>}
      </div>

      <div className="form-foot">
        <FormMessage state={state} />
        <small>Bilgileriniz yalnızca size dönüş yapmak için kullanılır.</small>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Gönderiliyor…" : "Mesajı gönder"}</button>
      </div>
    </form>
  );
}
