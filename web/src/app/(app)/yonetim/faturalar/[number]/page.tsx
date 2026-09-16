import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/app/AppShell";
import { Icon } from "@/components/app/Icon";
import { InvoiceDocument } from "@/components/app/invoices";
import { PrintButton } from "@/components/app/PrintButton";
import { cancelInvoice, markInvoicePaid, reopenInvoice } from "@/features/invoices/actions";
import { getInvoice } from "@/features/invoices/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Fatura" };

export default async function TeamInvoicePage({ params }: PageProps<"/yonetim/faturalar/[number]">) {
  await requireStaff();
  const { number } = await params;
  const invoice = await getInvoice(number);
  if (!invoice) notFound();
  const open = invoice.state === "pending" || invoice.state === "overdue";

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-head no-print">
        <div><BackButton href="/yonetim/faturalar" label="Faturalara dön" /></div>
        <div className="quick" style={{ margin: 0 }}>
          <Link className="btn btn-ghost" href={`/yonetim/musteriler/${invoice.companyId}`}><Icon name="building" size={18} />{invoice.companyName}</Link>
          {open && (
            <>
              <form action={cancelInvoice.bind(null, invoice.id)}><button className="btn btn-ghost" type="submit">İptal et</button></form>
              <form action={markInvoicePaid.bind(null, invoice.id)}><button className="btn" type="submit"><Icon name="check" size={18} />Ödendi olarak işaretle</button></form>
            </>
          )}
          {!open && (
            <form action={reopenInvoice.bind(null, invoice.id)}><button className="btn btn-ghost" type="submit">Ödeme bekliyor olarak geri al</button></form>
          )}
          <PrintButton label="Yazdır" />
        </div>
      </div>
      <InvoiceDocument invoice={invoice} />
    </div>
  );
}
