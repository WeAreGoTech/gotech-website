"use client";

import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { FormMessage, TextAreaField, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { saveSiteTexts } from "@/features/site-content/actions";
import { SITE_SECTIONS, type SiteField, type SiteSection } from "@/features/site-content/labels";
import { Icon } from "./Icon";

type Values = Record<string, string>;

function SiteSectionCard({ section, values, errorFor }: { section: SiteSection; values: Values; errorFor: (key: string) => string | undefined }) {
  const field = (item: SiteField) => {
    const common = { label: item.label, name: item.key, hint: item.hint, defaultValue: values[item.key], error: errorFor(item.key) };
    return item.kind === "textarea" ? <TextAreaField key={item.key} {...common} wide rows={3} /> : <TextField key={item.key} {...common} />;
  };

  return (
    <section className="site-section" id={section.id} aria-labelledby={`${section.id}-title`}>
      <header className="site-section-head">
        <span className="w-icon"><Icon name={section.icon} /></span>
        <div>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          <p>{section.description}</p>
        </div>
      </header>
      <div className={`card site-fields${section.layout === "pairs" ? " is-pairs" : ""}`}>{section.fields.map(field)}</div>
    </section>
  );
}

export function SiteTextsForm({ settings, content }: { settings: SiteSettings; content: SiteContent }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(saveSiteTexts);
  const values: Values = { ...settings, ...content };

  return (
    <form className="site-editor" onSubmit={onSubmit}>
      <nav className="tabs site-jump" aria-label="Bölümler">
        {SITE_SECTIONS.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>

      {SITE_SECTIONS.map((section) => <SiteSectionCard key={section.id} section={section} values={values} errorFor={errorFor} />)}

      <div className="save-bar">
        <FormMessage state={state} />
        <span className="muted">Kaydedilen değişiklik sitede hemen görünür.</span>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Değişiklikleri kaydet"}</button>
      </div>
    </form>
  );
}
