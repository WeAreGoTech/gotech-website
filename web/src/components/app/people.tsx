import type { Person } from "@/features/customers/queries";
import { Avatar } from "./Icon";
import { PersonRow, type PersonActions } from "./person-sheet";

type PersonAction = (personId: string) => () => Promise<void>;

/** The three controls the company admin and GoTech staff share on a company's people. */
export type PeopleControls = { promote: PersonAction; demote: PersonAction; remove: PersonAction };

type PeopleListProps = {
  // staff rows have neither a phone nor a company admin flag
  people: (Omit<Person, "phone" | "isCompanyAdmin"> & { phone?: string | null; isCompanyAdmin?: boolean })[];
  tone: "team" | "customer";
  youId?: string;
  resendAction?: PersonAction;
  // GoTech Desk computers linked to each person, by user ID
  deviceCounts?: Record<string, number>;
  controls?: PeopleControls;
  // GoTech's own people have no firma yetkilisi to manage, only a way out
  removeAction?: PersonAction;
  // staff pages: each person's one-click GoTech Desk setup link
  setupLinks?: boolean;
  // staff pages of customer companies: a way to set a new password for people who lost theirs
  passwordReset?: boolean;
  // a customer's own Ekibim page keeps one firma yetkilisi; GoTech staff may take out anyone
  keepAnAdmin?: boolean;
};

export function PeopleList({ people, tone, youId, resendAction, deviceCounts, controls, removeAction, setupLinks = false, passwordReset = false, keepAnAdmin = true }: PeopleListProps) {
  // where a company must keep one firma yetkilisi, the last one can be neither demoted nor removed
  const adminCount = people.filter((p) => p.isCompanyAdmin).length;

  return (
    <ul className="w-list">
      {people.map((person) => {
        const isYou = person.id === youId;
        const lastAdmin = keepAnAdmin && Boolean(person.isCompanyAdmin) && adminCount <= 1;
        const actions: PersonActions = {
          resend: !person.active && resendAction ? resendAction(person.id) : undefined,
          setupLink: setupLinks,
          passwordReset,
          promote: controls && !person.isCompanyAdmin ? controls.promote(person.id) : undefined,
          demote: controls && person.isCompanyAdmin && !lastAdmin ? controls.demote(person.id) : undefined,
          remove:
            controls && !isYou && !lastAdmin
              ? { action: controls.remove(person.id), label: "Firmadan çıkar", note: "Panele ve GoTech Desk'e giremez; geçmişi kalır, geri alınabilir." }
              : removeAction && !isYou
                ? { action: removeAction(person.id), label: "Ekipten çıkar", note: "Paneli, GoTech Desk oturumu ve ekip bilgisayarları kapanır." }
                : undefined,
          lastAdmin: Boolean(controls) && lastAdmin,
        };
        return (
          <li key={person.id}>
            <PersonRow
              person={{ id: person.id, name: person.name, email: person.email, title: person.title, phone: person.phone, isCompanyAdmin: person.isCompanyAdmin, active: person.active }}
              tone={tone}
              you={isYou}
              devices={deviceCounts?.[person.id]}
              actions={actions}
            />
          </li>
        );
      })}
    </ul>
  );
}

type RemovedPerson = { id: string; name: string; email: string };

const CUSTOMER_RESTORE_HINT = "Geri alınan kişi eski şifresiyle girer ve firma yetkilisi olmaz.";

/** People taken out of the company (or of GoTech's team), with a way back in. */
export function RemovedPeopleList({
  people,
  restore,
  tone = "customer",
  hint = CUSTOMER_RESTORE_HINT,
}: {
  people: RemovedPerson[];
  restore: PersonAction;
  tone?: "team" | "customer";
  hint?: string;
}) {
  if (people.length === 0) return null;
  return (
    <div className="removed-people">
      <h3>Çıkarılanlar</h3>
      <ul className="w-list">
        {people.map((person) => (
          <li key={person.id} className="w-row people-row is-removed">
            <Avatar name={person.name} tone={tone} />
            <span className="w-row-main">
              <strong>{person.name}</strong>
              <small>{person.email}</small>
            </span>
            <span className="row-actions">
              <form action={restore(person.id)}>
                <button className="btn btn-ghost btn-small" type="submit">Geri al</button>
              </form>
            </span>
          </li>
        ))}
      </ul>
      <p className="desk-hint">{hint}</p>
    </div>
  );
}

/** Warning a people action sent the page back with, e.g. when the last firma yetkilisi cannot be removed. */
export function PeopleNotice({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="notice">{message}</p>;
}
