import type { Person } from "@/features/customers/queries";
import { Avatar } from "./Icon";

type PeopleListProps = {
  people: (Omit<Person, "phone"> & { phone?: string | null })[];
  tone: "team" | "customer";
  youId?: string;
  resendAction?: (personId: string) => () => Promise<void>;
};

export function PeopleList({ people, tone, youId, resendAction }: PeopleListProps) {
  return (
    <ul className="w-list">
      {people.map((person) => (
        <li key={person.id} className="w-row people-row">
          <Avatar name={person.name} tone={tone} />
          <span className="w-row-main">
            <strong>{person.name}{person.id === youId ? " (siz)" : ""}</strong>
            <small>{[person.title, person.email, person.phone].filter(Boolean).join(", ")}</small>
          </span>
          <span className="row-actions">
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
          </span>
        </li>
      ))}
    </ul>
  );
}
