"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, Icon } from "./Icon";

// search: the company and its people's names and e-mails, lower-cased in Turkish
export type CompanyRow = { id: string; name: string; people: number; activeProjects: number; openTickets: number; closed: boolean; search: string };

const normalize = (value: string) => value.toLocaleLowerCase("tr-TR").trim();

function Rows({ rows, empty }: { rows: CompanyRow[]; empty?: string }) {
  return (
    <ul className="w-list">
      {rows.length === 0 && empty && <li className="empty-row">{empty}</li>}
      {rows.map((row) => (
        <li key={row.id}>
          <Link className={`w-row${row.closed ? " is-closed" : ""}`} href={`/yonetim/musteriler/${row.id}`}>
            <Avatar name={row.name} tone="customer" />
            <span className="w-row-main">
              <strong>{row.name}</strong>
              <small>{row.closed ? "Kapalı" : `${row.people} kişi · ${row.activeProjects} süren proje`}</small>
            </span>
            {row.openTickets > 0 && <span className="badge is-alert">{row.openTickets} açık talep</span>}
            <span className="w-chevron" aria-hidden>
              <Icon name="chevronRight" size={18} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Every customer company, filtered as you type by its name or a person's name or e-mail. */
export function CompanyList({ rows }: { rows: CompanyRow[] }) {
  const [query, setQuery] = useState("");
  const needle = normalize(query);
  const shown = needle ? rows.filter((row) => row.search.includes(needle)) : rows;
  const closed = shown.filter((row) => row.closed);

  return (
    <>
      <label className="w-search">
        <Icon name="search" />
        <span className="sr-only">Firma ya da kişi ara</span>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Firma, kişi ya da e-posta ara" autoComplete="off" />
      </label>
      <Rows rows={shown.filter((row) => !row.closed)} empty={needle ? "Aramanızla eşleşen firma yok." : "Henüz müşteri yok."} />
      {closed.length > 0 && (
        <div className="w-group">
          <h3 className="w-group-title">Kapatılan firmalar</h3>
          <Rows rows={closed} />
        </div>
      )}
    </>
  );
}
