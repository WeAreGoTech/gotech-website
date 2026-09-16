import Link from "next/link";
import { INVOICE_STATE_LABELS, VAT_RATE, lineTotal, type InvoiceState } from "@/features/invoices/calc";
import type { InvoiceDetail, InvoiceSummary } from "@/features/invoices/queries";
import { formatDate, formatMoney, relativeDue } from "@/lib/format";
import { Icon } from "./Icon";

export function InvoiceStatePill({ state }: { state: InvoiceState }) {
  return <span className={`status is-${state}`}>{INVOICE_STATE_LABELS[state]}</span>;
}

function dueText(invoice: InvoiceSummary) {
  if (invoice.state === "paid" && invoice.paidAt) return `${formatDate(invoice.paidAt)} tarihinde ödendi`;
  if (invoice.state === "cancelled") return "İptal edildi";
  return `Son ödeme ${formatDate(invoice.dueOn)}, ${relativeDue(invoice.dueOn).toLocaleLowerCase("tr-TR")}`;
}

export function InvoiceList({ invoices, basePath, showCompany = false }: { invoices: InvoiceSummary[]; basePath: string; showCompany?: boolean }) {
  return (
    <ul className="w-list">
      {invoices.length === 0 && <li className="empty-row">Henüz fatura yok.</li>}
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <Link className="w-row" href={`${basePath}/${invoice.number}`}>
            <span className="w-icon"><Icon name="receipt" size={18} /></span>
            <span className="w-row-main">
              <strong>{showCompany ? `${invoice.companyName}, ` : ""}{invoice.number}</strong>
              <small>{invoice.projectName ? `${invoice.projectName}. ` : ""}{dueText(invoice)}</small>
            </span>
            <span className="w-row-side">
              <span className="amount">{formatMoney(invoice.total)}</span>
              <InvoiceStatePill state={invoice.state} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The invoice as a printable page. */
export function InvoiceDocument({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <article className="invoice-doc" aria-label={`Fatura ${invoice.number}`}>
      <header className="invoice-top">
        <div>
          <span className="logo">GoTech</span>
          <p className="invoice-issuer">GoTech Yazılım (unvan ve adres bilgisi)</p>
        </div>
        <div>
          <h2>Fatura {invoice.number}</h2>
          <p><InvoiceStatePill state={invoice.state} /></p>
        </div>
      </header>

      <div className="invoice-parties">
        <div><h3>Alıcı</h3><p>{invoice.companyName}</p></div>
        <div><h3>Düzenlenme tarihi</h3><p>{formatDate(invoice.issuedOn)}</p></div>
        <div><h3>Son ödeme tarihi</h3><p>{formatDate(invoice.dueOn)}</p></div>
        {invoice.projectName && <div><h3>Proje</h3><p>{invoice.projectName}</p></div>}
      </div>

      <table className="invoice-lines">
        <thead>
          <tr><th>Açıklama</th><th className="num">Adet</th><th className="num">Birim fiyat</th><th className="num">Tutar</th></tr>
        </thead>
        <tbody>
          {invoice.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.description}</td>
              <td className="num">{line.quantity}</td>
              <td className="num">{formatMoney(line.unitPrice)}</td>
              <td className="num">{formatMoney(lineTotal(line))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="invoice-totals">
        <div><dt>Ara toplam</dt><dd>{formatMoney(invoice.subtotal)}</dd></div>
        <div><dt>KDV (%{VAT_RATE * 100})</dt><dd>{formatMoney(invoice.vat)}</dd></div>
        <div className="grand"><dt>Toplam</dt><dd>{formatMoney(invoice.total)}</dd></div>
      </dl>

      {invoice.note && <p style={{ margin: 0 }} className="muted">{invoice.note}</p>}
      {invoice.state !== "paid" && invoice.state !== "cancelled" && (
        <div className="pay-box">
          <strong>Ödeme bilgileri</strong>
          <span>Banka: (banka adı), IBAN: TR00 0000 0000 0000 0000 0000 00</span>
          <span>Açıklamaya fatura numarasını ({invoice.number}) yazmayı unutmayın.</span>
        </div>
      )}
    </article>
  );
}
