import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/app/AppShell";
import { Icon } from "@/components/app/Icon";
import { InvoiceDocument } from "@/components/app/invoices";
import { PrintButton } from "@/components/app/PrintButton";
import { getInvoice } from "@/features/invoices/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Fatura" };

export default async function CustomerInvoicePage({ params }: PageProps<"/panel/faturalar/[number]">) {
  const user = await requireCustomer();
  const { number } = await params;
  const invoice = await getInvoice(number, user.companyId);
  if (!invoice) notFound();

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-head no-print">
        <div><BackButton href="/panel/faturalar" label="Faturalara dön" /></div>
        <div className="quick" style={{ margin: 0 }}>
          <Link className="btn btn-ghost" href={`/panel/talep/yeni?tur=billing&fatura=${invoice.number}`}><Icon name="chat" size={18} />Bu fatura hakkında sor</Link>
          <PrintButton />
        </div>
      </div>
      <InvoiceDocument invoice={invoice} />
    </div>
  );
}
