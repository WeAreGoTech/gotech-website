# GoTech web

Landing page, customer panel (support tickets) and team panel in one Next.js app.

| Address | Who | What |
| --- | --- | --- |
| `/` | Visitors | Landing page, contact form |
| `/giris` | Customers and team | Login |
| `/panel` | Customers | Overview, support tickets (with rating), projects, invoices (printable), documents, colleagues, account |
| `/yonetim` | GoTech team | Overview, tickets, contact form submissions (convert to customer), customers, projects, invoices, team, sent mails, account |

Everything a customer sees is scoped to their own company. Document downloads (`/dokuman/[id]`) generate a sample PDF: the mockup stores document records, not files.

## Development

```bash
pnpm install
pnpm dev
```

No database server is needed locally: without `DATABASE_URL` the app uses an embedded Postgres (PGlite) in `.data/pglite`, runs migrations and creates demo data on first start. Demo logins are shown on `/giris`.

To start over with fresh demo data, stop `pnpm dev` and delete `.data/`.

Mail is in test mode until `SMTP_HOST` is set: nothing is sent, every mail is listed at `/yonetim/mailler` (invite links can be opened from there).

## Configuration

Copy `.env.example` to `.env` and fill in what you need. On the server, set at least `SITE_URL`, `DATABASE_URL`, `NOTIFY_EMAIL` and the `SMTP_*` values.

## Changing the database

1. Edit `src/db/schema.ts`
2. `pnpm db:generate` writes a new SQL migration into `drizzle/`
3. Migrations run automatically when the app starts

## Production (VPS)

```bash
pnpm build
pnpm start
```

- Put it behind HTTPS (nginx or Caddy). The session cookie is `secure` in production, so login does not work over plain http.
- Create the first team account, then open the printed link to set its password:

```bash
pnpm create-staff "Ad Soyad" ad@gotech.com.tr
```

- Demo data is only created in development with the embedded database.
- Rate limits (login, contact form) are kept in memory, which is fine for a single app instance.

## Layout

```
src/app/(site)       landing page
src/app/(app)        login, set password, /panel, /yonetim
src/components/site  landing sections and scroll animation
src/components/app   panel shell, ticket views, forms
src/features/*       server actions and queries per area (tickets, leads, customers, auth, mail log)
src/lib              session auth, mail sending and templates, env, rate limiting
src/db               schema, connection, demo seed
drizzle/             SQL migrations
```
