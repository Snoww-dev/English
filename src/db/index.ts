import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | null = null;

function getDb(): Db {
  if (!instance) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Add it in Vercel Project Settings -> Environment Variables (or .env.local for local dev).",
      );
    }
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    instance = drizzle(client, { schema });
  }
  return instance;
}

// Lazy: the DATABASE_URL check only runs on first query, not at module import
// time — otherwise importing this file (e.g. to collect route config) fails
// the Vercel build before the env var is even configured.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});
