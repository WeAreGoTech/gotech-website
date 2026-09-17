import type { AttachmentView } from "@/features/attachments/queries";
import type { ProjectUpdate } from "@/features/projects/queries";
import { formatDateTime } from "./format";
import { Avatar, Icon } from "./Icon";
import { MessageAttachments } from "./MessageAttachments";

type ProjectUpdatesProps = {
  updates: ProjectUpdate[];
  // by update id
  attachments: Record<string, AttachmentView[]>;
  /** the team member reading the page; only they can remove their own notes */
  viewerId?: string;
  deleteAction?: (updateId: string) => (formData: FormData) => Promise<void>;
};

/** Progress notes, newest first. Internal ones are only ever passed in for the team. */
export function ProjectUpdates({ updates, attachments, viewerId, deleteAction }: ProjectUpdatesProps) {
  if (updates.length === 0) return <p className="muted">Henüz ilerleme notu yok.</p>;
  return (
    <ol className="updates">
      {updates.map((update) => (
        <li key={update.id} className={`update${update.isInternal ? " is-internal" : ""}`}>
          <Avatar name={update.authorName} tone="team" small />
          <div className="update-body">
            <div className="update-head">
              <strong>{update.authorName}</strong>
              {update.isInternal && <span className="badge is-note"><Icon name="lock" size={12} />İç not</span>}
              <time dateTime={update.createdAt.toISOString()}>{formatDateTime(update.createdAt)}</time>
              {deleteAction && update.authorId === viewerId && (
                <form action={deleteAction(update.id)}>
                  <button className="icon-btn update-remove" type="submit" aria-label="Notu sil" title="Notu sil"><Icon name="close" size={16} /></button>
                </form>
              )}
            </div>
            <p>{update.body}</p>
            <MessageAttachments attachments={attachments[update.id]} />
          </div>
        </li>
      ))}
    </ol>
  );
}
