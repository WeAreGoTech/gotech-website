import { Fragment } from "react";
import type { TicketMessage } from "@/features/tickets/queries";
import { dayKey, dayLabel, formatTime } from "./format";
import { Avatar, Icon } from "./Icon";

type ConversationProps = { messages: TicketMessage[]; viewerId: string; viewerRole: "staff" | "customer" };

/** Chat-style thread: the viewer's own messages on the right, a day label whenever the date changes. */
export function Conversation({ messages, viewerId, viewerRole }: ConversationProps) {
  return (
    <div className="convo-log" role="log" aria-label="Yazışma">
      {messages.map((m, i) => {
        const newDay = i === 0 || dayKey(messages[i - 1].createdAt) !== dayKey(m.createdAt);
        const fromTeam = m.authorRole === "staff";
        const name = fromTeam && viewerRole === "customer" ? `${m.authorName}, GoTech` : m.authorName;
        const at = <time dateTime={m.createdAt.toISOString()}>{formatTime(m.createdAt)}</time>;

        return (
          <Fragment key={m.id}>
            {newDay && <p className="day">{dayLabel(m.createdAt)}</p>}
            {m.isInternal ? (
              <div className="inote">
                <Icon name="lock" size={18} />
                <div>
                  <strong>İç not, {m.authorName}. Müşteri görmez.</strong>
                  <p>{m.body}</p>
                  {at}
                </div>
              </div>
            ) : m.authorId === viewerId ? (
              <div className="bubble-row is-mine">
                <div className="bubble"><p>{m.body}</p>{at}</div>
              </div>
            ) : (
              <div className="bubble-row">
                <Avatar name={m.authorName} tone={fromTeam ? "team" : "customer"} small />
                <div className="bubble">
                  <span className="bubble-name">{name}</span>
                  <p>{m.body}</p>
                  {at}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
