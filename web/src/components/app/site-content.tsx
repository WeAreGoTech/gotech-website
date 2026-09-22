"use client";

import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { FormMessage, TextAreaField, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { saveSiteTexts } from "@/features/site-content/actions";
import { SITE_CONTENT_GROUPS, SITE_SETTINGS_FIELDS } from "@/features/site-content/labels";

export function SiteTextsForm({ settings, content }: { settings: SiteSettings; content: SiteContent }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(saveSiteTexts);

  const field = <T extends Record<string, string>>(
    values: T,
    item: { key: keyof T & string; label: string; kind?: "textarea"; hint?: string },
  ) =>
    item.kind === "textarea" ? (
      <TextAreaField
        key={item.key}
        wide
        rows={3}
        label={<>{item.label}{item.hint && <span className="opt"> — {item.hint}</span>}</>}
        name={item.key}
        defaultValue={values[item.key]}
        error={errorFor(item.key)}
      />
    ) : (
      <TextField
        key={item.key}
        label={<>{item.label}{item.hint && <span className="opt"> — {item.hint}</span>}</>}
        name={item.key}
        defaultValue={values[item.key]}
        error={errorFor(item.key)}
      />
    );

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div className="card">
        <h2>İletişim bilgileri</h2>
        <div className="form-grid">{SITE_SETTINGS_FIELDS.map((item) => field(settings, item))}</div>
      </div>

      {SITE_CONTENT_GROUPS.map((group) => (
        <div className="card" key={group.title}>
          <h2>{group.title}</h2>
          <p className="muted" style={{ marginTop: -8, marginBottom: 16 }}>{group.description}</p>
          <div className="form-grid">{group.fields.map((item) => field(content, item))}</div>
        </div>
      ))}

      <div className="form-actions">
        <FormMessage state={state} />
        <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Değişiklikleri kaydet"}</button>
      </div>
    </form>
  );
}
