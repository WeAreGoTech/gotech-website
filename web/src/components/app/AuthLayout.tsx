import Link from "next/link";
import type { ReactNode } from "react";

export function AuthLayout({ heading, text, children }: { heading: ReactNode; text: string; children: ReactNode }) {
  return (
    <div className="auth wise">
      <div className="auth-card">
        <div className="auth-top">
          <Link className="logo" href="/">GoTech</Link>
          <Link href="/">Ana sayfa</Link>
        </div>
        <h1>{heading}</h1>
        <p className="lead">{text}</p>
        {children}
      </div>
    </div>
  );
}
