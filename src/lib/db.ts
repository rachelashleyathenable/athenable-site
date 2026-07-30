import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

function getSql() {
  if (!cached) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Missing environment variable: DATABASE_URL");
    }
    cached = neon(process.env.DATABASE_URL);
  }
  return cached;
}

export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  getSql()(...args)) as NeonQueryFunction<false, false>;
