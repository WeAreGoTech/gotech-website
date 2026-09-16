"use client";

import { useState } from "react";
import { FormMessage, SelectField, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { createInvoice } from "@/features/invoices/actions";
import { INVOICE_PAYMENT_DAYS, VAT_RATE, parseMoney, withVat } from "@/features/invoices/calc";
import { formatMoney } from "@/lib/format";
import { Icon } from "./Icon";

type Company = { id: string; name: string; projects: { id: string; name: string }[] };
type Line = { key: number; description: string; quantity: string; price: string };

const MAX_LINES = 8;
const emptyLine = (key: number): Line => ({ key, description: "", quantity: "1", price: "" });

export function InvoiceForm({ companies }: { companies: Company[] }) {
  const { state, pending, onSubmit } = useFormAction(createInvoice);
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "");
  const [lines, setLines] = useState<Line[]>([emptyLine(0)]);
  const projects = companies.find((c) => c.id === companyId)?.projects ?? [];

  const update = (key: number, field: keyof Omit<Line, "key">, value: string) =>
    setLines(lines.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
  const subtotal = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (parseMoney(l.price) ?? 0), 0);
  const { vat, total } = withVat(subtotal);

  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <SelectField label="Firma" name="companyId" value={companyId} onChange={(e) => setCompanyId(e.target.value)} options={companies.map((c) => ({ value: c.id, label: c.name }))} />
        <SelectField label="Proje" name="projectId" optional options={[{ value: "", label: "Projeye bağlı değil" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]} key={companyId} />
      </div>

      <fieldset className="field">
        <legend>Kalemler</legend>
        <div className="line-rows">
          <div className="line-row line-row-head" aria-hidden="true"><span>Açıklama</span><span>Adet</span><span>Birim fiyat (KDV hariç)</span><span /></div>
          {lines.map((line, i) => (
            <div key={line.key} className="line-row">
              <input className="input" name="lineDescription" aria-label={`${i + 1}. kalem açıklaması`} placeholder="Örneğin: Aylık bakım ve destek" value={line.description} onChange={(e) => update(line.key, "description", e.target.value)} />
              <input className="input" name="lineQuantity" aria-label={`${i + 1}. kalem adedi`} inputMode="numeric" value={line.quantity} onChange={(e) => update(line.key, "quantity", e.target.value)} />
              <input className="input" name="linePrice" aria-label={`${i + 1}. kalem birim fiyatı`} inputMode="decimal" placeholder="0,00" value={line.price} onChange={(e) => update(line.key, "price", e.target.value)} />
              <button className="icon-btn" type="button" aria-label={`${i + 1}. kalemi sil`} disabled={lines.length === 1} onClick={() => setLines(lines.filter((l) => l.key !== line.key))}>
                <Icon name="close" size={16} />
              </button>
            </div>
          ))}
        </div>
      </fieldset>
      <button className="btn btn-ghost btn-small" type="button" style={{ justifySelf: "start" }} disabled={lines.length >= MAX_LINES} onClick={() => setLines([...lines, emptyLine(Math.max(...lines.map((l) => l.key)) + 1)])}>
        <Icon name="plus" size={16} /> Kalem ekle
      </button>

      <div className="form-grid">
        <TextField label="Vade (gün)" name="dueDays" type="number" min={0} max={120} defaultValue={INVOICE_PAYMENT_DAYS} />
        <TextField label="Not" name="note" optional placeholder="Faturada görünür" />
      </div>

      <div className="line-totals" aria-live="polite">
        <span className="muted">Ara toplam {formatMoney(subtotal)}, KDV (%{VAT_RATE * 100}) {formatMoney(vat)}</span>
        <strong>{formatMoney(total)}</strong>
      </div>
      <FormMessage state={state} />
      <div className="form-actions">
        <span className="muted">Fatura kesilince firmadaki kişilere e-posta gider.</span>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Kesiliyor…" : "Faturayı kes"}</button>
      </div>
    </form>
  );
}
