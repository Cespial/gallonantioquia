import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as esquema from "./esquema";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

const conexion = neon(process.env.DATABASE_URL);

export const db = drizzle(conexion, { schema: esquema });
