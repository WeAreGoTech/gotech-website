"use client";

import { FormMessage, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { login, setPassword } from "@/features/auth/actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password-rules";

export function LoginForm() {
  const { state, pending, onSubmit, errorFor } = useFormAction(login);
  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <TextField label="E-posta" name="email" type="email" autoComplete="email" error={errorFor("email")} />
      <TextField label="Şifre" name="password" type="password" autoComplete="current-password" error={errorFor("password")} />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Giriş yapılıyor…" : "Giriş yap"}</button>
    </form>
  );
}

export function SetPasswordForm({ token }: { token: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(setPassword);
  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="token" value={token} />
      <TextField label="Yeni şifre" name="password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} error={errorFor("password")} />
      <TextField label="Yeni şifre (tekrar)" name="confirm" type="password" autoComplete="new-password" error={errorFor("confirm")} />
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>En az {MIN_PASSWORD_LENGTH} karakter.</p>
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Şifreyi kaydet ve giriş yap"}</button>
    </form>
  );
}
