import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/app/AppShell";
import { Stat } from "@/components/app/dashboard";
import { Icon } from "@/components/app/Icon";
import { InvoiceList } from "@/components/app/invoices";
import type { InvoiceState } from "@/features/invoices/calc";
import { listInvoices } from "@/features/invoices/queries";
import { requireStaff } from "@/lib/auth/session";
import { dayKey } from "@/lib/dates";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Faturalar" };

const FILTERS: { param: string; label: string; states: InvoiceState[] }[] = [
  { param: "tumu", label: "Tümü", states: ["pending", "overdue", "paid", "cancelled"] },
  { param: "bekleyen", label: "Ödeme bekleyen", states: ["pending", "overdue"] },
  { param: "geciken", label: "Vadesi geçen", states: ["overdue"] },
  { param: "odenen", label: "Ödenen", states: ["paid"] },
];

export default async function TeamInvoicesPage({ searchParams }: PageProps<"/yonetim/faturalar">) {
  await requireStaff();
  const { durum } = await searchParams;
  const current = FILTERS.find((f) => f.param === durum) ?? FILTERS[0];
  const invoices = await listInvoices();

  const sum = (states: InvoiceState[]) => invoices.filter((i) => states.includes(i.state)).reduce((s, i) => s + i.total, 0);
  const month = dayKey(new Date()).slice(0, 7);
  const collected = invoices.filter((i) => i.paidAt && dayKey(i.paidAt).startsWith(month)).reduce((s, i) => s + i.total, 0);

  return (
    <>
      <PageHeader
        title="Faturalar"
        description="Kesilen tüm faturalar. Ödeme gelince faturayı açıp ödendi olarak işaretleyin."
        actions={<Link className="btn" href="/yonetim/faturalar/yeni"><Icon name="plus" size={18} />Fatura kes</Link>}
      />
      <div className="stats">
        <Stat hero label="Tahsil edilecek" icon="wallet" value={formatMoney(sum(["pending", "overdue"]))} note={`${invoices.filter((i) => i.state === "pending" || i.state === "overdue").length} fatura`} />
        <Stat label="Vadesi geçen" icon="calendar" value={formatMoney(sum(["overdue"]))} note={`${invoices.filter((i) => i.state === "overdue").length} fatura`} alert={sum(["overdue"]) > 0} href="/yonetim/faturalar?durum=geciken" />
        <Stat label="Bu ay tahsil edilen" icon="check" value={formatMoney(collected)} />
      </div>
      <nav className="tabs" aria-label="Faturaları filtrele">
        {FILTERS.map((f) => (
          <Link key={f.param} href={`/yonetim/faturalar?durum=${f.param}`} aria-current={f === current ? "page" : undefined}>
            {f.label}<b>{invoices.filter((i) => f.states.includes(i.state)).length}</b>
          </Link>
        ))}
      </nav>
      <InvoiceList invoices={invoices.filter((i) => current.states.includes(i.state))} basePath="/yonetim/faturalar" showCompany />
    </>
  );
}
