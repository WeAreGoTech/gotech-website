"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

const SIDEBAR_ID = "panel-sidebar";

/**
 * On phones and portrait tablets the sidebar becomes a slide-in drawer opened from a top bar.
 * On wider screens the bar is hidden and the sidebar sits in the grid as before (see app.css).
 */
export function ShellFrame({ bar, children }: { bar: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  // navigating closes the drawer
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("is-drawer-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-drawer-open");
    };
  }, [open]);

  function toggle() {
    setOpenedAt(pathname);
    setOpen(!open);
  }

  return (
    <>
      <header className="mobile-bar">
        {bar}
        <button className="icon-btn mobile-menu-btn" type="button" aria-controls={SIDEBAR_ID} aria-expanded={open} aria-label={open ? "Menüyü kapat" : "Menüyü aç"} onClick={toggle}>
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </header>
      <div className={`sidebar-frame${open ? " is-open" : ""}`} id={SIDEBAR_ID}>
        <div className="sidebar-overlay" aria-hidden="true" onClick={() => setOpen(false)} />
        {children}
      </div>
    </>
  );
}
