import type { Person } from "@/features/customers/queries";
import { Avatar } from "./Icon";
import { SetupLinkButton } from "./setup-link-button";

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
};

export function PeopleList({ people, tone, youId, resendAction, deviceCounts, controls, removeAction, setupLinks = false }: PeopleListProps) {
  // a company always keeps one firma yetkilisi, so the last one can be neither demoted nor removed
  const adminCount = people.filter((p) => p.isCompanyAdmin).length;
  const isLastAdmin = (person: { isCompanyAdmin?: boolean }) => Boolean(person.isCompanyAdmin) && adminCount <= 1;

  return (
    <ul className="w-list">
      {people.map((person) => {
        const hasActions = Boolean((!person.active && resendAction) || setupLinks || controls || (removeAction && person.id !== youId));
        return (
          <li key={person.id} className="people-row">
            {/* Satır sade kalsın diye işlemler tıklanınca açılır. <details> kullanıldığı için
                JavaScript gerekmez ve bileşen sunucu bileşeni olarak kalır. */}
            <details className="person">
              <summary className="person-head">
                <Avatar name={person.name} tone={tone} />
                <span className="w-row-main">
                  <strong>{person.name}{person.id === youId ? " (siz)" : ""}</strong>
                  <small>{[person.title, person.email, person.phone, deviceCounts?.[person.id] && `${deviceCounts[person.id]} bilgisayar`].filter(Boolean).join(", ")}</small>
                </span>
                <span className="person-badges">
                  {person.isCompanyAdmin && <span className="badge is-admin">Firma yetkilisi</span>}
                  {person.active ? <span className="badge is-active">Aktif</span> : <span className="badge is-mock">Davet bekliyor</span>}
                  {hasActions && <span className="person-caret" aria-hidden>›</span>}
                </span>
              </summary>

              {hasActions && (
                <div className="person-actions">
                  {!person.active && resendAction && (
                    <form action={resendAction(person.id)}>
                      <button className="btn btn-ghost btn-small" type="submit">Daveti yeniden gönder</button>
                    </form>
                  )}
                  {setupLinks && <SetupLinkButton personId={person.id} />}
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
                          <button className="btn btn-ghost btn-small is-danger" type="submit" title="Kişiyi firmadan çıkar">Firmadan çıkar</button>
                        </form>
                      )}
                    </>
                  )}
                  {removeAction && person.id !== youId && (
                    <form action={removeAction(person.id)}>
                      <button className="btn btn-ghost btn-small is-danger" type="submit" title="Paneli, GoTech Desk oturumu ve ekip bilgisayarları kapanır">Ekipten çıkar</button>
                    </form>
                  )}
                  {isLastAdmin(person) && <p className="person-hint">Firmanın tek yetkilisi; yetkisi alınamaz ve çıkarılamaz.</p>}
                </div>
              )}
            </details>
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
