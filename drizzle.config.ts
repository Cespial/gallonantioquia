import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/esquema.ts",
  out: "./src/db/migraciones",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
