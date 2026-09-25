"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, Icon } from "./Icon";

// search: the company and its people's names and e-mails, lower-cased in Turkish
export type CompanyRow = { id: string; name: string; people: number; activeProjects: number; openTickets: number; search: string };

const normalize = (value: string) => value.toLocaleLowerCase("tr-TR").trim();

/** Every customer company, filtered as you type by its name or a person's name or e-mail. */
export function CompanyList({ rows }: { rows: CompanyRow[] }) {
  const [query, setQuery] = useState("");
  const needle = normalize(query);
  const shown = needle ? rows.filter((row) => row.search.includes(needle)) : rows;

  return (
    <>
      <label className="w-search">
        <Icon name="search" />
        <span className="sr-only">Firma ya da kişi ara</span>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Firma, kişi ya da e-posta ara" autoComplete="off" />
      </label>
      <ul className="w-list">
        {shown.length === 0 && <li className="empty-row">{needle ? "Aramanızla eşleşen firma yok." : "Henüz müşteri yok."}</li>}
        {shown.map((row) => (
          <li key={row.id}>
            <Link className="w-row" href={`/yonetim/musteriler/${row.id}`}>
              <Avatar name={row.name} tone="customer" />
              <span className="w-row-main">
                <strong>{row.name}</strong>
                <small>
                  {row.people} kişi · {row.activeProjects} süren proje
                </small>
              </span>
              {row.openTickets > 0 && <span className="badge is-alert">{row.openTickets} açık talep</span>}
              <span className="w-chevron" aria-hidden>
                <Icon name="chevronRight" size={18} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
