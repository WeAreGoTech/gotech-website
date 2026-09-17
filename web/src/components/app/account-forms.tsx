"use client";

import { FormMessage, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { changePassword, updateNotifications, updateProfile } from "@/features/account/actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password-rules";

type Profile = { name: string; email: string; title: string | null; phone: string | null; notifyByEmail: boolean };

export function ProfileForm({ profile }: { profile: Profile }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(updateProfile);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <h2>Profil</h2>
      <TextField label="Ad soyad" name="name" defaultValue={profile.name} autoComplete="name" error={errorFor("name")} />
      <div className="form-grid">
        <TextField label="Görev" name="title" defaultValue={profile.title ?? ""} optional placeholder="Örneğin: Muhasebe" error={errorFor("title")} />
        <TextField label="Telefon" name="phone" type="tel" defaultValue={profile.phone ?? ""} optional autoComplete="tel" error={errorFor("phone")} />
      </div>
      <TextField label="E-posta" name="email" value={profile.email} readOnly disabled />
      <FormMessage state={state} />
      <div className="form-actions">
        <span className="muted">E-posta adresinizi değiştirmek için ekibimize yazın.</span>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const { state, pending, onSubmit, errorFor } = useFormAction(changePassword);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <h2>Şifre</h2>
      <TextField label="Mevcut şifre" name="current" type="password" autoComplete="current-password" error={errorFor("current")} />
      <div className="form-grid">
        <TextField label="Yeni şifre" name="password" type="password" autoComplete="new-password" error={errorFor("password")} />
        <TextField label="Yeni şifre (tekrar)" name="confirm" type="password" autoComplete="new-password" error={errorFor("confirm")} />
      </div>
      <FormMessage state={state} />
      <div className="form-actions">
        <span className="muted">En az {MIN_PASSWORD_LENGTH} karakter.</span>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Değiştiriliyor…" : "Şifreyi değiştir"}</button>
      </div>
    </form>
  );
}

export function NotificationForm({ enabled, audience }: { enabled: boolean; audience: "staff" | "customer" }) {
  const { state, pending, onSubmit } = useFormAction(updateNotifications);
  return (
    <form className="card form-stack" onSubmit={onSubmit}>
      <h2>Bildirimler</h2>
      <label className="check-row">
        <input type="checkbox" name="notifyByEmail" defaultChecked={enabled} />
        <span>
          E-posta ile haber ver
          <small className="muted" style={{ display: "block" }}>
            {audience === "customer" ? "Talebinize yanıt geldiğinde." : "Size atanan taleplere müşteri yanıt yazdığında."}
          </small>
        </span>
      </label>
      <FormMessage state={state} />
      <div className="form-actions">
        <span />
        <button className="btn btn-ghost" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Tercihi kaydet"}</button>
      </div>
    </form>
  );
}
