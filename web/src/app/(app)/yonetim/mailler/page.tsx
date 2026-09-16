import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/app/AppShell";
import { formatDateTime } from "@/components/app/format";
import { Linkify } from "@/components/app/Linkify";
import { listRecentMails } from "@/features/mail-log/queries";
import { requireStaff } from "@/lib/auth/session";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Giden mailler" };

export default async function MailLogPage() {
  await requireStaff();
  const mails = await listRecentMails();
  const testMode = !env.smtp.host;

  return (
    <>
      <PageHeader
        title="Giden mailler"
        description={
          testMode
            ? "Test modu açık: mailler gönderilmiyor, yalnızca burada listeleniyor. SMTP bilgileri girildiğinde gerçek gönderime geçer."
            : "Sistemin gönderdiği son 100 mail. Gönderilemeyenler hata nedeniyle birlikte görünür."
        }
      />
      {mails.length === 0 ? (
        <EmptyState title="Henüz mail yok" text="Başvuru, destek talebi ya da davet olduğunda gönderilen mailler burada görünür." />
      ) : (
        <div className="list">
          {mails.map((mail) => (
            <details key={mail.id} className="list-item mail">
              <summary>
                <strong style={{ fontWeight: 500 }}>{mail.subject}</strong>
                <span>
                  {mail.error ? <span className="badge is-failed">Gönderilemedi</span> : mail.transport === "mock" ? <span className="badge is-mock">Test</span> : <span className="badge is-smtp">Gönderildi</span>}
                </span>
                <span className="muted">Alıcı: {mail.to}</span>
                <span className="muted">{formatDateTime(mail.createdAt)}</span>
              </summary>
              {mail.error && <p className="form-message is-error" style={{ marginTop: 12 }}>{mail.error}</p>}
              <pre><Linkify text={mail.body} /></pre>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
