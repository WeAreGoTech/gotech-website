"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { createPersonSetupLink } from "@/features/devices/setup-link-actions";
import { SetPasswordForm } from "./customer-forms";
import { Avatar, Icon, type IconName } from "./Icon";
import { Modal } from "./Modal";

const COPIED_RESET_MS = 2000;

type Action = () => Promise<void>;

export type SheetPerson = {
  id: string;
  name: string;
  email: string;
  title?: string | null;
  phone?: string | null;
  isCompanyAdmin?: boolean;
  active: boolean;
};

/** What this viewer may do to this person; the list decides, so only allowed actions arrive here. */
export type PersonActions = {
  resend?: Action;
  promote?: Action;
  demote?: Action;
  remove?: { action: Action; label: string; note: string };
  setupLink?: boolean;
  passwordReset?: boolean;
  // the company's only firma yetkilisi: explains why demote and remove are missing
  lastAdmin?: boolean;
};

function Badges({ person }: { person: SheetPerson }) {
  return (
    <span className="person-badges">
      {person.isCompanyAdmin && <span className="badge is-admin">Firma yetkilisi</span>}
      {person.active ? <span className="badge is-active">Aktif</span> : <span className="badge is-mock">Davet bekliyor</span>}
    </span>
  );
}

function OptionBody({ icon, title, note }: { icon: IconName; title: string; note: string }) {
  return (
    <>
      <span className="w-icon"><Icon name={icon} /></span>
      <span className="option-text">
        <strong>{title}</strong>
        <small>{note}</small>
      </span>
    </>
  );
}

function SubmitOption({ icon, title, note, danger = false }: { icon: IconName; title: string; note: string; danger?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`option${danger ? " is-danger" : ""}`} disabled={pending}>
      <OptionBody icon={icon} title={pending ? "İşleniyor…" : title} note={note} />
    </button>
  );
}

const FormOption = ({ action, ...option }: { action: Action; icon: IconName; title: string; note: string; danger?: boolean }) => (
  <li>
    <form action={action}>
      <SubmitOption {...option} />
    </form>
  </li>
);

/** Makes the person's one-click GoTech Desk setup link and shows it to copy, since nothing is mailed. */
function SetupLinkOption({ personId }: { personId: string }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const create = () =>
    startTransition(async () => {
      const result = await createPersonSetupLink(personId);
      if ("url" in result) setUrl(result.url);
      else setError(result.error);
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // no clipboard permission: the field is selectable
    }
  };

  return (
    <li>
      <button type="button" className="option" disabled={pending || Boolean(url)} onClick={create}>
        <OptionBody
          icon="download"
          title={pending ? "Hazırlanıyor…" : "Kurulum bağlantısı"}
          note={error || "GoTech Desk'i şifre sormadan bu kişiye kuran link. 7 gün geçerli, tek kullanımlık."}
        />
      </button>
      {url && (
        <div className="option-extra">
          <input className="input" readOnly value={url} aria-label="Kurulum bağlantısı" onFocus={(e) => e.currentTarget.select()} />
          <button type="button" className="btn btn-small" onClick={copy}>{copied ? "Kopyalandı" : "Kopyala"}</button>
        </div>
      )}
    </li>
  );
}

function PersonDetails({ person, devices, actions }: { person: SheetPerson; devices?: number; actions: PersonActions }) {
  const [settingPassword, setSettingPassword] = useState(false);

  if (settingPassword) {
    return (
      <div className="sheet">
        <button type="button" className="sheet-back" onClick={() => setSettingPassword(false)}>
          <Icon name="arrowLeft" size={18} /> Geri
        </button>
        <SetPasswordForm personId={person.id} />
      </div>
    );
  }

  const rows: [string, ReactNode][] = [
    ["E-posta", person.email],
    ["Telefon", person.phone],
    ["Görev", person.title],
    ["Bilgisayar", devices ? `${devices} kayıtlı` : null],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const options: ReactNode[] = [];
  if (actions.passwordReset) {
    options.push(
      <li key="password">
        <button type="button" className="option" onClick={() => setSettingPassword(true)}>
          <OptionBody icon="lock" title="Şifre belirle" note="Yeni şifreyi siz yazarsınız; eski şifre ve açık oturumlar kapanır." />
        </button>
      </li>,
    );
  }
  if (actions.setupLink) options.push(<SetupLinkOption key="setup" personId={person.id} />);
  if (actions.resend) options.push(<FormOption key="resend" action={actions.resend} icon="mail" title="Daveti yeniden gönder" note="Şifre belirleme bağlantısı e-postayla tekrar gider." />);
  if (actions.promote) options.push(<FormOption key="promote" action={actions.promote} icon="star" title="Firma yetkilisi yap" note="Firmasının kişilerini ekleyip çıkarabilir." />);
  if (actions.demote) options.push(<FormOption key="demote" action={actions.demote} icon="star" title="Yetkiyi al" note="Firma yetkilisi olmaktan çıkar." />);
  if (actions.remove) options.push(<FormOption key="remove" action={actions.remove.action} icon="logout" title={actions.remove.label} note={actions.remove.note} danger />);

  return (
    <div className="sheet">
      <Badges person={person} />
      <dl className="details">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {options.length > 0 && <ul className="options">{options}</ul>}
      {actions.lastAdmin && <p className="sheet-note">Firmanın tek yetkilisi; yetkisi alınamaz ve firmadan çıkarılamaz. Önce başka birini yetkili yapın.</p>}
    </div>
  );
}

/** One person in a people list; a click opens their details and what can be done, Wise-style. */
export function PersonRow({
  person,
  tone,
  you = false,
  devices,
  actions,
}: {
  person: SheetPerson;
  tone: "team" | "customer";
  you?: boolean;
  devices?: number;
  actions: PersonActions;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="w-row w-row-button" onClick={() => setOpen(true)}>
        <Avatar name={person.name} tone={tone} />
        <span className="w-row-main">
          <strong>{person.name}{you ? " (siz)" : ""}</strong>
          <small>{[person.title, person.email].filter(Boolean).join(" · ")}</small>
        </span>
        <Badges person={person} />
        <span className="w-chevron" aria-hidden>
          <Icon name="chevronRight" size={18} />
        </span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`${person.name}${you ? " (siz)" : ""}`}>
        <PersonDetails person={person} devices={devices} actions={actions} />
      </Modal>
    </>
  );
}
