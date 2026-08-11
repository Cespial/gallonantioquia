import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const valor = process.argv[2] === "on" ? "true" : "false";
await sql`insert into ajustes (clave, valor) values ('sitio.enConstruccion', ${valor}::jsonb)
          on conflict (clave) do update set valor = excluded.valor, actualizado_en = now()`;
console.log("modo construcción =", valor);
