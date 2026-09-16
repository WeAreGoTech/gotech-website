import { mkdirSync } from "node:fs";
import path from "node:path";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { seedDemoData } from "./seed";

export type Database = PostgresJsDatabase<typeof schema>;

const MIGRATIONS_DIR = path.join(process.cwd(), "drizzle");
const PGLITE_DIR = path.join(process.cwd(), ".data", "pglite");

async function connect(): Promise<Database> {
  if (env.databaseUrl) {
    const db = drizzle(postgres(env.databaseUrl), { schema });
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
    return db;
  }

  // Development: embedded Postgres (PGlite) on disk, no database server needed.
  const { PGlite } = await import("@electric-sql/pglite");
  const pglite = await import("drizzle-orm/pglite");
  const pgliteMigrator = await import("drizzle-orm/pglite/migrator");
  mkdirSync(PGLITE_DIR, { recursive: true });
  const local = pglite.drizzle(new PGlite(PGLITE_DIR), { schema });
  await pgliteMigrator.migrate(local, { migrationsFolder: MIGRATIONS_DIR });
  // Both drivers expose the same query builder; the cast keeps a single Database type.
  const db = local as unknown as Database;
  if (!env.isProduction) await seedDemoData(db);
  return db;
}

// One connection per process, shared across Next.js bundles and hot reloads.
const globalForDb = globalThis as unknown as { gotechDb?: Promise<Database> };

export function getDb(): Promise<Database> {
  globalForDb.gotechDb ??= connect().catch((error) => {
    globalForDb.gotechDb = undefined;
    throw error;
  });
  return globalForDb.gotechDb;
}
