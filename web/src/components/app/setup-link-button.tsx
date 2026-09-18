"use client";

import { useState, useTransition } from "react";
import { createPersonSetupLink } from "@/features/devices/setup-link-actions";

const COPIED_RESET_MS = 2000;

/** Makes a person's one-click GoTech Desk setup link and shows it to copy, since e-mail may not go out yet. */
export function SetupLinkButton({ personId }: { personId: string }) {
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
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  if (url) {
    return (
      <span className="setup-link">
        <input className="setup-link-url" readOnly value={url} aria-label="Kurulum bağlantısı" onFocus={(e) => e.currentTarget.select()} />
        <button className="btn btn-small" type="button" onClick={copy}>{copied ? "Kopyalandı" : "Kopyala"}</button>
      </span>
    );
  }
  return (
    <button className="btn btn-ghost btn-small" type="button" disabled={pending} onClick={create} title={error || "7 gün geçerli, tek kullanımlık; bilgisayar şifre sormadan kişiye kaydolur"}>
      {pending ? "Hazırlanıyor…" : error ? "Tekrar dene" : "Kurulum bağlantısı"}
    </button>
  );
}
