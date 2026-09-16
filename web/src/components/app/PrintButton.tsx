"use client";

import { Icon } from "./Icon";

export function PrintButton({ label = "Yazdır / PDF kaydet" }: { label?: string }) {
  return (
    <button className="btn btn-ghost" type="button" onClick={() => window.print()}>
      <Icon name="printer" size={18} />
      {label}
    </button>
  );
}
