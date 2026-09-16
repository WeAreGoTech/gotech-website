import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/features/auth/actions";
import type { SessionUser } from "@/lib/auth/session";
import { Avatar, Icon } from "./Icon";
import { SideNavLinks, type SideNavLink } from "./SideNavLinks";

type AppShellProps = { area: string; user: SessionUser; links: SideNavLink[]; cta?: { href: string; label: string }; children: ReactNode };

export function AppShell({ area, user, links, cta, children }: AppShellProps) {
  return (
    <div className="shell wise">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="logo">GoTech</span>
          <small>{area}</small>
        </div>
        {cta && (
          <Link className="btn sidebar-cta" href={cta.href}>
            <Icon name="plus" size={18} />
            {cta.label}
          </Link>
        )}
        <SideNavLinks links={links} />
        <div className="side-user">
          <Avatar name={user.name} tone={user.role === "staff" ? "team" : "customer"} />
          <div className="side-user-name">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <form action={logout}>
            <button className="icon-btn" type="submit" aria-label="Çıkış yap" title="Çıkış yap">
              <Icon name="logout" size={18} />
            </button>
          </form>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

type PageHeaderProps = { title: ReactNode; description?: ReactNode; actions?: ReactNode; back?: { href: string; label: string } };

export function PageHeader({ title, description, actions, back }: PageHeaderProps) {
  return (
    <header className="page-head">
      <div>
        {back && <BackButton {...back} />}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions}
    </header>
  );
}

export function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link className="icon-btn t-back" href={href} aria-label={label} title={label}>
      <Icon name="arrowLeft" />
    </Link>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="card empty">
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
