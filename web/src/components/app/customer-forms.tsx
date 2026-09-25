"use client";

import { useState, type ReactNode } from "react";
import { SelectField, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { addCustomer, setCustomerPassword } from "@/features/customers/actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password-rules";
import type { ActionState, NewAccount } from "@/lib/forms";
import { Icon } from "./Icon";
import { ModalButton, useCloseModal } from "./Modal";

const NEW_COMPANY = "new";
const COPIED_RESET_MS = 2000;

/** The message staff pass on to the customer, ready to paste into WhatsApp or a mail. */
const shareText = (a: NewAccount) => `GoTech müşteri paneli giriş bilgileriniz:\nAdres: ${a.loginUrl}\nE-posta: ${a.email}\nŞifre: ${a.password}`;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // no clipboard permission: the person selects the text by hand
    }
  };
  return (
    <button type="button" className="btn btn-block" onClick={copy}>
      <Icon name={copied ? "check" : "copy"} size={18} />
      {copied ? "Kopyalandı" : label}
    </button>
  );
}

/** Wise's success screen: a tick, one line on what happened, then what to do next. */
function Done({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <div className="done" role="status">
      <div className="done-head">
        <span className="done-icon"><Icon name="check" size={30} /></span>
        <h3>{title}</h3>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}

function AccountReady({ account, onAnother }: { account: NewAccount; onAnother: () => void }) {
  const close = useCloseModal();
  const rows: [string, ReactNode][] = [
    ["Firma", account.companyName],
    ["Giriş adresi", account.loginUrl],
    ["E-posta", account.email],
    ["Şifre", <code key="password">{account.password}</code>],
  ];
  return (
    <Done title={`${account.name} eklendi`} text="Giriş bilgilerini kendisine iletin; panele ve GoTech Desk'e bununla girer.">
      <dl className="details">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="done-actions">
        <CopyButton value={shareText(account)} label="Giriş bilgilerini kopyala" />
        <div className="done-row">
          <button type="button" className="btn btn-ghost" onClick={onAnother}>Başka müşteri ekle</button>
          <button type="button" className="btn btn-ghost" onClick={close}>Tamam</button>
        </div>
      </div>
    </Done>
  );
}

const FormError = ({ state }: { state: ActionState }) =>
  state.status === "error" && state.message ? <p className="form-message is-error" role="alert">{state.message}</p> : null;

type AddCustomerProps =
  // "Müşteriler" page: any company, or a new one
  | { companies: { id: string; name: string }[]; companyId?: undefined }
  // company page: the company is known, so there is no company choice
  | { companyId: string; companies?: undefined };

/** Staff add a customer straight in: the account opens with the password they type, nothing is mailed. */
export function AddCustomerForm(props: AddCustomerProps) {
  const { state, pending, onSubmit, errorFor } = useFormAction(addCustomer);
  const [companyId, setCompanyId] = useState(props.companies?.[0]?.id ?? NEW_COMPANY);
  const [dismissed, setDismissed] = useState<number>();
  const account = state.account && state.submittedAt !== dismissed ? state.account : null;
  const newCompany = props.companyId === undefined && companyId === NEW_COMPANY;

  if (account) return <AccountReady account={account} onAnother={() => setDismissed(state.submittedAt)} />;

  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      {props.companyId !== undefined ? (
        <input type="hidden" name="companyId" value={props.companyId} />
      ) : (
        <SelectField
          label="Firma"
          name="companyId"
          value={companyId}
          onValueChange={setCompanyId}
          options={[...props.companies.map((c) => ({ value: c.id, label: c.name })), { value: NEW_COMPANY, label: "Yeni firma ekle" }]}
          error={errorFor("companyId")}
        />
      )}
      {newCompany && <TextField label="Yeni firmanın adı" name="companyName" error={errorFor("companyName")} />}
      <TextField label="Ad soyad" name="name" autoComplete="off" error={errorFor("name")} />
      <TextField label="E-posta" name="email" type="email" autoComplete="off" error={errorFor("email")} />
      <TextField label="Şifre" name="password" autoComplete="off" hint={`En az ${MIN_PASSWORD_LENGTH} karakter. Kişi sonra hesabından değiştirebilir.`} error={errorFor("password")} />
      <div className="form-grid">
        <TextField label="Telefon" name="phone" type="tel" optional autoComplete="off" error={errorFor("phone")} />
        <TextField label="Görev" name="title" optional placeholder="Örneğin: Satın alma" autoComplete="off" error={errorFor("title")} />
      </div>
      {!newCompany && (
        <label className="check-row">
          <input type="checkbox" name="companyAdmin" />
          Firma yetkilisi olsun (firmasının kişilerini yönetebilir)
        </label>
      )}
      <FormError state={state} />
      <button className="btn btn-block" type="submit" disabled={pending}>{pending ? "Ekleniyor…" : "Müşteriyi ekle"}</button>
    </form>
  );
}

function SetPasswordForm({ personId }: { personId: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(setCustomerPassword);
  const close = useCloseModal();
  if (state.status === "success" && state.message) {
    return (
      <Done title={state.message} text="Eski şifre ve açık oturumlar kapandı. Yeni şifreyi kişiye iletin.">
        <button type="button" className="btn btn-block" onClick={close}>Tamam</button>
      </Done>
    );
  }
  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="userId" value={personId} />
      <TextField label="Yeni şifre" name="password" autoComplete="off" hint={`En az ${MIN_PASSWORD_LENGTH} karakter.`} error={errorFor("password")} />
      <FormError state={state} />
      <button className="btn btn-block" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Şifreyi kaydet"}</button>
    </form>
  );
}

/** For a customer who lost their password: staff type a new one. */
export function SetPasswordButton({ personId, name }: { personId: string; name: string }) {
  return (
    <ModalButton look="small" label="Şifre belirle" title={`${name} için şifre`}>
      <SetPasswordForm personId={personId} />
    </ModalButton>
  );
}
