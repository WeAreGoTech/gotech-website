import type { Person } from "@/features/customers/queries";
import { Avatar } from "./Icon";

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
};

export function PeopleList({ people, tone, youId, resendAction, deviceCounts, controls }: PeopleListProps) {
  // a company always keeps one firma yetkilisi, so the last one can be neither demoted nor removed
  const adminCount = people.filter((p) => p.isCompanyAdmin).length;
  const isLastAdmin = (person: { isCompanyAdmin?: boolean }) => Boolean(person.isCompanyAdmin) && adminCount <= 1;

  return (
    <ul className="w-list">
      {people.map((person) => (
        <li key={person.id} className="w-row people-row">
          <Avatar name={person.name} tone={tone} />
          <span className="w-row-main">
            <strong>{person.name}{person.id === youId ? " (siz)" : ""}</strong>
            <small>{[person.title, person.email, person.phone, deviceCounts?.[person.id] && `${deviceCounts[person.id]} bilgisayar`].filter(Boolean).join(", ")}</small>
          </span>
          <span className="row-actions">
            {person.isCompanyAdmin && <span className="badge is-admin">Firma yetkilisi</span>}
            {person.active ? (
              <span className="badge is-active">Aktif</span>
            ) : (
              <>
                <span className="badge is-mock">Davet bekliyor</span>
                {resendAction && (
                  <form action={resendAction(person.id)}>
                    <button className="btn btn-ghost btn-small" type="submit">Yeniden gönder</button>
                  </form>
                )}
              </>
            )}
            {controls && (
              <>
                {person.isCompanyAdmin ? (
                  !isLastAdmin(person) && (
                    <form action={controls.demote(person.id)}>
                      <button className="btn btn-ghost btn-small" type="submit">Yetkiyi al</button>
                    </form>
                  )
                ) : (
                  <form action={controls.promote(person.id)}>
                    <button className="btn btn-ghost btn-small" type="submit">Yetkili yap</button>
                  </form>
                )}
                {person.id !== youId && !isLastAdmin(person) && (
                  <form action={controls.remove(person.id)}>
                    <button className="btn btn-ghost btn-small" type="submit" title="Kişiyi firmadan çıkar">Çıkar</button>
                  </form>
                )}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

type RemovedPerson = { id: string; name: string; email: string };

/** People taken out of the company, with a way back in. */
export function RemovedPeopleList({ people, restore }: { people: RemovedPerson[]; restore: PersonAction }) {
  if (people.length === 0) return null;
  return (
    <div className="removed-people">
      <h3>Çıkarılanlar</h3>
      <ul className="w-list">
        {people.map((person) => (
          <li key={person.id} className="w-row people-row is-removed">
            <Avatar name={person.name} tone="customer" />
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
      <p className="desk-hint">Geri alınan kişi eski şifresiyle girer ve firma yetkilisi olmaz.</p>
    </div>
  );
}

/** Warning a people action sent the page back with, e.g. when the last firma yetkilisi cannot be removed. */
export function PeopleNotice({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="notice">{message}</p>;
}
