import type { DocumentKind } from "@/db/schema";
import { DOCUMENT_KIND_LABELS } from "@/features/documents/labels";
import type { DocumentRow } from "@/features/documents/queries";
import { formatBytes, formatDate } from "@/lib/format";
import { Icon, type IconName } from "./Icon";

const KIND_ICONS: Record<DocumentKind, IconName> = { contract: "lock", proposal: "sparkle", guide: "file", report: "form" };

export function DocumentList({ documents, showCompany = false }: { documents: DocumentRow[]; showCompany?: boolean }) {
  return (
    <ul className="w-list">
      {documents.length === 0 && <li className="empty-row">Henüz doküman yok.</li>}
      {documents.map((doc) => (
        <li key={doc.id}>
          <a className="w-row" href={`/dokuman/${doc.id}`} target="_blank" rel="noopener">
            <span className="w-icon"><Icon name={KIND_ICONS[doc.kind]} size={18} /></span>
            <span className="w-row-main">
              <strong>{doc.title}</strong>
              <small>
                {showCompany ? `${doc.companyName}, ` : ""}
                {DOCUMENT_KIND_LABELS[doc.kind]}
                {doc.projectName ? `, ${doc.projectName}` : ""}. {formatDate(doc.createdAt)}, {formatBytes(doc.sizeBytes)}
              </small>
            </span>
            <span className="w-row-side">
              <span className="icon-btn" aria-hidden="true"><Icon name="download" size={18} /></span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
