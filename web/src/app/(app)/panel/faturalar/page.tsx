import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { Stat } from "@/components/app/dashboard";
import { InvoiceList } from "@/components/app/invoices";
import { listInvoices } from "@/features/invoices/queries";
import { requireCustomer } from "@/lib/auth/session";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Faturalar" };

export default async function CustomerInvoicesPage() {
  const user = await requireCustomer();
  const invoices = await listInvoices(user.companyId);
  const unpaid = invoices.filter((i) => i.state === "pending" || i.state === "overdue");
  const overdue = invoices.filter((i) => i.state === "overdue");
  const thisYear = String(new Date().getFullYear());
  const paidThisYear = invoices.filter((i) => i.state === "paid" && i.paidAt?.toISOString().startsWith(thisYear));

  return (
    <>
      <PageHeader title="Faturalar" description="Kesilen faturalarınız, ödeme durumları ve yazdırılabilir kopyaları." />
      <div className="stats">
        <Stat hero label="Ödenecek" icon="wallet" value={formatMoney(unpaid.reduce((s, i) => s + i.total, 0))} note={`${unpaid.length} fatura`} />
        <Stat label="Vadesi geçen" icon="calendar" value={formatMoney(overdue.reduce((s, i) => s + i.total, 0))} note={overdue.length ? `${overdue.length} fatura, lütfen ödemeyi yapın` : "Vadesi geçen fatura yok"} alert={overdue.length > 0} />
        <Stat label={`${thisYear} yılında ödenen`} icon="check" value={formatMoney(paidThisYear.reduce((s, i) => s + i.total, 0))} note={`${paidThisYear.length} fatura`} />
      </div>
      <InvoiceList invoices={invoices} basePath="/panel/faturalar" />
    </>
  );
}
