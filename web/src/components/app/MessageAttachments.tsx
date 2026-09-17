import type { AttachmentView } from "@/features/attachments/queries";
import { attachmentHref, kindOfMime } from "@/features/attachments/rules";
import { formatBytes } from "./format";
import { Icon } from "./Icon";

/** Files under a message: images as thumbnails, videos as players, everything else as a download chip. */
export function MessageAttachments({ attachments }: { attachments?: AttachmentView[] }) {
  if (!attachments?.length) return null;
  return (
    <ul className="attachments" aria-label="Ekler">
      {attachments.map((a) => {
        const href = attachmentHref(a.id);
        const kind = kindOfMime(a.mimeType);
        return (
          <li key={a.id} className={`attachment is-${kind}`}>
            {kind === "image" && (
              <a className="attachment-thumb" href={href} target="_blank" rel="noopener" title={a.name}>
                {/* next/image would copy a private, per-user file into its public optimizer cache */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={href} alt={a.name} loading="lazy" />
              </a>
            )}
            {kind === "video" && (
              <video className="attachment-video" src={href} controls preload="metadata" aria-label={a.name} />
            )}
            <a className="attachment-chip" href={href} download={a.name}>
              <Icon name={kind === "file" ? "file" : "download"} size={16} />
              <span className="attachment-name">{a.name}</span>
              <small>{formatBytes(a.sizeBytes)}</small>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
