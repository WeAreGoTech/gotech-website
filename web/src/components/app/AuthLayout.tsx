import Link from "next/link";
import type { ReactNode } from "react";

export function AuthLayout({ heading, text, children }: { heading: ReactNode; text: string; children: ReactNode }) {
  return (
    <div className="auth wise">
      <div className="auth-card">
        <div className="auth-top">
          <Link className="logo" href="/" aria-label="GoTech ana sayfa">
            {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG, nothing for next/image to optimize */}
            <img src="/brand/gotech-logo.svg" alt="GoTech" width={180} height={58} />
          </Link>
          <Link href="/">Ana sayfa</Link>
        </div>
        <h1>{heading}</h1>
        <p className="lead">{text}</p>
        {children}
      </div>
    </div>
  );
}
