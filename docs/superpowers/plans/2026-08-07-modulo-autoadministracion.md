# Módulo de autoadministración — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la edición de arreglos de TypeScript por un panel en `/admin` donde el equipo de campaña publique contenido, suba fotos y configure el sitio sin tocar código ni esperar un despliegue.

**Architecture:** Se conserva Next.js 14.2 App Router. Se agrega Postgres (Neon) accedido con Drizzle, imágenes en Vercel Blob y sesión con Auth.js v5 sobre credenciales. Las seis secciones editoriales comparten una tabla `contenidos` con discriminador `tipo`, servida por una única pantalla de CRUD parametrizada. El sitio público sigue siendo Server Components y lee la base a través de `unstable_cache` con etiquetas; publicar dispara `revalidateTag`, de modo que el cambio sale al aire en segundos sin rebuild y sin una consulta a la base por visita.

**Tech Stack:** Next.js 14.2, React 18, TypeScript 5, Tailwind 3, Drizzle ORM, Neon Postgres, Vercel Blob, Auth.js v5 (next-auth beta), bcryptjs, Zod, Tiptap, sanitize-html, Vitest + PGlite.

**Spec:** `docs/superpowers/specs/2026-08-07-modulo-autoadministracion-design.md`

## Global Constraints

Estas reglas aplican a **todas** las tareas. No se repiten en cada una.

- **No se actualiza Next.js.** El módulo se construye sobre `next@14.2.35` y `react@18`. No introducir APIs de Next 15+.
- **Gestor de paquetes: `npm`.** El repositorio tiene `package-lock.json`. No usar pnpm ni yarn.
- **Todo el texto visible va en español**, con tildes correctas, incluidos mensajes de error, etiquetas de formulario y textos de botón. El panel lo usan Diego y Walter, que no son técnicos.
- **Nombres de tablas, columnas y campos de datos en español** (`contenidos`, `creado_en`, `eliminado_en`). Nombres de símbolos de TypeScript en español también, para no mezclar idiomas dentro de un archivo.
- **TDD estricto.** Cada tarea escribe primero la prueba que falla, verifica que falle, implementa lo mínimo, verifica que pase y comitea. No se implementa nada sin prueba previa.
- **Toda Server Action verifica sesión y rol en el servidor**, con `await requerirSesion()` o `await requerirAdmin()` como primera línea. Ocultar un botón en la interfaz nunca es el control de acceso.
- **Toda entrada de usuario se valida con Zod** antes de llegar a la base de datos.
- **Ninguna contraseña ni hash aparece en logs, respuestas ni props de cliente.**
- **Un commit por tarea**, con mensaje descriptivo en español y prefijo de convención (`feat:`, `test:`, `fix:`, `docs:`, `chore:`). La frase nominal (`feat: esquema de base de datos`) es la forma que usa este plan y es válida; no hace falta el imperativo. Un commit `fix:` adicional que corrija algo detectado por las verificaciones de cierre (pruebas, typecheck) **no viola esta regla**: preservar el ciclo fallo → arreglo es preferible a reescribir la historia con `--amend`.
- **La salida de `npm test` debe estar limpia**, sin avisos. Un aviso recurrente se multiplica por 19 tareas y entrena al equipo a ignorar la salida.
- **`npm run typecheck` (`tsc --noEmit`) debe pasar al cerrar cada tarea, incluidas las pruebas.** `tsconfig.json` incluye `**/*.ts`, así que `next build` type-chequea también `tests/`: un error de tipos en una prueba tumba el despliegue. Ojo con los objetos de fixture reutilizados — TypeScript infiere `tipo: string` en vez del literal del enum y Drizzle los rechaza. Declararlos con `as const` en el campo del enum, o tipar el fixture con `satisfies NuevoContenido`.
- **Rama de trabajo:** `feat/modulo-autoadministracion`, ya creada.
- **Sin atribución a Claude** en los mensajes de commit.

## Variables de entorno

Se agregan a Vercel (Production, Preview y Development) y a `.env.local` en local. `.gitignore` ya excluye `.env*.local`.

| Variable | Origen | Uso |
|---|---|---|
| `DATABASE_URL` | Neon, cadena *pooled* | Conexión de la aplicación |
| `DATABASE_URL_UNPOOLED` | Neon, cadena directa | Migraciones de `drizzle-kit` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | Subida de imágenes |
| `AUTH_SECRET` | `npx auth secret` | Firma de la sesión |
| `AUTH_URL` | URL del despliegue | Auth.js en producción |

## Estructura de archivos

Qué se crea y de qué responde cada cosa. Los archivos que cambian juntos viven juntos: la lógica se agrupa por dominio (contenidos, medios, ajustes, auth), no por capa técnica.

```
src/db/
  esquema.ts                  Tablas Drizzle. Fuente de verdad del modelo de datos.
  index.ts                    Cliente Neon para la aplicación.
  migraciones/                Generadas por drizzle-kit. No editar a mano.

src/lib/admin/
  tipos.ts                    Configuración de los 6 tipos de contenido. Fuente de verdad
                              del panel: etiquetas, rutas, taxonomías, campos de `extra`.
  esquemas.ts                 Validadores Zod derivados de tipos.ts.
  slug.ts                     Generación de slug desde el título.
  sanitizar.ts                Limpieza del HTML del editor.

src/lib/auth/
  password.ts                 Hash y verificación con bcryptjs.
  config.ts                   Configuración de Auth.js.
  sesion.ts                   requerirSesion() y requerirAdmin().

src/lib/contenidos/
  consultas.ts                Lecturas cacheadas que consume el sitio público.
  acciones.ts                 Server Actions del panel (crear, editar, publicar, borrar).

src/lib/medios/
  acciones.ts                 Server Actions de la biblioteca.
  procesar-imagen.ts          Redimensionado y conversión a WebP, se ejecuta en el navegador.

src/lib/ajustes/
  index.ts                    Lectura cacheada, escritura y valores por defecto.
  claves.ts                   Claves de ajuste y sus esquemas Zod.

src/app/admin/
  layout.tsx                  Envoltura del panel: barra lateral, sesión, cierre de sesión.
  page.tsx                    Resumen.
  login/page.tsx              Formulario de acceso (fuera del layout protegido).
  [seccion]/page.tsx          Listado parametrizado de las 6 secciones.
  [seccion]/[id]/page.tsx     Editor de un contenido.
  medios/page.tsx             Biblioteca de imágenes.
  ajustes/page.tsx            Configuración del sitio.
  usuarios/page.tsx           Gestión de usuarios (solo admin).
  papelera/page.tsx           Contenido borrado.

src/components/admin/         Interfaz del panel, aislada de los componentes públicos.

middleware.ts                 Protege /admin/*.
scripts/migrar-contenido.ts   Migración de una sola corrida.
tests/                        Pruebas Vitest.
```

**Nota sobre `[seccion]`:** en Next.js los segmentos literales tienen precedencia sobre los dinámicos, así que `/admin/medios`, `/admin/ajustes`, `/admin/usuarios` y `/admin/papelera` resuelven a sus carpetas propias aunque exista `[seccion]`. No hay conflicto. Y como el panel lee de Postgres y no del sistema de archivos, no aplica la trampa de trazado de Next con rutas no literales en `readFileSync`.

---

## Fase 1 — Infraestructura y migración

### Task 1: Banco de pruebas

Sin esto no hay TDD. Se monta Vitest con PGlite, un Postgres real compilado a WebAssembly que corre en memoria: da semántica de Postgres de verdad (jsonb, índices parciales, `gen_random_uuid()`) sin Docker ni una base remota.

**Files:**
- Create: `vitest.config.mts`
- Create: `tests/ayuda/db.ts`
- Create: `tests/ayuda/db.test.ts`
- Modify: `package.json` (dependencias y script `test`)

**Interfaces:**
- Consumes: nada.
- Produces: `crearDbPrueba(): Promise<{ db: BaseDePrueba; cerrar: () => Promise<void> }>` — todas las tareas siguientes montan su base de pruebas con esta función. `BaseDePrueba` es el tipo devuelto por `drizzle()` sobre PGlite.

- [ ] **Step 1: Instalar dependencias**

```bash
npm i -D vitest @electric-sql/pglite
npm i drizzle-orm
npm i -D drizzle-kit
```

- [ ] **Step 2: Configurar Vitest**

Crear `vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resuelve el alias `@/` de tsconfig.json dentro de las pruebas. Vite lo
  // soporta de forma nativa; el plugin vite-tsconfig-paths ya no hace falta.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true,
    testTimeout: 30_000,
  },
});
```

**La extensión `.mts` es obligatoria.** El archivo usa sintaxis ESM y `package.json` no declara `"type": "module"`; con extensión `.ts`, Vite lo carga como CommonJS y emite un aviso en **cada** corrida de pruebas. Renombrarlo es más barato que declarar el proyecto entero como módulo ESM, que afectaría a Next.

Agregar a `package.json`, en `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Escribir la prueba que falla**

Crear `tests/ayuda/db.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { sql } from "drizzle-orm";
import { crearDbPrueba } from "./db";

describe("banco de pruebas", () => {
  it("levanta un Postgres en memoria que responde consultas", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const filas = await db.execute(sql`select 1 as uno`);
    expect(filas.rows[0]).toEqual({ uno: 1 });
    await cerrar();
  });

  it("da una base limpia en cada llamada", async () => {
    const a = await crearDbPrueba();
    await a.db.execute(sql`create table marca (id int)`);
    await a.cerrar();

    const b = await crearDbPrueba();
    const existe = await b.db.execute(
      sql`select to_regclass('public.marca') as tabla`
    );
    expect(existe.rows[0].tabla).toBeNull();
    await b.cerrar();
  });
});
```

- [ ] **Step 4: Ejecutar la prueba y verificar que falla**

Run: `npm test`
Expected: FAIL — `Cannot find module './db'`.

- [ ] **Step 5: Implementar el ayudante**

Crear `tests/ayuda/db.ts`:

```ts
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

export type BaseDePrueba = ReturnType<typeof drizzle>;

/**
 * Levanta un Postgres en memoria, aislado, para una sola prueba.
 * En la tarea 2 se le agrega la aplicación del esquema.
 */
export async function crearDbPrueba(): Promise<{
  db: BaseDePrueba;
  cerrar: () => Promise<void>;
}> {
  const cliente = new PGlite();
  const db = drizzle(cliente);
  return { db, cerrar: () => cliente.close() };
}
```

- [ ] **Step 6: Ejecutar las pruebas y verificar que pasan**

Run: `npm test`
Expected: PASS, 2 pruebas.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.mts tests/ package.json package-lock.json
git commit -m "test: banco de pruebas con Vitest y PGlite"
```

---

### Task 2: Esquema de la base de datos

**Files:**
- Create: `src/db/esquema.ts`
- Create: `drizzle.config.ts`
- Create: `tests/db/esquema.test.ts`
- Modify: `tests/ayuda/db.ts` (aplicar el esquema)
- Modify: `package.json` (scripts de migración)

**Interfaces:**
- Consumes: `crearDbPrueba()` de la tarea 1.
- Produces: tablas `usuarios`, `contenidos`, `medios`, `ajustes` exportadas desde `@/db/esquema`, y los tipos inferidos `Usuario`, `Contenido`, `Medio`, `Ajuste` (fila seleccionada) y `NuevoUsuario`, `NuevoContenido`, `NuevoMedio` (fila insertable). Todas las tareas siguientes importan de aquí.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/db/esquema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { eq, sql } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { usuarios, contenidos } from "@/db/esquema";

describe("esquema", () => {
  it("crea un usuario con rol editor por defecto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [fila] = await db
      .insert(usuarios)
      .values({ email: "diego@campana.co", nombre: "Diego", passwordHash: "x" })
      .returning();

    expect(fila.rol).toBe("editor");
    expect(fila.activo).toBe(true);
    expect(fila.id).toMatch(/^[0-9a-f-]{36}$/);
    await cerrar();
  });

  it("rechaza dos contenidos del mismo tipo con el mismo slug", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const base = { tipo: "columna" as const, slug: "puerto-pisisi", titulo: "Puerto Pisisí", fecha: "2026-01-10" };

    await db.insert(contenidos).values(base);
    await expect(db.insert(contenidos).values(base)).rejects.toThrow();
    await cerrar();
  });

  it("permite reusar el slug si el anterior está borrado", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const base = { tipo: "columna" as const, slug: "puerto-pisisi", titulo: "Puerto Pisisí", fecha: "2026-01-10" };

    const [primero] = await db.insert(contenidos).values(base).returning();
    await db
      .update(contenidos)
      .set({ eliminadoEn: new Date() })
      .where(eq(contenidos.id, primero.id));

    const [segundo] = await db.insert(contenidos).values(base).returning();
    expect(segundo.id).not.toBe(primero.id);
    await cerrar();
  });

  it("permite el mismo slug en tipos distintos", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values({ tipo: "columna", slug: "hacer-lo-impensable", titulo: "A", fecha: "2026-01-10" });
    await db.insert(contenidos).values({ tipo: "bitacora", slug: "hacer-lo-impensable", titulo: "B", fecha: "2026-01-10" });

    const filas = await db.select().from(contenidos);
    expect(filas).toHaveLength(2);
    await cerrar();
  });

  it("guarda y devuelve el campo extra como objeto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [fila] = await db
      .insert(contenidos)
      .values({
        tipo: "columna",
        slug: "x",
        titulo: "X",
        fecha: "2026-01-10",
        extra: { sourceUrl: "https://alponiente.com/x/", readTime: "5 min" },
      })
      .returning();

    expect(fila.extra).toEqual({ sourceUrl: "https://alponiente.com/x/", readTime: "5 min" });
    await cerrar();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test`
Expected: FAIL — no existe `@/db/esquema`.

- [ ] **Step 3: Escribir el esquema**

Crear `src/db/esquema.ts`:

```ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  date,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  nombre: text("nombre").notNull(),
  passwordHash: text("password_hash").notNull(),
  rol: text("rol", { enum: ["admin", "editor"] }).notNull().default("editor"),
  activo: boolean("activo").notNull().default(true),
  // Límite de intentos de acceso. Vive aquí y no en una tabla aparte porque
  // el bloqueo es por cuenta y así el módulo se queda en cuatro tablas.
  intentosFallidos: integer("intentos_fallidos").notNull().default(0),
  bloqueadoHasta: timestamp("bloqueado_hasta", { withTimezone: true }),
  ultimoAcceso: timestamp("ultimo_acceso", { withTimezone: true }),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const medios = pgTable("medios", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Blob remoto (https://…) o ruta heredada del repositorio (/images/…).
  url: text("url").notNull(),
  nombre: text("nombre").notNull(),
  alt: text("alt"),
  ancho: integer("ancho"),
  alto: integer("alto"),
  pesoBytes: integer("peso_bytes"),
  subidoPor: uuid("subido_por").references(() => usuarios.id, { onDelete: "set null" }),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const contenidos = pgTable(
  "contenidos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tipo: text("tipo", {
      enum: ["columna", "bitacora", "historia", "idea", "voz", "episodio"],
    }).notNull(),
    slug: text("slug").notNull(),
    titulo: text("titulo").notNull(),
    resumen: text("resumen"),
    cuerpoHtml: text("cuerpo_html"),
    imagenId: uuid("imagen_id").references(() => medios.id, { onDelete: "set null" }),
    fecha: date("fecha").notNull(),
    categoria: text("categoria"),
    estado: text("estado", { enum: ["borrador", "publicado"] }).notNull().default("borrador"),
    destacado: boolean("destacado").notNull().default(false),
    orden: integer("orden").notNull().default(0),
    // Campos propios de cada tipo. Sin validación en la base: la garantiza
    // el esquema Zod por tipo de src/lib/admin/esquemas.ts antes de escribir.
    extra: jsonb("extra").notNull().default(sql`'{}'::jsonb`).$type<Record<string, unknown>>(),
    autorId: uuid("autor_id").references(() => usuarios.id, { onDelete: "set null" }),
    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
    eliminadoEn: timestamp("eliminado_en", { withTimezone: true }),
  },
  (t) => ({
    // Índice único parcial: el slug es único por tipo solo entre lo vivo,
    // de modo que borrar y recrear con el mismo slug sea posible.
    slugUnicoVivo: uniqueIndex("contenidos_tipo_slug_vivo")
      .on(t.tipo, t.slug)
      .where(sql`${t.eliminadoEn} is null`),
    porTipoEstado: index("contenidos_tipo_estado").on(t.tipo, t.estado),
    porFecha: index("contenidos_fecha").on(t.fecha),
  })
);

export const ajustes = pgTable("ajustes", {
  clave: text("clave").primaryKey(),
  valor: jsonb("valor").notNull().$type<unknown>(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
export type Contenido = typeof contenidos.$inferSelect;
export type NuevoContenido = typeof contenidos.$inferInsert;
export type Medio = typeof medios.$inferSelect;
export type NuevoMedio = typeof medios.$inferInsert;
export type Ajuste = typeof ajustes.$inferSelect;
```

- [ ] **Step 4: Configurar drizzle-kit y generar la migración**

Crear `drizzle.config.ts`:

```ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/esquema.ts",
  out: "./src/db/migraciones",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
```

Agregar a `scripts` de `package.json`:

```json
"db:generar": "drizzle-kit generate",
"db:aplicar": "drizzle-kit migrate",
"typecheck": "tsc --noEmit"
```

`typecheck` no es un extra: `tsconfig.json` incluye `**/*.ts`, así que `next build` type-chequea también `tests/`. Sin este script, un error de tipos en una prueba pasa desapercibido hasta que el despliegue falla.

Generar la migración inicial:

```bash
npm run db:generar
```

Esto escribe el SQL en `src/db/migraciones/`. No editarlo a mano.

- [ ] **Step 5: Aplicar el esquema en el banco de pruebas**

Reemplazar `tests/ayuda/db.ts` por:

```ts
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as esquema from "@/db/esquema";

export type BaseDePrueba = ReturnType<typeof drizzle<typeof esquema>>;

/** Levanta un Postgres en memoria con el esquema ya aplicado. */
export async function crearDbPrueba(): Promise<{
  db: BaseDePrueba;
  cerrar: () => Promise<void>;
}> {
  const cliente = new PGlite();
  const db = drizzle(cliente, { schema: esquema });
  await migrate(db, { migrationsFolder: "./src/db/migraciones" });
  return { db, cerrar: () => cliente.close() };
}
```

- [ ] **Step 6: Ejecutar y verificar que pasa**

Run: `npm test`
Expected: PASS, las 5 pruebas del esquema y las 2 de la tarea 1.

Si el índice único parcial falla, revisar que la migración generada contenga
`create unique index "contenidos_tipo_slug_vivo" on "contenidos" ("tipo","slug") where "eliminado_en" is null`.

- [ ] **Step 7: Cliente de la aplicación**

Crear `src/db/index.ts`:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as esquema from "./esquema";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

const conexion = neon(process.env.DATABASE_URL);

export const db = drizzle(conexion, { schema: esquema });
```

```bash
npm i @neondatabase/serverless
```

- [ ] **Step 8: Commit**

```bash
git add src/db drizzle.config.ts tests/ package.json package-lock.json
git commit -m "feat: esquema de base de datos del módulo de administración"
```

---

### Task 3: Configuración de los tipos de contenido

Este archivo es la pieza que evita seis pantallas casi iguales. Declara, para cada tipo, cómo se llama en español, qué ruta ocupa, qué taxonomía usa, por qué campo ordena y qué campos propios guarda en `extra`. Lo consumen el formulario del panel, la validación y el listado.

**Files:**
- Create: `src/lib/admin/tipos.ts`
- Create: `src/lib/admin/esquemas.ts`
- Create: `tests/admin/tipos.test.ts`

**Interfaces:**
- Consumes: los tipos de `@/db/esquema`.
- Produces:
  - `TIPOS: Record<TipoContenido, ConfigTipo>` y `LISTA_TIPOS: ConfigTipo[]`.
  - `configPorRutaAdmin(ruta: string): ConfigTipo | null`.
  - `esquemaContenido(tipo: TipoContenido): ZodSchema` — devuelve el validador completo del formulario para ese tipo.
  - `TipoContenido`, `ConfigTipo`, `CampoExtra`.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/admin/tipos.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { TIPOS, LISTA_TIPOS, configPorRutaAdmin } from "@/lib/admin/tipos";
import { esquemaContenido } from "@/lib/admin/esquemas";

describe("configuración de tipos", () => {
  it("declara los seis tipos", () => {
    expect(LISTA_TIPOS).toHaveLength(6);
    expect(LISTA_TIPOS.map((t) => t.tipo).sort()).toEqual(
      ["bitacora", "columna", "episodio", "historia", "idea", "voz"]
    );
  });

  it("resuelve la ruta del panel a su configuración", () => {
    expect(configPorRutaAdmin("columnas")?.tipo).toBe("columna");
    expect(configPorRutaAdmin("un-cafe")?.tipo).toBe("episodio");
    expect(configPorRutaAdmin("inventada")).toBeNull();
  });

  it("ordena ideas y episodios por orden, el resto por fecha", () => {
    expect(TIPOS.idea.ordenPor).toBe("orden");
    expect(TIPOS.episodio.ordenPor).toBe("orden");
    expect(TIPOS.columna.ordenPor).toBe("fecha");
    expect(TIPOS.bitacora.ordenPor).toBe("fecha");
  });

  it("solo columna, bitacora e historia tienen taxonomía", () => {
    expect(TIPOS.columna.taxonomia).not.toBeNull();
    expect(TIPOS.bitacora.taxonomia?.valores).toContain("Liderazgo");
    expect(TIPOS.historia.taxonomia?.valores).toContain("Comunidades");
    expect(TIPOS.idea.taxonomia).toBeNull();
    expect(TIPOS.voz.taxonomia).toBeNull();
    expect(TIPOS.episodio.taxonomia).toBeNull();
  });
});

describe("validación por tipo", () => {
  const base = {
    slug: "puerto-pisisi",
    titulo: "Puerto Pisisí, ahora sí",
    resumen: "Un resumen.",
    cuerpoHtml: "<p>Cuerpo.</p>",
    fecha: "2026-01-10",
    estado: "borrador" as const,
    destacado: false,
    orden: 0,
    categoria: "2026",
    imagenId: null,
  };

  it("acepta una columna con sourceUrl válido", () => {
    const r = esquemaContenido("columna").safeParse({
      ...base,
      extra: { sourceUrl: "https://alponiente.com/x/", readTime: "5 min" },
    });
    expect(r.success).toBe(true);
  });

  it("rechaza una columna con sourceUrl que no es URL", () => {
    const r = esquemaContenido("columna").safeParse({
      ...base,
      extra: { sourceUrl: "no-es-url", readTime: "5 min" },
    });
    expect(r.success).toBe(false);
  });

  it("acepta sourceUrl vacío, porque no toda columna tiene original en línea", () => {
    const r = esquemaContenido("columna").safeParse({
      ...base,
      extra: { sourceUrl: "", readTime: "5 min" },
    });
    expect(r.success).toBe(true);
  });

  it("exige el nombre del invitado en un episodio", () => {
    const r = esquemaContenido("episodio").safeParse({
      ...base,
      categoria: null,
      extra: { number: 1, guest: "", guestRole: "Alcaldesa", format: ["Video"] },
    });
    expect(r.success).toBe(false);
  });

  it("rechaza un slug con mayúsculas o tildes", () => {
    const r = esquemaContenido("bitacora").safeParse({
      ...base,
      slug: "Puerto-Pisisí",
      categoria: "Territorio",
      extra: { readTime: "5 min" },
    });
    expect(r.success).toBe(false);
  });

  it("rechaza una categoría que no está en la taxonomía del tipo", () => {
    const r = esquemaContenido("bitacora").safeParse({
      ...base,
      categoria: "Inventada",
      extra: { readTime: "5 min" },
    });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/admin/tipos.test.ts`
Expected: FAIL — no existe `@/lib/admin/tipos`.

- [ ] **Step 3: Escribir la configuración de tipos**

```bash
npm i zod
```

Crear `src/lib/admin/tipos.ts`:

```ts
export type TipoContenido =
  | "columna"
  | "bitacora"
  | "historia"
  | "idea"
  | "voz"
  | "episodio";

/** Un campo propio del tipo, que se guarda dentro de `extra`. */
export interface CampoExtra {
  nombre: string;
  etiqueta: string;
  control: "texto" | "url" | "numero" | "textarea" | "imagen" | "multiple";
  obligatorio: boolean;
  /** Solo para control "multiple". */
  opciones?: string[];
  ayuda?: string;
}

export interface ConfigTipo {
  tipo: TipoContenido;
  /** Nombre de la sección tal como la ve el equipo. */
  etiqueta: string;
  /** Para textos como "Nueva columna" o "Borrar columna". */
  singular: string;
  articulo: "la" | "el";
  /** Segmento bajo /admin. */
  rutaAdmin: string;
  /** Ruta pública del listado. */
  rutaPublica: string;
  taxonomia: { etiqueta: string; valores: string[] } | null;
  ordenPor: "fecha" | "orden";
  /** Si el tipo usa cuerpo largo. Ideas y episodios solo llevan descripción. */
  usaCuerpo: boolean;
  camposExtra: CampoExtra[];
}

export const TIPOS: Record<TipoContenido, ConfigTipo> = {
  columna: {
    tipo: "columna",
    etiqueta: "Huellas en Antioquia",
    singular: "columna",
    articulo: "la",
    rutaAdmin: "columnas",
    rutaPublica: "/columnas",
    taxonomia: { etiqueta: "Año", valores: ["2026", "2022", "2021"] },
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      {
        nombre: "sourceUrl",
        etiqueta: "Enlace a la publicación original",
        control: "url",
        obligatorio: false,
        ayuda: "La dirección en Al Poniente. Déjalo vacío si no se publicó en otro medio.",
      },
      { nombre: "readTime", etiqueta: "Tiempo de lectura", control: "texto", obligatorio: false, ayuda: 'Por ejemplo: "5 min".' },
    ],
  },
  bitacora: {
    tipo: "bitacora",
    etiqueta: "Bitácora",
    singular: "entrada",
    articulo: "la",
    rutaAdmin: "bitacora",
    rutaPublica: "/bitacora",
    taxonomia: {
      etiqueta: "Tema",
      valores: ["Liderazgo", "Servicio Público", "Territorio", "Decisiones", "Aprendizajes"],
    },
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "readTime", etiqueta: "Tiempo de lectura", control: "texto", obligatorio: false },
    ],
  },
  historia: {
    tipo: "historia",
    etiqueta: "Territorio Vivo",
    singular: "historia",
    articulo: "la",
    rutaAdmin: "historias",
    rutaPublica: "/territorio-vivo",
    taxonomia: {
      etiqueta: "Categoría",
      valores: ["Comunidades", "Líderes Locales", "Campo y Empresa", "Crónicas de Viaje", "Conectividad"],
    },
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "readTime", etiqueta: "Tiempo de lectura", control: "texto", obligatorio: false },
      {
        nombre: "format",
        etiqueta: "Formato",
        control: "multiple",
        obligatorio: true,
        opciones: ["texto", "video", "audio", "fotografia"],
      },
    ],
  },
  idea: {
    tipo: "idea",
    etiqueta: "Antioquia Piensa",
    singular: "idea",
    articulo: "la",
    rutaAdmin: "ideas",
    rutaPublica: "/antioquia-piensa",
    taxonomia: null,
    ordenPor: "orden",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "number", etiqueta: "Número", control: "texto", obligatorio: true, ayuda: 'Dos dígitos, por ejemplo "01".' },
    ],
  },
  voz: {
    tipo: "voz",
    etiqueta: "Voces",
    singular: "columna invitada",
    articulo: "la",
    rutaAdmin: "voces",
    rutaPublica: "/voces",
    taxonomia: null,
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "authorName", etiqueta: "Nombre del autor", control: "texto", obligatorio: true },
      { nombre: "authorRole", etiqueta: "Cargo del autor", control: "texto", obligatorio: true },
      { nombre: "authorCategory", etiqueta: "Área", control: "texto", obligatorio: false },
      { nombre: "authorImage", etiqueta: "Foto del autor", control: "imagen", obligatorio: false },
      { nombre: "pullQuote", etiqueta: "Frase destacada", control: "textarea", obligatorio: false },
    ],
  },
  episodio: {
    tipo: "episodio",
    etiqueta: "Un Café",
    singular: "episodio",
    articulo: "el",
    rutaAdmin: "un-cafe",
    rutaPublica: "/un-cafe",
    taxonomia: null,
    ordenPor: "orden",
    usaCuerpo: false,
    camposExtra: [
      { nombre: "number", etiqueta: "Número de episodio", control: "numero", obligatorio: true },
      { nombre: "guest", etiqueta: "Invitado", control: "texto", obligatorio: true },
      { nombre: "guestRole", etiqueta: "Cargo del invitado", control: "texto", obligatorio: true },
      {
        nombre: "format",
        etiqueta: "Formatos disponibles",
        control: "multiple",
        obligatorio: true,
        opciones: ["Video", "Podcast", "Resumen escrito"],
      },
    ],
  },
};

export const LISTA_TIPOS: ConfigTipo[] = Object.values(TIPOS);

export function configPorRutaAdmin(ruta: string): ConfigTipo | null {
  return LISTA_TIPOS.find((c) => c.rutaAdmin === ruta) ?? null;
}

export function esTipoValido(valor: string): valor is TipoContenido {
  return valor in TIPOS;
}
```

- [ ] **Step 4: Escribir los validadores**

Crear `src/lib/admin/esquemas.ts`:

```ts
import { z } from "zod";
import { TIPOS, type TipoContenido, type CampoExtra } from "./tipos";

/** Minúsculas, números y guiones. Sin tildes, espacios ni mayúsculas. */
export const esquemaSlug = z
  .string()
  .min(1, "El slug no puede estar vacío")
  .max(120, "El slug es demasiado largo")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo admite minúsculas, números y guiones");

function campoAZod(campo: CampoExtra): z.ZodTypeAny {
  let base: z.ZodTypeAny;

  switch (campo.control) {
    case "url":
      // Cadena vacía permitida: no toda columna tiene original en línea.
      base = z.union([z.literal(""), z.string().url("Debe ser una dirección web válida")]);
      break;
    case "numero":
      base = z.coerce.number().int().min(0);
      break;
    case "multiple":
      base = z.array(z.enum(campo.opciones as [string, ...string[]]));
      if (campo.obligatorio) {
        return (base as z.ZodArray<z.ZodTypeAny>).min(1, `Elige al menos un valor en ${campo.etiqueta}`);
      }
      return base;
    case "imagen":
      base = z.union([z.literal(""), z.string()]);
      break;
    default:
      base = z.string();
  }

  if (campo.obligatorio && campo.control !== "numero") {
    return (base as z.ZodString).refine(
      (v) => String(v).trim().length > 0,
      `${campo.etiqueta} es obligatorio`
    );
  }
  return campo.obligatorio ? base : base.optional();
}

function esquemaExtra(tipo: TipoContenido) {
  const forma: Record<string, z.ZodTypeAny> = {};
  for (const campo of TIPOS[tipo].camposExtra) {
    forma[campo.nombre] = campoAZod(campo);
  }
  return z.object(forma);
}

/** Validador completo del formulario de un tipo. */
export function esquemaContenido(tipo: TipoContenido) {
  const config = TIPOS[tipo];

  const categoria = config.taxonomia
    ? z.enum(config.taxonomia.valores as [string, ...string[]], {
        // Zod 4 renombró `errorMap` a `error` y espera la cadena directa,
        // no un objeto `{ message }`. El proyecto usa zod@4.4.3.
        error: () => `Elige un valor válido de ${config.taxonomia!.etiqueta}`,
      })
    : z.null().or(z.undefined());

  return z.object({
    slug: esquemaSlug,
    titulo: z.string().min(1, "El título es obligatorio").max(300),
    resumen: z.string().max(600, "El resumen no debe pasar de 600 caracteres").optional().nullable(),
    cuerpoHtml: z.string().optional().nullable(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato AAAA-MM-DD"),
    categoria,
    estado: z.enum(["borrador", "publicado"]),
    destacado: z.boolean(),
    orden: z.coerce.number().int().min(0),
    imagenId: z.string().uuid().nullable().optional(),
    extra: esquemaExtra(tipo),
  });
}

export type DatosContenido = z.infer<ReturnType<typeof esquemaContenido>>;
```

- [ ] **Step 5: Ejecutar y verificar que pasa**

Run: `npm test -- tests/admin/tipos.test.ts`
Expected: PASS, 10 pruebas.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin tests/admin package.json package-lock.json
git commit -m "feat: configuración y validación de los seis tipos de contenido"
```

---

### Task 4: Slug y sanitización

Dos utilidades pequeñas de las que dependen el editor y la migración. El slug se genera desde el título quitando tildes; el HTML del editor se limpia **al guardar**, no al mostrar, para que en la base nunca haya nada peligroso.

**Files:**
- Create: `src/lib/admin/slug.ts`
- Create: `src/lib/admin/sanitizar.ts`
- Create: `tests/admin/slug.test.ts`
- Create: `tests/admin/sanitizar.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `generarSlug(texto: string): string` y `sanitizarHtml(html: string): string`.

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `tests/admin/slug.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generarSlug } from "@/lib/admin/slug";

describe("generarSlug", () => {
  it("pasa a minúsculas y une con guiones", () => {
    expect(generarSlug("Hacer lo impensable")).toBe("hacer-lo-impensable");
  });

  it("quita tildes y eñes", () => {
    expect(generarSlug("Puerto Pisisí, ahora sí")).toBe("puerto-pisisi-ahora-si");
    expect(generarSlug("Competitividad del oriente antioqueño")).toBe(
      "competitividad-del-oriente-antioqueno"
    );
  });

  it("quita signos de puntuación y de interrogación de apertura", () => {
    expect(generarSlug("¿Cómo crecer con tanta informalidad?")).toBe(
      "como-crecer-con-tanta-informalidad"
    );
  });

  it("colapsa espacios y guiones repetidos, y recorta los de los extremos", () => {
    expect(generarSlug("  Hidroituango —  El BOOMT-erang  ")).toBe(
      "hidroituango-el-boomt-erang"
    );
  });

  it("devuelve cadena vacía si no queda nada utilizable", () => {
    expect(generarSlug("¿¡—!?")).toBe("");
  });
});
```

Crear `tests/admin/sanitizar.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { sanitizarHtml } from "@/lib/admin/sanitizar";

describe("sanitizarHtml", () => {
  it("conserva el formato que produce el editor", () => {
    const html =
      '<p>Un <strong>párrafo</strong> con <em>énfasis</em> y un <a href="https://alponiente.com/">enlace</a>.</p>' +
      "<h2>Un subtítulo</h2><blockquote><p>Una cita.</p></blockquote><ul><li>Uno</li></ul>";
    expect(sanitizarHtml(html)).toBe(
      '<p>Un <strong>párrafo</strong> con <em>énfasis</em> y un <a href="https://alponiente.com/" target="_blank" rel="noopener noreferrer nofollow">enlace</a>.</p>' +
        "<h2>Un subtítulo</h2><blockquote><p>Una cita.</p></blockquote><ul><li>Uno</li></ul>"
    );
  });

  it("elimina scripts", () => {
    expect(sanitizarHtml('<p>Hola</p><script>alert("x")</script>')).toBe("<p>Hola</p>");
  });

  it("elimina manejadores de eventos en línea", () => {
    expect(sanitizarHtml('<p onclick="robar()">Hola</p>')).toBe("<p>Hola</p>");
  });

  it("elimina enlaces con javascript:", () => {
    expect(sanitizarHtml('<a href="javascript:alert(1)">clic</a>')).toBe("<a>clic</a>");
  });

  it("elimina iframes y objetos incrustados", () => {
    expect(sanitizarHtml('<p>a</p><iframe src="https://malo.co"></iframe>')).toBe("<p>a</p>");
  });

  it("no rompe con entrada vacía", () => {
    expect(sanitizarHtml("")).toBe("");
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que fallan**

Run: `npm test -- tests/admin/slug.test.ts tests/admin/sanitizar.test.ts`
Expected: FAIL — no existen los módulos.

- [ ] **Step 3: Implementar**

```bash
npm i sanitize-html
npm i -D @types/sanitize-html
```

Crear `src/lib/admin/slug.ts`:

```ts
/**
 * Convierte un título en un slug apto para URL: minúsculas, sin tildes,
 * separado por guiones. Debe producir salidas que pasen `esquemaSlug`.
 */
export function generarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    // Marcas diacríticas combinantes. Se escriben con escapes unicode a
    // propósito: los caracteres en crudo son invisibles y se corrompen al
    // copiarse entre archivos.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

Crear `src/lib/admin/sanitizar.ts`:

```ts
import sanitizeHtml from "sanitize-html";

/**
 * Limpia el HTML que produce el editor. Se aplica AL GUARDAR, de modo que
 * en la base de datos nunca haya marcado peligroso y el sitio público pueda
 * renderizar el contenido sin volver a procesarlo.
 */
export function sanitizarHtml(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "u", "s", "h2", "h3", "blockquote", "ul", "ol", "li", "a", "br"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      }),
    },
  });
}
```

- [ ] **Step 4: Ejecutar y verificar que pasan**

Run: `npm test -- tests/admin/slug.test.ts tests/admin/sanitizar.test.ts`
Expected: PASS, 11 pruebas.

Nota: `sanitize-html` deja `<a>` sin `href` cuando el esquema no está permitido, por eso la prueba de `javascript:` espera `<a>clic</a>` y no la eliminación del enlace completo.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin tests/admin package.json package-lock.json
git commit -m "feat: utilidades de slug y sanitización de HTML"
```

---

### Task 5: Migración del contenido existente

Traslada a la base los 57 contenidos que hoy viven en `src/data/`. Las 32 columnas de Al Poniente entran publicadas; el contenido de muestra entra como borrador. Las imágenes de `public/images/` se registran apuntando a su ruta actual, sin re-subirse.

Los archivos `src/data/*.ts` **no se eliminan en esta tarea**: el sitio público todavía los usa. Se eliminan en la tarea 17.

**Files:**
- Create: `scripts/migrar-contenido.ts`
- Create: `src/lib/admin/migracion.ts`
- Create: `tests/admin/migracion.test.ts`
- Modify: `package.json` (script `db:migrar-contenido`)

**Interfaces:**
- Consumes: `crearDbPrueba()`, tablas de `@/db/esquema`, `generarSlug`, los datos de `@/data/columnas`, `@/data/columnas-bodies` y `@/data/content`.
- Produces: `migrarContenido(db): Promise<ResumenMigracion>` donde
  `ResumenMigracion = { medios: number; porTipo: Record<TipoContenido, number>; ajustes: number }`.
  La función es idempotente y transaccional; el script de la línea de comandos solo la invoca contra la base real.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/admin/migracion.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { and, eq, isNull } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos, medios, ajustes } from "@/db/esquema";
import { migrarContenido } from "@/lib/admin/migracion";

describe("migración del contenido existente", () => {
  it("migra las cantidades exactas del spec", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const resumen = await migrarContenido(db);

    expect(resumen.porTipo).toEqual({
      columna: 32,
      bitacora: 5,
      historia: 6,
      idea: 6,
      voz: 4,
      episodio: 4,
    });
    await cerrar();
  });

  it("deja las 32 columnas publicadas y todo lo demás en borrador", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const publicados = await db.select().from(contenidos).where(eq(contenidos.estado, "publicado"));
    expect(publicados).toHaveLength(32);
    expect(publicados.every((c) => c.tipo === "columna")).toBe(true);

    const borradores = await db.select().from(contenidos).where(eq(contenidos.estado, "borrador"));
    expect(borradores).toHaveLength(25);
    await cerrar();
  });

  it("conserva el sourceUrl y el cuerpo de cada columna", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const [col] = await db
      .select()
      .from(contenidos)
      .where(and(eq(contenidos.tipo, "columna"), eq(contenidos.slug, "puerto-pisisi-ahora-si")));

    expect(col.extra).toHaveProperty("sourceUrl");
    expect(String(col.extra.sourceUrl)).toContain("alponiente.com");
    expect(col.cuerpoHtml).toMatch(/^<p>/);
    await cerrar();
  });

  it("convierte cada párrafo del cuerpo en un <p>", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const todas = await db.select().from(contenidos).where(eq(contenidos.tipo, "columna"));
    for (const col of todas) {
      expect(col.cuerpoHtml, `la columna ${col.slug} quedó sin cuerpo`).toBeTruthy();
      expect(col.cuerpoHtml!.startsWith("<p>")).toBe(true);
      expect(col.cuerpoHtml).not.toContain("<script");
    }
    await cerrar();
  });

  it("registra las imágenes del repositorio sin re-subirlas", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const resumen = await migrarContenido(db);

    const filas = await db.select().from(medios);
    expect(filas.length).toBe(resumen.medios);
    expect(filas.every((m) => m.url.startsWith("/images/"))).toBe(true);
    await cerrar();
  });

  it("enlaza cada contenido con su imagen de portada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const sinImagen = await db.select().from(contenidos).where(isNull(contenidos.imagenId));
    expect(sinImagen).toHaveLength(0);
    await cerrar();
  });

  it("migra los ajustes de portada, sobre y navegación", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const filas = await db.select().from(ajustes);
    const porClave = Object.fromEntries(filas.map((f) => [f.clave, f.valor]));

    expect((porClave["portada.cifras"] as unknown[]).length).toBe(6);
    expect((porClave["sobre.trayectoria"] as unknown[]).length).toBe(10);
    expect((porClave["navegacion.menu"] as unknown[]).length).toBe(3);
    expect(porClave["sitio.enConstruccion"]).toBe(true);
    await cerrar();
  });

  it("es idempotente: correrla dos veces no duplica nada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);
    await migrarContenido(db);

    const filas = await db.select().from(contenidos);
    expect(filas).toHaveLength(57);
    await cerrar();
  });

  it("los slugs migrados pasan la validación del panel", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const filas = await db.select().from(contenidos);
    for (const c of filas) {
      expect(c.slug, `slug inválido: ${c.slug}`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
    await cerrar();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/admin/migracion.test.ts`
Expected: FAIL — no existe `@/lib/admin/migracion`.

- [ ] **Step 3: Implementar la migración**

Crear `src/lib/admin/migracion.ts`:

```ts
import { sql } from "drizzle-orm";
import { contenidos, medios, ajustes } from "@/db/esquema";
import type { TipoContenido } from "./tipos";
import { generarSlug } from "./slug";
import { sanitizarHtml } from "./sanitizar";

import { columnas } from "@/data/columnas";
import { columnasBodies } from "@/data/columnas-bodies";
import {
  blogPosts,
  stories,
  ideas,
  guestColumns,
  episodes,
  impactStats,
  timelineEvents,
  navItems,
  featuredReflection,
} from "@/data/content";

export interface ResumenMigracion {
  medios: number;
  porTipo: Record<TipoContenido, number>;
  ajustes: number;
}

function parrafosAHtml(parrafos: string[]): string {
  return sanitizarHtml(parrafos.map((p) => `<p>${p.trim()}</p>`).join(""));
}

/** Reúne todas las rutas /images/ que aparecen en los datos actuales. */
function recolectarImagenes(): string[] {
  const rutas = new Set<string>();
  const agregar = (v: unknown) => {
    if (typeof v === "string" && v.startsWith("/images/")) rutas.add(v);
  };

  columnas.forEach((c) => agregar(c.image));
  blogPosts.forEach((b) => agregar(b.image));
  stories.forEach((s) => agregar(s.image));
  guestColumns.forEach((g) => agregar(g.authorImage));
  episodes.forEach((e) => agregar(e.image));
  agregar(featuredReflection.image);
  // Portada de respaldo para los tipos que no traen imagen propia.
  agregar("/images/gallon-retrato-obra-hd.jpg");

  return [...rutas];
}

function nombreDesdeRuta(ruta: string): string {
  return ruta.split("/").pop() ?? ruta;
}

export async function migrarContenido(db: any): Promise<ResumenMigracion> {
  return db.transaction(async (tx: any) => {
    // ---- Medios --------------------------------------------------------
    const rutas = recolectarImagenes();
    for (const url of rutas) {
      await tx
        .insert(medios)
        .values({ url, nombre: nombreDesdeRuta(url), alt: "" })
        .onConflictDoNothing();
    }
    const filasMedios = await tx.select().from(medios);
    const idPorUrl = new Map<string, string>(filasMedios.map((m: any) => [m.url, m.id]));
    const respaldo = idPorUrl.get("/images/gallon-retrato-obra-hd.jpg")!;
    const idDe = (ruta?: string) => (ruta && idPorUrl.get(ruta)) || respaldo;

    // ---- Contenidos ----------------------------------------------------
    const filas: any[] = [];

    columnas.forEach((c) => {
      filas.push({
        tipo: "columna",
        slug: c.slug,
        titulo: c.title,
        resumen: c.excerpt,
        cuerpoHtml: parrafosAHtml(columnasBodies[c.slug] ?? c.body ?? []),
        imagenId: idDe(c.image),
        fecha: c.date,
        categoria: c.date.slice(0, 4),
        estado: "publicado",
        extra: { sourceUrl: c.sourceUrl ?? "", readTime: c.readTime ?? "" },
      });
    });

    blogPosts.forEach((b) => {
      filas.push({
        tipo: "bitacora",
        slug: b.slug,
        titulo: b.title,
        resumen: b.excerpt,
        cuerpoHtml: b.content ? parrafosAHtml([b.content]) : null,
        imagenId: idDe(b.image),
        fecha: b.date,
        categoria: b.tag,
        estado: "borrador",
        extra: { readTime: b.readTime ?? "" },
      });
    });

    stories.forEach((s) => {
      filas.push({
        tipo: "historia",
        slug: s.slug,
        titulo: s.title,
        resumen: s.excerpt,
        cuerpoHtml: null,
        imagenId: idDe(s.image),
        fecha: s.date,
        categoria: s.category,
        estado: "borrador",
        extra: { readTime: s.readTime ?? "", format: [s.format] },
      });
    });

    ideas.forEach((i, indice) => {
      filas.push({
        tipo: "idea",
        slug: i.slug,
        titulo: i.title,
        resumen: i.description,
        cuerpoHtml: i.content ? parrafosAHtml([i.content]) : null,
        imagenId: respaldo,
        fecha: "2026-01-01",
        categoria: null,
        estado: "borrador",
        orden: indice,
        extra: { number: i.number },
      });
    });

    guestColumns.forEach((g) => {
      filas.push({
        tipo: "voz",
        slug: g.slug,
        titulo: g.title,
        resumen: g.excerpt,
        cuerpoHtml: null,
        imagenId: respaldo,
        fecha: g.date,
        categoria: null,
        estado: "borrador",
        extra: {
          authorName: g.authorName,
          authorRole: g.authorRole,
          authorCategory: g.authorCategory ?? "",
          authorImage: g.authorImage ?? "",
          pullQuote: g.pullQuote ?? "",
        },
      });
    });

    episodes.forEach((e, indice) => {
      filas.push({
        tipo: "episodio",
        slug: generarSlug(`${e.number}-${e.title}`),
        titulo: e.title,
        resumen: e.description,
        cuerpoHtml: null,
        imagenId: idDe(e.image),
        fecha: "2026-01-01",
        categoria: null,
        estado: "borrador",
        orden: indice,
        extra: {
          number: e.number,
          guest: e.guest,
          guestRole: e.guestRole,
          format: e.format,
        },
      });
    });

    for (const fila of filas) {
      await tx.insert(contenidos).values(fila).onConflictDoNothing();
    }

    // ---- Ajustes -------------------------------------------------------
    const valoresAjustes: Array<{ clave: string; valor: unknown }> = [
      { clave: "sitio.enConstruccion", valor: true },
      {
        clave: "sitio.mensajeConstruccion",
        valor: "Estamos preparando este espacio. Vuelve pronto.",
      },
      {
        clave: "portada.cifras",
        valor: impactStats.map((s) => ({ valor: s.value, sufijo: s.suffix, etiqueta: s.label })),
      },
      { clave: "portada.reflexionDestacada", valor: null },
      { clave: "portada.franjaFotos", valor: [] },
      {
        clave: "sobre.trayectoria",
        valor: timelineEvents.map((t) => ({ anio: t.year, titulo: t.title, descripcion: t.description })),
      },
      {
        clave: "navegacion.menu",
        valor: navItems.map((n) => ({ etiqueta: n.label, destino: n.href, visible: true })),
      },
      { clave: "navegacion.redes", valor: { x: "", instagram: "", youtube: "" } },
    ];

    for (const a of valoresAjustes) {
      await tx.insert(ajustes).values(a).onConflictDoNothing();
    }

    const porTipo = {} as Record<TipoContenido, number>;
    for (const f of filas) {
      porTipo[f.tipo as TipoContenido] = (porTipo[f.tipo as TipoContenido] ?? 0) + 1;
    }

    return { medios: rutas.length, porTipo, ajustes: valoresAjustes.length };
  });
}
```

**Sobre la idempotencia:** `onConflictDoNothing()` se apoya en el índice único parcial de `contenidos` (tipo + slug entre lo vivo), en la llave primaria de `ajustes` y en la unicidad de `medios.url`. Esa última no existe todavía: agregar `.unique()` a la columna `url` en `src/db/esquema.ts` y regenerar la migración con `npm run db:generar`.

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/admin/migracion.test.ts`
Expected: PASS, 9 pruebas.

Si falla el conteo de `columna`, verificar contra el repositorio: `grep -c '^  {' src/data/columnas.ts` debe dar 32.

- [ ] **Step 5: Escribir el script de línea de comandos**

Crear `scripts/migrar-contenido.ts`:

```ts
import { db } from "@/db";
import { migrarContenido } from "@/lib/admin/migracion";

async function principal() {
  console.log("Migrando contenido a la base de datos…");
  const resumen = await migrarContenido(db);

  console.log("\nMedios registrados:", resumen.medios);
  console.log("Ajustes creados:", resumen.ajustes);
  console.table(resumen.porTipo);
  console.log("\nListo. Las columnas quedaron publicadas; el resto, en borrador.");
}

principal().catch((error) => {
  console.error("La migración falló y no se escribió nada:", error);
  process.exit(1);
});
```

Agregar a `scripts` de `package.json`:

```json
"db:migrar-contenido": "tsx scripts/migrar-contenido.ts"
```

```bash
npm i -D tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/migracion.ts scripts/ src/db tests/admin package.json package-lock.json
git commit -m "feat: migración del contenido existente a la base de datos"
```

---

## Fase 2 — Acceso

### Task 6: Contraseñas y bloqueo por intentos

Se usa `bcryptjs`, la implementación en JavaScript puro, y no `bcrypt`, que requiere compilación nativa y falla en el entorno de Vercel.

El bloqueo vive en la tabla `usuarios` porque el límite es por cuenta. Un intento contra un correo inexistente no puede tener éxito de ninguna forma, y se responde con el mismo mensaje y el mismo tiempo que un intento fallido contra una cuenta real, para no revelar qué correos existen.

**Files:**
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/usuarios.ts`
- Create: `tests/auth/password.test.ts`
- Create: `tests/auth/usuarios.test.ts`

**Interfaces:**
- Consumes: `crearDbPrueba()`, tabla `usuarios`.
- Produces:
  - `hashearPassword(plano: string): Promise<string>`
  - `verificarPassword(plano: string, hash: string): Promise<boolean>`
  - `crearUsuario(db, datos: { email; nombre; password; rol? }): Promise<Usuario>`
  - `autenticar(db, email: string, password: string): Promise<ResultadoAuth>` donde
    `ResultadoAuth = { ok: true; usuario: Usuario } | { ok: false; motivo: "credenciales" | "bloqueado" | "inactivo" }`
  - `MAX_INTENTOS = 5`, `MINUTOS_BLOQUEO = 15`

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `tests/auth/password.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { hashearPassword, verificarPassword } from "@/lib/auth/password";

describe("contraseñas", () => {
  it("el hash no se parece a la contraseña", async () => {
    const hash = await hashearPassword("clave-de-campana-2026");
    expect(hash).not.toContain("clave-de-campana-2026");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("verifica la contraseña correcta", async () => {
    const hash = await hashearPassword("clave-de-campana-2026");
    expect(await verificarPassword("clave-de-campana-2026", hash)).toBe(true);
  });

  it("rechaza la contraseña incorrecta", async () => {
    const hash = await hashearPassword("clave-de-campana-2026");
    expect(await verificarPassword("otra-clave", hash)).toBe(false);
  });

  it("dos hashes de la misma contraseña son distintos", async () => {
    const a = await hashearPassword("igual");
    const b = await hashearPassword("igual");
    expect(a).not.toBe(b);
  });
});
```

Crear `tests/auth/usuarios.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { usuarios } from "@/db/esquema";
import { crearUsuario, autenticar, MAX_INTENTOS } from "@/lib/auth/usuarios";

const CLAVE = "clave-de-campana-2026";

async function conUsuario() {
  const ctx = await crearDbPrueba();
  const usuario = await crearUsuario(ctx.db, {
    email: "diego@campana.co",
    nombre: "Diego",
    password: CLAVE,
  });
  return { ...ctx, usuario };
}

describe("autenticación", () => {
  it("nunca guarda la contraseña en claro", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, usuario.id));
    expect(fila.passwordHash).not.toContain(CLAVE);
    await cerrar();
  });

  it("normaliza el correo a minúsculas", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await crearUsuario(db, { email: "Walter@Campana.CO", nombre: "Walter", password: CLAVE });
    const r = await autenticar(db, "walter@campana.co", CLAVE);
    expect(r.ok).toBe(true);
    await cerrar();
  });

  it("acepta credenciales correctas y registra el acceso", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    const r = await autenticar(db, "diego@campana.co", CLAVE);

    expect(r.ok).toBe(true);
    const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, usuario.id));
    expect(fila.ultimoAcceso).not.toBeNull();
    expect(fila.intentosFallidos).toBe(0);
    await cerrar();
  });

  it("rechaza la contraseña incorrecta y cuenta el intento", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    const r = await autenticar(db, "diego@campana.co", "equivocada");

    expect(r).toEqual({ ok: false, motivo: "credenciales" });
    const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, usuario.id));
    expect(fila.intentosFallidos).toBe(1);
    await cerrar();
  });

  it("responde igual ante un correo que no existe, sin revelar nada", async () => {
    const { db, cerrar } = await conUsuario();
    const r = await autenticar(db, "nadie@campana.co", CLAVE);
    expect(r).toEqual({ ok: false, motivo: "credenciales" });
    await cerrar();
  });

  it("bloquea la cuenta tras cinco intentos fallidos", async () => {
    const { db, cerrar } = await conUsuario();
    for (let i = 0; i < MAX_INTENTOS; i++) {
      await autenticar(db, "diego@campana.co", "equivocada");
    }

    const r = await autenticar(db, "diego@campana.co", CLAVE);
    expect(r).toEqual({ ok: false, motivo: "bloqueado" });
    await cerrar();
  });

  it("deja entrar de nuevo cuando el bloqueo expira", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    for (let i = 0; i < MAX_INTENTOS; i++) {
      await autenticar(db, "diego@campana.co", "equivocada");
    }
    await db
      .update(usuarios)
      .set({ bloqueadoHasta: new Date(Date.now() - 1000) })
      .where(eq(usuarios.id, usuario.id));

    const r = await autenticar(db, "diego@campana.co", CLAVE);
    expect(r.ok).toBe(true);
    await cerrar();
  });

  it("rechaza a un usuario desactivado aunque la clave sea correcta", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    await db.update(usuarios).set({ activo: false }).where(eq(usuarios.id, usuario.id));

    const r = await autenticar(db, "diego@campana.co", CLAVE);
    expect(r).toEqual({ ok: false, motivo: "inactivo" });
    await cerrar();
  });

  it("exige contraseña de al menos diez caracteres", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await expect(
      crearUsuario(db, { email: "corto@campana.co", nombre: "X", password: "corta" })
    ).rejects.toThrow();
    await cerrar();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que fallan**

Run: `npm test -- tests/auth`
Expected: FAIL — no existen los módulos.

- [ ] **Step 3: Implementar**

```bash
npm i bcryptjs
npm i -D @types/bcryptjs
```

Crear `src/lib/auth/password.ts`:

```ts
import bcrypt from "bcryptjs";

const COSTE = 12;

export async function hashearPassword(plano: string): Promise<string> {
  return bcrypt.hash(plano, COSTE);
}

export async function verificarPassword(plano: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plano, hash);
}

/** Hash de descarte, para gastar el mismo tiempo cuando el correo no existe. */
export const HASH_SENUELO = "$2a$12$Ck1kX3wJz3Yy2rFqPZ9nEe4hV0gT8sJ8kLm3nOpQrStUvWxYz0aBc";
```

Crear `src/lib/auth/usuarios.ts`:

```ts
import { eq } from "drizzle-orm";
import { usuarios, type Usuario } from "@/db/esquema";
import { hashearPassword, verificarPassword, HASH_SENUELO } from "./password";

export const MAX_INTENTOS = 5;
export const MINUTOS_BLOQUEO = 15;
export const LARGO_MINIMO_PASSWORD = 10;

export type ResultadoAuth =
  | { ok: true; usuario: Usuario }
  | { ok: false; motivo: "credenciales" | "bloqueado" | "inactivo" };

export async function crearUsuario(
  db: any,
  datos: { email: string; nombre: string; password: string; rol?: "admin" | "editor" }
): Promise<Usuario> {
  if (datos.password.length < LARGO_MINIMO_PASSWORD) {
    throw new Error(`La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`);
  }

  const [fila] = await db
    .insert(usuarios)
    .values({
      email: datos.email.trim().toLowerCase(),
      nombre: datos.nombre.trim(),
      passwordHash: await hashearPassword(datos.password),
      rol: datos.rol ?? "editor",
    })
    .returning();

  return fila;
}

export async function autenticar(
  db: any,
  email: string,
  password: string
): Promise<ResultadoAuth> {
  const normalizado = email.trim().toLowerCase();
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.email, normalizado));

  // Se compara igual contra un hash señuelo para que el tiempo de respuesta
  // no delate si el correo existe.
  if (!usuario) {
    await verificarPassword(password, HASH_SENUELO);
    return { ok: false, motivo: "credenciales" };
  }

  if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
    return { ok: false, motivo: "bloqueado" };
  }

  if (!usuario.activo) {
    return { ok: false, motivo: "inactivo" };
  }

  const correcta = await verificarPassword(password, usuario.passwordHash);

  if (!correcta) {
    const intentos = usuario.intentosFallidos + 1;
    await db
      .update(usuarios)
      .set({
        intentosFallidos: intentos,
        bloqueadoHasta:
          intentos >= MAX_INTENTOS ? new Date(Date.now() + MINUTOS_BLOQUEO * 60_000) : null,
      })
      .where(eq(usuarios.id, usuario.id));
    return { ok: false, motivo: "credenciales" };
  }

  await db
    .update(usuarios)
    .set({ intentosFallidos: 0, bloqueadoHasta: null, ultimoAcceso: new Date() })
    .where(eq(usuarios.id, usuario.id));

  return { ok: true, usuario: { ...usuario, intentosFallidos: 0 } };
}
```

- [ ] **Step 4: Ejecutar y verificar que pasan**

Run: `npm test -- tests/auth`
Expected: PASS, 13 pruebas.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth tests/auth package.json package-lock.json
git commit -m "feat: contraseñas, autenticación y bloqueo por intentos"
```

---

### Task 7: Sesión, login y middleware

**Files:**
- Create: `src/lib/auth/config.ts`
- Create: `src/lib/auth/sesion.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/formulario.tsx`
- Create: `middleware.ts`
- Create: `tests/auth/sesion.test.ts`
- Modify: `src/app/robots.ts` (excluir `/admin`)

**Interfaces:**
- Consumes: `autenticar()` de la tarea 6.
- Produces:
  - `auth()`, `signIn()`, `signOut()` exportados desde `@/lib/auth/config`.
  - `requerirSesion(): Promise<SesionUsuario>` — lanza `Error("NO_AUTENTICADO")` si no hay sesión.
  - `requerirAdmin(): Promise<SesionUsuario>` — lanza `Error("SIN_PERMISO")` si el rol no es admin.
  - `SesionUsuario = { id: string; email: string; nombre: string; rol: "admin" | "editor" }`.

- [ ] **Step 1: Escribir la prueba que falla**

`requerirSesion` y `requerirAdmin` se prueban inyectando la sesión, sin levantar Auth.js. Crear `tests/auth/sesion.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const obtenerSesion = vi.fn();
vi.mock("@/lib/auth/config", () => ({ auth: () => obtenerSesion() }));

import { requerirSesion, requerirAdmin } from "@/lib/auth/sesion";

const EDITOR = { user: { id: "u1", email: "d@c.co", nombre: "Diego", rol: "editor" } };
const ADMIN = { user: { id: "u2", email: "c@c.co", nombre: "Cristian", rol: "admin" } };

beforeEach(() => obtenerSesion.mockReset());

describe("guardas de sesión", () => {
  it("requerirSesion devuelve el usuario cuando hay sesión", async () => {
    obtenerSesion.mockResolvedValue(EDITOR);
    await expect(requerirSesion()).resolves.toMatchObject({ id: "u1", rol: "editor" });
  });

  it("requerirSesion falla sin sesión", async () => {
    obtenerSesion.mockResolvedValue(null);
    await expect(requerirSesion()).rejects.toThrow("NO_AUTENTICADO");
  });

  it("requerirAdmin acepta a un admin", async () => {
    obtenerSesion.mockResolvedValue(ADMIN);
    await expect(requerirAdmin()).resolves.toMatchObject({ rol: "admin" });
  });

  it("requerirAdmin rechaza a un editor", async () => {
    obtenerSesion.mockResolvedValue(EDITOR);
    await expect(requerirAdmin()).rejects.toThrow("SIN_PERMISO");
  });

  it("requerirAdmin rechaza cuando no hay sesión", async () => {
    obtenerSesion.mockResolvedValue(null);
    await expect(requerirAdmin()).rejects.toThrow("NO_AUTENTICADO");
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/auth/sesion.test.ts`
Expected: FAIL — no existe `@/lib/auth/sesion`.

- [ ] **Step 3: Implementar las guardas**

Crear `src/lib/auth/sesion.ts`:

```ts
import { auth } from "./config";

export interface SesionUsuario {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "editor";
}

/**
 * Primera línea de toda Server Action del panel. Ocultar un botón en la
 * interfaz no es control de acceso; esto sí.
 */
export async function requerirSesion(): Promise<SesionUsuario> {
  const sesion = await auth();
  if (!sesion?.user) throw new Error("NO_AUTENTICADO");
  return sesion.user as SesionUsuario;
}

export async function requerirAdmin(): Promise<SesionUsuario> {
  const usuario = await requerirSesion();
  if (usuario.rol !== "admin") throw new Error("SIN_PERMISO");
  return usuario;
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/auth/sesion.test.ts`
Expected: PASS, 5 pruebas.

- [ ] **Step 5: Configurar Auth.js**

```bash
npm i next-auth@beta
npx auth secret   # escribe AUTH_SECRET en .env.local
```

Crear `src/lib/auth/config.ts`:

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { autenticar } from "./usuarios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credenciales) {
        const email = String(credenciales?.email ?? "");
        const password = String(credenciales?.password ?? "");
        if (!email || !password) return null;

        const resultado = await autenticar(db, email, password);
        if (!resultado.ok) return null;

        const { id, email: correo, nombre, rol } = resultado.usuario;
        return { id, email: correo, nombre, rol };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.nombre = (user as any).nombre;
        token.rol = (user as any).rol;
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        nombre: token.nombre as string,
        rol: token.rol as "admin" | "editor",
      } as any;
      return session;
    },
  },
});
```

Crear `src/app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;
```

- [ ] **Step 6: Pantalla de acceso**

Crear `src/app/admin/login/formulario.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function FormularioAcceso() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(e: FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const resultado = await signIn("credentials", { email, password, redirect: false });

    if (resultado?.error) {
      // Mensaje único a propósito: no revela si el correo existe ni si la
      // cuenta está bloqueada o desactivada.
      setError("Correo o contraseña incorrectos. Si fallas cinco veces, la cuenta se bloquea 15 minutos.");
      setEnviando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={alEnviar} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-texto-principal mb-1">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-borde px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-texto-principal mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-borde px-3 py-2"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-verde-antioquia px-4 py-2.5 font-medium text-white disabled:opacity-60"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
```

Crear `src/app/admin/login/page.tsx`:

```tsx
import type { Metadata } from "next";
import FormularioAcceso from "./formulario";

export const metadata: Metadata = {
  title: "Entrar — Administración",
  robots: { index: false, follow: false },
};

export default function PaginaAcceso() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-arena">
      <div className="text-center">
        <h1 className="font-display text-2xl text-texto-principal">Administración del sitio</h1>
        <p className="mt-1 text-sm text-texto-secundario">Gallón Memorias</p>
      </div>
      <FormularioAcceso />
    </main>
  );
}
```

- [ ] **Step 7: Middleware**

Crear `middleware.ts` en la raíz del repositorio:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(peticion: NextRequest) {
  const { pathname } = peticion.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  // Comprobación barata de presencia de cookie de sesión. La verificación
  // real de rol y validez la hace cada Server Action con requerirSesion().
  const cookie =
    peticion.cookies.get("authjs.session-token") ??
    peticion.cookies.get("__Secure-authjs.session-token");

  if (!cookie) {
    const destino = new URL("/admin/login", peticion.url);
    return NextResponse.redirect(destino);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
```

- [ ] **Step 8: Excluir el panel de los buscadores**

Reemplazar el contenido de `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/auth"],
    },
    sitemap: "https://gallonantioquia.vercel.app/sitemap.xml",
  };
}
```

Nota: el archivo apuntaba a `https://www.gallonantioquia.com/sitemap.xml` mientras `sitemap.ts` usa `https://gallonantioquia.vercel.app`. Se unifica en el dominio de Vercel, que es el que está en línea. Si más adelante se conecta el dominio propio, se cambian ambos a la vez.

- [ ] **Step 9: Verificación manual**

```bash
npm run dev
```

- Abrir `http://localhost:3000/admin` → debe redirigir a `/admin/login`.
- Entrar con credenciales incorrectas → mensaje de error, sin pistas sobre el correo.
- Entrar con credenciales correctas (crear un usuario antes con `npm run db:migrar-contenido` y la tarea 8, o insertarlo a mano) → llega a `/admin`.

- [ ] **Step 10: Commit**

```bash
git add src/lib/auth src/app/admin src/app/api middleware.ts src/app/robots.ts tests/auth package.json package-lock.json
git commit -m "feat: sesión, pantalla de acceso y protección de /admin"
```

---

### Task 8: Gestión de usuarios

**Files:**
- Create: `src/lib/auth/acciones.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/usuarios/page.tsx`
- Create: `src/components/admin/BarraLateral.tsx`
- Create: `src/components/admin/TablaUsuarios.tsx`
- Create: `scripts/crear-admin.ts`
- Create: `tests/auth/acciones.test.ts`
- Modify: `package.json` (script `crear-admin`)

**Interfaces:**
- Consumes: `requerirAdmin()`, `crearUsuario()`, tabla `usuarios`.
- Produces (Server Actions, todas devuelven `{ ok: true } | { ok: false; error: string }`):
  - `invitarUsuario(datos: FormData)`
  - `cambiarRol(id: string, rol: "admin" | "editor")`
  - `cambiarEstado(id: string, activo: boolean)`
  - Y la regla pura `puedeDesactivar(objetivo, actorId, adminsActivos): { ok: boolean; error?: string }`, exportada aparte para poder probarla sin base de datos.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/auth/acciones.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { puedeDesactivar } from "@/lib/auth/acciones";

const admin = { id: "a1", rol: "admin" as const, activo: true };
const otroAdmin = { id: "a2", rol: "admin" as const, activo: true };
const editor = { id: "e1", rol: "editor" as const, activo: true };

describe("reglas de desactivación", () => {
  it("un admin no puede desactivarse a sí mismo", () => {
    const r = puedeDesactivar(admin, "a1", 2);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("a ti");
  });

  it("no se puede desactivar al último admin activo", () => {
    const r = puedeDesactivar(otroAdmin, "a1", 1);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("último administrador");
  });

  it("se puede desactivar a otro admin si queda alguno más", () => {
    expect(puedeDesactivar(otroAdmin, "a1", 2).ok).toBe(true);
  });

  it("se puede desactivar a un editor siempre", () => {
    expect(puedeDesactivar(editor, "a1", 1).ok).toBe(true);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/auth/acciones.test.ts`
Expected: FAIL — no existe `@/lib/auth/acciones`.

- [ ] **Step 3: Implementar las acciones**

Crear `src/lib/auth/acciones.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { and, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/esquema";
import { requerirAdmin } from "./sesion";
import { crearUsuario } from "./usuarios";

export type Resultado = { ok: true } | { ok: false; error: string };

/** Regla pura, separada para poder probarla sin base de datos. */
export function puedeDesactivar(
  objetivo: { id: string; rol: "admin" | "editor" },
  actorId: string,
  adminsActivos: number
): { ok: boolean; error?: string } {
  if (objetivo.id === actorId) {
    return { ok: false, error: "No puedes desactivarte a ti mismo." };
  }
  if (objetivo.rol === "admin" && adminsActivos <= 1) {
    return { ok: false, error: "No puedes desactivar al último administrador activo." };
  }
  return { ok: true };
}

async function contarAdminsActivos(): Promise<number> {
  const [fila] = await db
    .select({ n: count() })
    .from(usuarios)
    .where(and(eq(usuarios.rol, "admin"), eq(usuarios.activo, true)));
  return Number(fila.n);
}

export async function invitarUsuario(datos: FormData): Promise<Resultado> {
  await requerirAdmin();

  const email = String(datos.get("email") ?? "").trim().toLowerCase();
  const nombre = String(datos.get("nombre") ?? "").trim();
  const rol = String(datos.get("rol") ?? "editor") as "admin" | "editor";
  const password = String(datos.get("password") ?? "");

  if (!email || !nombre) return { ok: false, error: "El nombre y el correo son obligatorios." };

  try {
    await crearUsuario(db, { email, nombre, password, rol });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "No se pudo crear el usuario.";
    return { ok: false, error: mensaje.includes("unique") ? "Ese correo ya tiene cuenta." : mensaje };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function cambiarRol(id: string, rol: "admin" | "editor"): Promise<Resultado> {
  const actor = await requerirAdmin();

  if (id === actor.id && rol !== "admin") {
    return { ok: false, error: "No puedes quitarte a ti mismo el rol de administrador." };
  }
  if (rol === "editor" && (await contarAdminsActivos()) <= 1) {
    return { ok: false, error: "No puedes dejar el sitio sin administradores." };
  }

  await db.update(usuarios).set({ rol }).where(eq(usuarios.id, id));
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function cambiarEstado(id: string, activo: boolean): Promise<Resultado> {
  const actor = await requerirAdmin();

  if (!activo) {
    const [objetivo] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    if (!objetivo) return { ok: false, error: "Ese usuario no existe." };

    const permiso = puedeDesactivar(objetivo, actor.id, await contarAdminsActivos());
    if (!permiso.ok) return { ok: false, error: permiso.error! };
  }

  await db
    .update(usuarios)
    .set({ activo, intentosFallidos: 0, bloqueadoHasta: null })
    .where(eq(usuarios.id, id));

  revalidatePath("/admin/usuarios");
  return { ok: true };
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/auth/acciones.test.ts`
Expected: PASS, 4 pruebas.

- [ ] **Step 5: Envoltura del panel**

Crear `src/components/admin/BarraLateral.tsx`:

```tsx
import Link from "next/link";
import { LISTA_TIPOS } from "@/lib/admin/tipos";

export default function BarraLateral({ rol }: { rol: "admin" | "editor" }) {
  return (
    <nav aria-label="Secciones del panel" className="w-56 shrink-0 border-r border-borde p-4">
      <Link href="/admin" className="block font-medium text-texto-principal mb-4">
        Resumen
      </Link>

      <p className="text-xs uppercase tracking-wide text-texto-terciario mb-2">Contenido</p>
      <ul className="space-y-1 mb-6">
        {LISTA_TIPOS.map((t) => (
          <li key={t.tipo}>
            <Link href={`/admin/${t.rutaAdmin}`} className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia">
              {t.etiqueta}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs uppercase tracking-wide text-texto-terciario mb-2">Sitio</p>
      <ul className="space-y-1">
        <li>
          <Link href="/admin/medios" className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia">
            Fotos
          </Link>
        </li>
        <li>
          <Link href="/admin/papelera" className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia">
            Papelera
          </Link>
        </li>
        {rol === "admin" && (
          <>
            <li>
              <Link href="/admin/ajustes" className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia">
                Ajustes
              </Link>
            </li>
            <li>
              <Link href="/admin/usuarios" className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia">
                Usuarios
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
```

Crear `src/app/admin/layout.tsx`:

```tsx
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth/config";
import BarraLateral from "@/components/admin/BarraLateral";

export const metadata = { robots: { index: false, follow: false } };

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sesion = await auth();
  if (!sesion?.user) redirect("/admin/login");

  const usuario = sesion.user as { nombre: string; rol: "admin" | "editor" };

  return (
    <div className="min-h-screen flex bg-white">
      <BarraLateral rol={usuario.rol} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-borde px-6 py-3">
          <span className="text-sm text-texto-secundario">
            {usuario.nombre} · {usuario.rol === "admin" ? "Administrador" : "Editor"}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="text-sm text-texto-secundario hover:text-verde-antioquia">
              Salir
            </button>
          </form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

**Importante:** `src/app/admin/login/page.tsx` queda dentro de este layout y entraría en un ciclo de redirección. Mover el acceso fuera del layout protegido creando el grupo de rutas `src/app/admin/(publico)/login/page.tsx` **no** sirve, porque el layout de `/admin` sigue aplicando. La solución correcta en App Router es mover la carpeta a `src/app/(admin-publico)/admin/login/` — un grupo de rutas hermano que conserva la URL `/admin/login` sin heredar el layout de `/admin`. Hacer ese movimiento ahora:

```bash
mkdir -p "src/app/(admin-publico)/admin/login"
git mv src/app/admin/login/page.tsx "src/app/(admin-publico)/admin/login/page.tsx"
git mv src/app/admin/login/formulario.tsx "src/app/(admin-publico)/admin/login/formulario.tsx"
rmdir src/app/admin/login
```

- [ ] **Step 6: Pantalla de usuarios y resumen**

Crear `src/app/admin/usuarios/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth/config";
import { db } from "@/db";
import { usuarios } from "@/db/esquema";
import TablaUsuarios from "@/components/admin/TablaUsuarios";

export default async function PaginaUsuarios() {
  const sesion = await auth();
  const actor = sesion?.user as { id: string; rol: string } | undefined;
  if (actor?.rol !== "admin") redirect("/admin");

  const filas = await db.select().from(usuarios).orderBy(desc(usuarios.creadoEn));

  return (
    <>
      <h1 className="font-display text-2xl mb-6">Usuarios</h1>
      <TablaUsuarios filas={filas} actorId={actor.id} />
    </>
  );
}
```

Crear `src/components/admin/TablaUsuarios.tsx` como componente cliente que renderiza la tabla (nombre, correo, rol, estado, último acceso), un formulario de invitación con `invitarUsuario`, y por fila los controles que llaman `cambiarRol` y `cambiarEstado`, mostrando el `error` devuelto en un `role="alert"`.

Crear `src/app/admin/page.tsx` con el resumen: por cada tipo de `LISTA_TIPOS`, cuántos publicados y cuántos borradores, con enlace a la sección.

- [ ] **Step 7: Script para crear el primer administrador**

Crear `scripts/crear-admin.ts`:

```ts
import { db } from "@/db";
import { crearUsuario } from "@/lib/auth/usuarios";

const [email, nombre, password] = process.argv.slice(2);

if (!email || !nombre || !password) {
  console.error('Uso: npm run crear-admin -- correo@dominio.co "Nombre" "contraseña"');
  process.exit(1);
}

crearUsuario(db, { email, nombre, password, rol: "admin" })
  .then((u) => console.log(`Administrador creado: ${u.email}`))
  .catch((e) => {
    console.error("No se pudo crear:", e.message);
    process.exit(1);
  });
```

Agregar a `scripts` de `package.json`:

```json
"crear-admin": "tsx scripts/crear-admin.ts"
```

- [ ] **Step 8: Verificación manual**

```bash
npm run crear-admin -- cristian@inplux.co "Cristian" "una-clave-larga-2026"
npm run dev
```

Entrar en `/admin/login`, verificar que la barra lateral muestra Ajustes y Usuarios, invitar a un editor, comprobar que al entrar como ese editor **no** aparecen esas dos entradas, y que intentar desactivarse a uno mismo devuelve el error.

- [ ] **Step 9: Commit**

```bash
git add src/lib/auth src/app scripts tests/auth src/components/admin package.json
git commit -m "feat: gestión de usuarios y envoltura del panel"
```

---

## Fase 3 — Contenido

### Task 9: Consultas cacheadas y acciones de contenido

El corazón del módulo. Las lecturas del sitio público se cachean por etiqueta; las escrituras del panel invalidan esa etiqueta. Así el visitante recibe HTML estático y el editor ve su cambio en segundos.

**Files:**
- Create: `src/lib/contenidos/consultas.ts`
- Create: `src/lib/contenidos/acciones.ts`
- Create: `tests/contenidos/consultas.test.ts`
- Create: `tests/contenidos/acciones.test.ts`

**Interfaces:**
- Consumes: `db`, tablas, `esquemaContenido`, `sanitizarHtml`, `generarSlug`, `requerirSesion`, `requerirAdmin`.
- Produces:
  - `etiquetaDe(tipo: TipoContenido): string` → `"contenido:columna"`.
  - `listarPublicados(tipo): Promise<ContenidoConImagen[]>` — cacheada.
  - `obtenerPublicado(tipo, slug): Promise<ContenidoConImagen | null>` — cacheada.
  - `listarParaPanel(tipo, filtros): Promise<ContenidoConImagen[]>` — sin caché.
  - `guardarContenido(tipo, id: string | null, datos: FormData): Promise<ResultadoGuardar>` donde
    `ResultadoGuardar = { ok: true; id: string } | { ok: false; errores: Record<string, string> }`.
  - `cambiarEstadoContenido(id, estado): Promise<Resultado>`
  - `borrarContenido(id): Promise<Resultado>` (borrado suave)
  - `restaurarContenido(id): Promise<Resultado>`
  - `reordenarContenido(id: string, direccion: "arriba" | "abajo"): Promise<Resultado>` — la usa el listado de la tarea 10 en los tipos con `ordenPor: "orden"`.
  - `ContenidoConImagen = Contenido & { imagenUrl: string | null; imagenAlt: string | null }`.

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `tests/contenidos/consultas.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos } from "@/db/esquema";
import { etiquetaDe, consultarPublicados, consultarPublicado } from "@/lib/contenidos/consultas";

async function sembrar() {
  const ctx = await crearDbPrueba();
  await ctx.db.insert(contenidos).values([
    { tipo: "columna", slug: "a", titulo: "A", fecha: "2026-03-01", estado: "publicado" },
    { tipo: "columna", slug: "b", titulo: "B", fecha: "2026-01-01", estado: "publicado" },
    { tipo: "columna", slug: "c", titulo: "C", fecha: "2026-02-01", estado: "borrador" },
    { tipo: "columna", slug: "d", titulo: "D", fecha: "2026-04-01", estado: "publicado", eliminadoEn: new Date() },
    { tipo: "idea", slug: "i1", titulo: "I1", fecha: "2026-01-01", estado: "publicado", orden: 2 },
    { tipo: "idea", slug: "i2", titulo: "I2", fecha: "2026-01-01", estado: "publicado", orden: 1 },
  ]);
  return ctx;
}

describe("consultas públicas", () => {
  it("nombra las etiquetas de caché por tipo", () => {
    expect(etiquetaDe("columna")).toBe("contenido:columna");
    expect(etiquetaDe("episodio")).toBe("contenido:episodio");
  });

  it("devuelve solo lo publicado y no borrado", async () => {
    const { db, cerrar } = await sembrar();
    const filas = await consultarPublicados(db, "columna");
    expect(filas.map((f) => f.slug)).toEqual(["a", "b"]);
    await cerrar();
  });

  it("ordena las columnas por fecha descendente", async () => {
    const { db, cerrar } = await sembrar();
    const filas = await consultarPublicados(db, "columna");
    expect(filas[0].slug).toBe("a");
    await cerrar();
  });

  it("ordena las ideas por el campo orden", async () => {
    const { db, cerrar } = await sembrar();
    const filas = await consultarPublicados(db, "idea");
    expect(filas.map((f) => f.slug)).toEqual(["i2", "i1"]);
    await cerrar();
  });

  it("obtiene uno por slug y devuelve null si es borrador", async () => {
    const { db, cerrar } = await sembrar();
    expect((await consultarPublicado(db, "columna", "a"))?.titulo).toBe("A");
    expect(await consultarPublicado(db, "columna", "c")).toBeNull();
    expect(await consultarPublicado(db, "columna", "d")).toBeNull();
    await cerrar();
  });
});
```

Crear `tests/contenidos/acciones.test.ts`, que prueba la lógica pura de preparación de la fila, sin Next ni sesión:

```ts
import { describe, it, expect } from "vitest";
import { prepararFila } from "@/lib/contenidos/acciones";

const FORM = {
  slug: "",
  titulo: "Puerto Pisisí, ahora sí",
  resumen: "Un resumen.",
  cuerpoHtml: '<p>Cuerpo</p><script>alert(1)</script>',
  fecha: "2026-01-10",
  categoria: "2026",
  estado: "publicado",
  destacado: "false",
  orden: "0",
  imagenId: "",
  extra: JSON.stringify({ sourceUrl: "https://alponiente.com/x/", readTime: "5 min" }),
};

describe("prepararFila", () => {
  it("genera el slug desde el título cuando viene vacío", () => {
    const r = prepararFila("columna", FORM);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.fila.slug).toBe("puerto-pisisi-ahora-si");
  });

  it("sanitiza el cuerpo antes de guardar", () => {
    const r = prepararFila("columna", FORM);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.fila.cuerpoHtml).toBe("<p>Cuerpo</p>");
      expect(r.fila.cuerpoHtml).not.toContain("script");
    }
  });

  it("convierte imagenId vacío en null en vez de cadena vacía", () => {
    const r = prepararFila("columna", FORM);
    if (r.ok) expect(r.fila.imagenId).toBeNull();
  });

  it("devuelve errores por campo cuando la validación falla", () => {
    const r = prepararFila("columna", { ...FORM, titulo: "", fecha: "10/01/2026" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errores).toHaveProperty("titulo");
      expect(r.errores).toHaveProperty("fecha");
    }
  });

  it("rechaza una categoría fuera de la taxonomía", () => {
    const r = prepararFila("columna", { ...FORM, categoria: "1999" });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que fallan**

Run: `npm test -- tests/contenidos`
Expected: FAIL — no existen los módulos.

- [ ] **Step 3: Implementar las consultas**

Crear `src/lib/contenidos/consultas.ts`:

```ts
import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { contenidos, medios, type Contenido } from "@/db/esquema";
import { TIPOS, type TipoContenido } from "@/lib/admin/tipos";

export type ContenidoConImagen = Contenido & {
  imagenUrl: string | null;
  imagenAlt: string | null;
};

export function etiquetaDe(tipo: TipoContenido): string {
  return `contenido:${tipo}`;
}

const SELECCION = {
  id: contenidos.id,
  tipo: contenidos.tipo,
  slug: contenidos.slug,
  titulo: contenidos.titulo,
  resumen: contenidos.resumen,
  cuerpoHtml: contenidos.cuerpoHtml,
  imagenId: contenidos.imagenId,
  fecha: contenidos.fecha,
  categoria: contenidos.categoria,
  estado: contenidos.estado,
  destacado: contenidos.destacado,
  orden: contenidos.orden,
  extra: contenidos.extra,
  autorId: contenidos.autorId,
  creadoEn: contenidos.creadoEn,
  actualizadoEn: contenidos.actualizadoEn,
  eliminadoEn: contenidos.eliminadoEn,
  imagenUrl: medios.url,
  imagenAlt: medios.alt,
};

/** Sin caché, recibe la conexión: así se puede probar contra PGlite. */
export async function consultarPublicados(
  conexion: any,
  tipo: TipoContenido
): Promise<ContenidoConImagen[]> {
  const orden =
    TIPOS[tipo].ordenPor === "orden" ? asc(contenidos.orden) : desc(contenidos.fecha);

  return conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(
      and(
        eq(contenidos.tipo, tipo),
        eq(contenidos.estado, "publicado"),
        isNull(contenidos.eliminadoEn)
      )
    )
    .orderBy(orden);
}

export async function consultarPublicado(
  conexion: any,
  tipo: TipoContenido,
  slug: string
): Promise<ContenidoConImagen | null> {
  const [fila] = await conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(
      and(
        eq(contenidos.tipo, tipo),
        eq(contenidos.slug, slug),
        eq(contenidos.estado, "publicado"),
        isNull(contenidos.eliminadoEn)
      )
    );

  return fila ?? null;
}

/**
 * Versión cacheada que consume el sitio público. La etiqueta permite que
 * publicar desde el panel regenere estas páginas sin rebuild.
 */
export function listarPublicados(tipo: TipoContenido) {
  return unstable_cache(
    () => consultarPublicados(db, tipo),
    ["contenidos", tipo],
    { tags: [etiquetaDe(tipo)] }
  )();
}

export function obtenerPublicado(tipo: TipoContenido, slug: string) {
  return unstable_cache(
    () => consultarPublicado(db, tipo, slug),
    ["contenido", tipo, slug],
    { tags: [etiquetaDe(tipo)] }
  )();
}

/** Lecturas del panel: sin caché, incluyen borradores. */
export async function listarParaPanel(
  tipo: TipoContenido,
  filtros: { estado?: "borrador" | "publicado"; busqueda?: string } = {}
): Promise<ContenidoConImagen[]> {
  const condiciones = [eq(contenidos.tipo, tipo), isNull(contenidos.eliminadoEn)];
  if (filtros.estado) condiciones.push(eq(contenidos.estado, filtros.estado));

  const filas = await db
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(and(...condiciones))
    .orderBy(TIPOS[tipo].ordenPor === "orden" ? asc(contenidos.orden) : desc(contenidos.fecha));

  if (!filtros.busqueda) return filas;

  const aguja = filtros.busqueda.toLowerCase();
  return filas.filter((f) => f.titulo.toLowerCase().includes(aguja));
}
```

- [ ] **Step 4: Implementar las acciones**

Crear `src/lib/contenidos/acciones.ts`:

```ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contenidos, type NuevoContenido } from "@/db/esquema";
import { TIPOS, type TipoContenido } from "@/lib/admin/tipos";
import { esquemaContenido } from "@/lib/admin/esquemas";
import { sanitizarHtml } from "@/lib/admin/sanitizar";
import { generarSlug } from "@/lib/admin/slug";
import { requerirSesion } from "@/lib/auth/sesion";
import { etiquetaDe } from "./consultas";

export type Resultado = { ok: true } | { ok: false; error: string };
export type ResultadoGuardar =
  | { ok: true; id: string }
  | { ok: false; errores: Record<string, string> };

type Crudo = Record<string, string>;

/**
 * Lógica pura: valida el formulario y arma la fila lista para escribir.
 * Separada de la Server Action para poder probarla sin Next ni sesión.
 */
export function prepararFila(
  tipo: TipoContenido,
  crudo: Crudo
):
  | { ok: true; fila: Omit<NuevoContenido, "tipo"> }
  | { ok: false; errores: Record<string, string> } {
  const slug = crudo.slug?.trim() || generarSlug(crudo.titulo ?? "");

  const candidato = {
    slug,
    titulo: crudo.titulo ?? "",
    resumen: crudo.resumen || null,
    cuerpoHtml: TIPOS[tipo].usaCuerpo ? sanitizarHtml(crudo.cuerpoHtml ?? "") : null,
    fecha: crudo.fecha ?? "",
    categoria: TIPOS[tipo].taxonomia ? crudo.categoria || null : null,
    estado: (crudo.estado ?? "borrador") as "borrador" | "publicado",
    destacado: crudo.destacado === "true",
    orden: Number(crudo.orden ?? 0),
    imagenId: crudo.imagenId?.trim() ? crudo.imagenId : null,
    extra: JSON.parse(crudo.extra || "{}"),
  };

  const resultado = esquemaContenido(tipo).safeParse(candidato);

  if (!resultado.success) {
    const errores: Record<string, string> = {};
    for (const problema of resultado.error.issues) {
      errores[problema.path.join(".")] = problema.message;
    }
    return { ok: false, errores };
  }

  return { ok: true, fila: { ...resultado.data, imagenId: candidato.imagenId } as any };
}

function crudoDesdeFormData(datos: FormData): Crudo {
  const crudo: Crudo = {};
  datos.forEach((valor, clave) => {
    crudo[clave] = String(valor);
  });
  return crudo;
}

export async function guardarContenido(
  tipo: TipoContenido,
  id: string | null,
  datos: FormData
): Promise<ResultadoGuardar> {
  const usuario = await requerirSesion();

  const preparado = prepararFila(tipo, crudoDesdeFormData(datos));
  if (!preparado.ok) return preparado;

  let idFinal = id;

  try {
    if (id) {
      await db
        .update(contenidos)
        .set({ ...preparado.fila, actualizadoEn: new Date() })
        .where(eq(contenidos.id, id));
    } else {
      const [fila] = await db
        .insert(contenidos)
        .values({ ...preparado.fila, tipo, autorId: usuario.id })
        .returning({ id: contenidos.id });
      idFinal = fila.id;
    }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "";
    if (mensaje.includes("contenidos_tipo_slug_vivo")) {
      return { ok: false, errores: { slug: "Ya existe otro contenido con esa dirección." } };
    }
    return { ok: false, errores: { general: "No se pudo guardar. Intenta de nuevo." } };
  }

  revalidateTag(etiquetaDe(tipo));
  revalidatePath(`/admin/${TIPOS[tipo].rutaAdmin}`);
  return { ok: true, id: idFinal! };
}

export async function cambiarEstadoContenido(
  id: string,
  estado: "borrador" | "publicado"
): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(contenidos)
    .set({ estado, actualizadoEn: new Date() })
    .where(eq(contenidos.id, id))
    .returning({ tipo: contenidos.tipo });

  if (!fila) return { ok: false, error: "Ese contenido no existe." };

  revalidateTag(etiquetaDe(fila.tipo));
  revalidatePath(`/admin/${TIPOS[fila.tipo].rutaAdmin}`);
  return { ok: true };
}

export async function borrarContenido(id: string): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(contenidos)
    .set({ eliminadoEn: new Date() })
    .where(eq(contenidos.id, id))
    .returning({ tipo: contenidos.tipo });

  if (!fila) return { ok: false, error: "Ese contenido no existe." };

  revalidateTag(etiquetaDe(fila.tipo));
  revalidatePath(`/admin/${TIPOS[fila.tipo].rutaAdmin}`);
  revalidatePath("/admin/papelera");
  return { ok: true };
}

export async function restaurarContenido(id: string): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(contenidos)
    .set({ eliminadoEn: null, estado: "borrador" })
    .where(eq(contenidos.id, id))
    .returning({ tipo: contenidos.tipo });

  if (!fila) return { ok: false, error: "Ese contenido no existe." };

  revalidateTag(etiquetaDe(fila.tipo));
  revalidatePath("/admin/papelera");
  return { ok: true };
}
```

**Nota sobre restaurar:** vuelve siempre a `borrador`, aunque estuviera publicado al borrarse. Restaurar no debe republicar algo en el sitio sin que alguien lo decida.

- [ ] **Step 5: Reordenamiento, para ideas y episodios**

Estos dos tipos van numerados y se ordenan por `orden`, no por fecha. La operación intercambia el `orden` con el vecino, de modo que no haya huecos ni empates.

Escribir primero la prueba, en `tests/contenidos/orden.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { asc } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos } from "@/db/esquema";
import { intercambiarOrden } from "@/lib/contenidos/acciones";

async function sembrarIdeas() {
  const ctx = await crearDbPrueba();
  await ctx.db.insert(contenidos).values([
    { tipo: "idea", slug: "a", titulo: "A", fecha: "2026-01-01", orden: 0 },
    { tipo: "idea", slug: "b", titulo: "B", fecha: "2026-01-01", orden: 1 },
    { tipo: "idea", slug: "c", titulo: "C", fecha: "2026-01-01", orden: 2 },
  ]);
  return ctx;
}

async function slugsEnOrden(db: any) {
  const filas = await db.select().from(contenidos).orderBy(asc(contenidos.orden));
  return filas.map((f: any) => f.slug);
}

describe("reordenamiento", () => {
  it("sube un elemento intercambiándolo con el anterior", async () => {
    const { db, cerrar } = await sembrarIdeas();
    const [b] = await db.select().from(contenidos).where(eq(contenidos.slug, "b"));

    await intercambiarOrden(db, b.id, "arriba");
    expect(await slugsEnOrden(db)).toEqual(["b", "a", "c"]);
    await cerrar();
  });

  it("baja un elemento intercambiándolo con el siguiente", async () => {
    const { db, cerrar } = await sembrarIdeas();
    const [b] = await db.select().from(contenidos).where(eq(contenidos.slug, "b"));

    await intercambiarOrden(db, b.id, "abajo");
    expect(await slugsEnOrden(db)).toEqual(["a", "c", "b"]);
    await cerrar();
  });

  it("no hace nada si ya está en el extremo", async () => {
    const { db, cerrar } = await sembrarIdeas();
    const [a] = await db.select().from(contenidos).where(eq(contenidos.slug, "a"));

    await intercambiarOrden(db, a.id, "arriba");
    expect(await slugsEnOrden(db)).toEqual(["a", "b", "c"]);
    await cerrar();
  });

  it("ignora los borrados al buscar el vecino", async () => {
    const { db, cerrar } = await sembrarIdeas();
    await db.update(contenidos).set({ eliminadoEn: new Date() }).where(eq(contenidos.slug, "b"));
    const [c] = await db.select().from(contenidos).where(eq(contenidos.slug, "c"));

    await intercambiarOrden(db, c.id, "arriba");
    const vivos = await db
      .select()
      .from(contenidos)
      .where(isNull(contenidos.eliminadoEn))
      .orderBy(asc(contenidos.orden));
    expect(vivos.map((f: any) => f.slug)).toEqual(["c", "a"]);
    await cerrar();
  });
});
```

Añadir el `import { eq, isNull } from "drizzle-orm"` que usan las pruebas.

Run: `npm test -- tests/contenidos/orden.test.ts`
Expected: FAIL — `intercambiarOrden` no existe.

Agregar a `src/lib/contenidos/acciones.ts`:

```ts
import { and, asc, desc, eq, isNull, lt, gt } from "drizzle-orm";

/** Lógica de intercambio, recibe la conexión para poder probarla con PGlite. */
export async function intercambiarOrden(
  conexion: any,
  id: string,
  direccion: "arriba" | "abajo"
): Promise<Resultado> {
  const [actual] = await conexion.select().from(contenidos).where(eq(contenidos.id, id));
  if (!actual) return { ok: false, error: "Ese contenido no existe." };

  const [vecino] = await conexion
    .select()
    .from(contenidos)
    .where(
      and(
        eq(contenidos.tipo, actual.tipo),
        isNull(contenidos.eliminadoEn),
        direccion === "arriba"
          ? lt(contenidos.orden, actual.orden)
          : gt(contenidos.orden, actual.orden)
      )
    )
    .orderBy(direccion === "arriba" ? desc(contenidos.orden) : asc(contenidos.orden))
    .limit(1);

  // Ya está en el extremo: no es un error, simplemente no hay nada que hacer.
  if (!vecino) return { ok: true };

  await conexion.update(contenidos).set({ orden: vecino.orden }).where(eq(contenidos.id, actual.id));
  await conexion.update(contenidos).set({ orden: actual.orden }).where(eq(contenidos.id, vecino.id));

  return { ok: true };
}

export async function reordenarContenido(
  id: string,
  direccion: "arriba" | "abajo"
): Promise<Resultado> {
  await requerirSesion();

  const resultado = await intercambiarOrden(db, id, direccion);
  if (!resultado.ok) return resultado;

  const [fila] = await db.select({ tipo: contenidos.tipo }).from(contenidos).where(eq(contenidos.id, id));
  if (fila) {
    revalidateTag(etiquetaDe(fila.tipo));
    revalidatePath(`/admin/${TIPOS[fila.tipo].rutaAdmin}`);
  }
  return { ok: true };
}
```

Run: `npm test -- tests/contenidos/orden.test.ts`
Expected: PASS, 4 pruebas.

- [ ] **Step 6: Ejecutar todas las pruebas de contenidos**

Run: `npm test -- tests/contenidos`
Expected: PASS, 14 pruebas.

- [ ] **Step 6: Commit**

```bash
git add src/lib/contenidos tests/contenidos
git commit -m "feat: consultas cacheadas y acciones de contenido"
```

Renumerar: el commit pasa a ser el **Step 7** de esta tarea.

---

### Task 10: Listado parametrizado de secciones

Una sola pantalla sirve a las seis secciones. La ruta `/admin/[seccion]` resuelve el segmento contra `configPorRutaAdmin`; si no coincide, `notFound()`.

**Files:**
- Create: `src/app/admin/[seccion]/page.tsx`
- Create: `src/components/admin/ListadoContenidos.tsx`
- Create: `src/components/admin/FilaContenido.tsx`
- Create: `tests/admin/rutas.test.ts`

**Interfaces:**
- Consumes: `configPorRutaAdmin`, `listarParaPanel`, `cambiarEstadoContenido`, `borrarContenido`.
- Produces: nada que consuman tareas posteriores, salvo la convención de URL `/admin/<rutaAdmin>/<id>` y `/admin/<rutaAdmin>/nuevo` que usa la tarea 11.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/admin/rutas.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { LISTA_TIPOS, configPorRutaAdmin } from "@/lib/admin/tipos";

describe("rutas del panel", () => {
  it("cada tipo tiene una ruta de panel única", () => {
    const rutas = LISTA_TIPOS.map((t) => t.rutaAdmin);
    expect(new Set(rutas).size).toBe(rutas.length);
  });

  it("ninguna ruta de tipo choca con una sección fija del panel", () => {
    const fijas = ["medios", "ajustes", "usuarios", "papelera", "login", "nuevo"];
    for (const t of LISTA_TIPOS) {
      expect(fijas, `la ruta ${t.rutaAdmin} choca con una sección fija`).not.toContain(t.rutaAdmin);
    }
  });

  it("resuelve todas las rutas declaradas", () => {
    for (const t of LISTA_TIPOS) {
      expect(configPorRutaAdmin(t.rutaAdmin)?.tipo).toBe(t.tipo);
    }
  });
});
```

- [ ] **Step 2: Ejecutar y verificar**

Run: `npm test -- tests/admin/rutas.test.ts`
Expected: PASS de entrada — es una prueba de regresión sobre la configuración de la tarea 3. Si falla, hay un choque real de rutas que corregir en `tipos.ts` antes de seguir.

- [ ] **Step 3: Escribir la página**

Crear `src/app/admin/[seccion]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { configPorRutaAdmin } from "@/lib/admin/tipos";
import { listarParaPanel } from "@/lib/contenidos/consultas";
import ListadoContenidos from "@/components/admin/ListadoContenidos";

type Props = {
  params: Promise<{ seccion: string }>;
  searchParams: Promise<{ estado?: string; q?: string }>;
};

export default async function PaginaSeccion({ params, searchParams }: Props) {
  const { seccion } = await params;
  const { estado, q } = await searchParams;

  const config = configPorRutaAdmin(seccion);
  if (!config) notFound();

  const filas = await listarParaPanel(config.tipo, {
    estado: estado === "borrador" || estado === "publicado" ? estado : undefined,
    busqueda: q,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl">{config.etiqueta}</h1>
          <p className="text-sm text-texto-secundario mt-1">
            {filas.length} {filas.length === 1 ? config.singular : `${config.singular}s`}
          </p>
        </div>
        <Link
          href={`/admin/${config.rutaAdmin}/nuevo`}
          className="rounded-lg bg-verde-antioquia px-4 py-2 text-sm font-medium text-white"
        >
          {config.articulo === "la" ? "Nueva" : "Nuevo"} {config.singular}
        </Link>
      </div>

      <ListadoContenidos config={config} filas={filas} filtroEstado={estado ?? ""} busqueda={q ?? ""} />
    </>
  );
}
```

- [ ] **Step 4: Escribir los componentes del listado**

Crear `src/components/admin/ListadoContenidos.tsx` (componente cliente) con:

- Un campo de búsqueda y un selector de estado que actualizan `searchParams` con `router.replace`.
- Una tabla con columnas: título, taxonomía (solo si `config.taxonomia`), fecha, estado y acciones.
- Cuando `config.ordenPor === "orden"`, los controles de subir/bajar que llaman una acción de reordenamiento; cuando es `"fecha"`, no se muestran.
- Estado vacío con texto explícito: `No hay ${config.singular}s todavía. Crea la primera con el botón de arriba.`

Crear `src/components/admin/FilaContenido.tsx` con los botones por fila: **Editar** (enlace a `/admin/<ruta>/<id>`), **Publicar/Despublicar** (llama `cambiarEstadoContenido`) y **Borrar** (llama `borrarContenido` tras un diálogo de confirmación propio, no `window.confirm`).

**No usar `window.confirm` ni `alert`**: bloquean el hilo y, en un panel que se opera desde el navegador, dejan la pestaña sin responder. Usar un `<dialog>` o un panel de confirmación en línea.

- [ ] **Step 5: Verificación manual**

```bash
npm run dev
```

Recorrer `/admin/columnas`, `/admin/bitacora`, `/admin/historias`, `/admin/ideas`, `/admin/voces`, `/admin/un-cafe`. Las columnas deben aparecer publicadas y las demás secciones en borrador. Visitar `/admin/inventada` y confirmar que da 404. Visitar `/admin/medios` y confirmar que **no** cae en esta pantalla.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin src/components/admin tests/admin
git commit -m "feat: listado parametrizado de las seis secciones"
```

---

### Task 11: Editor de contenido

**Files:**
- Create: `src/app/admin/[seccion]/[id]/page.tsx`
- Create: `src/components/admin/FormularioContenido.tsx`
- Create: `src/components/admin/EditorTexto.tsx`
- Create: `src/components/admin/CamposExtra.tsx`

**Interfaces:**
- Consumes: `configPorRutaAdmin`, `guardarContenido`, `TIPOS[tipo].camposExtra`.
- Produces: nada para tareas posteriores.

- [ ] **Step 1: Instalar Tiptap**

```bash
npm i @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link
```

- [ ] **Step 2: Escribir el editor de texto**

Crear `src/components/admin/EditorTexto.tsx`:

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface Props {
  valorInicial: string;
  /** Se llama en cada cambio; el formulario lo guarda en un input oculto. */
  alCambiar: (html: string) => void;
}

export default function EditorTexto({ valorInicial, alCambiar }: Props) {
  const editor = useEditor({
    // Necesario en App Router: evita el desajuste de hidratación.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: valorInicial,
    editorProps: {
      attributes: { class: "prose max-w-none min-h-[24rem] p-4 focus:outline-none" },
    },
    onUpdate: ({ editor }) => alCambiar(editor.getHTML()),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) return <div className="min-h-[24rem] rounded-lg border border-borde" />;

  const boton = (activo: boolean) =>
    `px-2 py-1 text-sm rounded ${activo ? "bg-verde-antioquia text-white" : "text-texto-secundario"}`;

  return (
    <div className="rounded-lg border border-borde">
      <div className="flex flex-wrap gap-1 border-b border-borde p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={boton(editor.isActive("bold"))}>
          Negrita
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={boton(editor.isActive("italic"))}>
          Cursiva
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={boton(editor.isActive("heading", { level: 2 }))}>
          Subtítulo
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={boton(editor.isActive("blockquote"))}>
          Cita
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={boton(editor.isActive("bulletList"))}>
          Lista
        </button>
        <button
          type="button"
          onClick={() => {
            const url = editor.getAttributes("link").href ?? "";
            const nueva = window.prompt("Dirección del enlace", url);
            if (nueva === null) return;
            if (nueva === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: nueva }).run();
          }}
          className={boton(editor.isActive("link"))}
        >
          Enlace
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
```

`window.prompt` es aceptable aquí: es puntual, no bloquea la automatización del panel y evita construir un diálogo entero para pegar una dirección. Los diálogos que sí se prohíben son los de confirmación en flujos de borrado.

- [ ] **Step 3: Escribir el formulario**

Crear `src/components/admin/CamposExtra.tsx`, que recibe `campos: CampoExtra[]` y el valor actual de `extra`, y renderiza un control por campo según `control` (`texto`, `url`, `numero`, `textarea`, `imagen`, `multiple`), mostrando `etiqueta`, `ayuda` y el error por campo si lo hay.

Crear `src/components/admin/FormularioContenido.tsx` (componente cliente) que:

- Arma un `FormData` con todos los campos comunes más `extra` serializado con `JSON.stringify`, tal como lo espera `prepararFila`.
- Genera el slug desde el título mientras el usuario no lo haya editado a mano, y lo deja editar después.
- Llama `guardarContenido(tipo, id, formData)` desde un `useTransition`.
- Pinta los errores devueltos junto a su campo, usando las claves de `errores` (`titulo`, `fecha`, `slug`, `extra.sourceUrl`, `general`).
- Ofrece dos botones: **Guardar borrador** (envía `estado=borrador`) y **Publicar** / **Despublicar** según el estado actual.
- Muestra el cuerpo con `EditorTexto` solo si `config.usaCuerpo`.

- [ ] **Step 4: Escribir la página del editor**

Crear `src/app/admin/[seccion]/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contenidos } from "@/db/esquema";
import { configPorRutaAdmin } from "@/lib/admin/tipos";
import FormularioContenido from "@/components/admin/FormularioContenido";

type Props = { params: Promise<{ seccion: string; id: string }> };

export default async function PaginaEditor({ params }: Props) {
  const { seccion, id } = await params;

  const config = configPorRutaAdmin(seccion);
  if (!config) notFound();

  const esNuevo = id === "nuevo";
  let contenido = null;

  if (!esNuevo) {
    const [fila] = await db.select().from(contenidos).where(eq(contenidos.id, id));
    if (!fila || fila.tipo !== config.tipo) notFound();
    contenido = fila;
  }

  return (
    <>
      <h1 className="font-display text-2xl mb-6">
        {esNuevo
          ? `${config.articulo === "la" ? "Nueva" : "Nuevo"} ${config.singular}`
          : `Editar ${config.singular}`}
      </h1>
      <FormularioContenido config={config} contenido={contenido} />
    </>
  );
}
```

- [ ] **Step 5: Verificación manual**

Crear una columna nueva desde el panel, publicarla, y verificar en `/columnas` que aparece **sin recargar el despliegue**. Editar el título y confirmar que el cambio se ve en segundos. Intentar guardar con el slug de otra columna existente y verificar que el error aparece junto al campo del slug, no como pantalla de error.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin src/components/admin package.json package-lock.json
git commit -m "feat: editor de contenido con texto enriquecido"
```

---

### Task 12: Papelera

**Files:**
- Create: `src/app/admin/papelera/page.tsx`
- Create: `src/components/admin/TablaPapelera.tsx`
- Create: `tests/contenidos/papelera.test.ts`

**Interfaces:**
- Consumes: `borrarContenido`, `restaurarContenido`, tabla `contenidos`.
- Produces: `listarBorrados(): Promise<ContenidoConImagen[]>` en `@/lib/contenidos/consultas`.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/contenidos/papelera.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos } from "@/db/esquema";
import { consultarBorrados } from "@/lib/contenidos/consultas";

describe("papelera", () => {
  it("lista solo lo borrado, de lo más reciente a lo más antiguo", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values([
      { tipo: "columna", slug: "viva", titulo: "Viva", fecha: "2026-01-01" },
      { tipo: "columna", slug: "vieja", titulo: "Vieja", fecha: "2026-01-01", eliminadoEn: new Date("2026-01-01") },
      { tipo: "bitacora", slug: "nueva", titulo: "Nueva", fecha: "2026-01-01", eliminadoEn: new Date("2026-06-01") },
    ]);

    const filas = await consultarBorrados(db);
    expect(filas.map((f) => f.slug)).toEqual(["nueva", "vieja"]);
    await cerrar();
  });

  it("un contenido borrado deja libre su slug", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values({
      tipo: "columna", slug: "repetida", titulo: "A", fecha: "2026-01-01", eliminadoEn: new Date(),
    });
    await db.insert(contenidos).values({
      tipo: "columna", slug: "repetida", titulo: "B", fecha: "2026-01-01",
    });

    const vivas = await db.select().from(contenidos).where(eq(contenidos.slug, "repetida"));
    expect(vivas).toHaveLength(2);
    await cerrar();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/contenidos/papelera.test.ts`
Expected: FAIL — `consultarBorrados` no está exportada.

- [ ] **Step 3: Implementar**

Agregar a `src/lib/contenidos/consultas.ts`:

```ts
import { isNotNull } from "drizzle-orm";

export async function consultarBorrados(conexion: any): Promise<ContenidoConImagen[]> {
  return conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(isNotNull(contenidos.eliminadoEn))
    .orderBy(desc(contenidos.eliminadoEn));
}

export function listarBorrados() {
  return consultarBorrados(db);
}
```

Crear `src/app/admin/papelera/page.tsx` que llame `listarBorrados()` y renderice `TablaPapelera`, con el nombre de la sección de origen (`TIPOS[fila.tipo].etiqueta`), la fecha de borrado y un botón **Restaurar** que llame `restaurarContenido`. Incluir la nota: *"Al restaurar, el contenido vuelve como borrador. Publícalo de nuevo si quieres que aparezca en el sitio."*

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/contenidos/papelera.test.ts`
Expected: PASS, 2 pruebas.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contenidos src/app/admin/papelera src/components/admin tests/contenidos
git commit -m "feat: papelera con restauración de contenido"
```

---

## Fase 4 — Medios

### Task 13: Acciones de la biblioteca

**Files:**
- Create: `src/lib/medios/acciones.ts`
- Create: `src/lib/medios/consultas.ts`
- Create: `src/app/api/medios/subir/route.ts`
- Create: `tests/medios/acciones.test.ts`

**Interfaces:**
- Consumes: `requerirSesion`, `requerirAdmin`, tablas `medios` y `contenidos`.
- Produces:
  - `listarMedios(): Promise<Medio[]>`
  - `contarUsos(db, medioId): Promise<number>` — cuántos contenidos usan esa imagen de portada.
  - `registrarMedio(datos): Promise<Medio>`
  - `actualizarAlt(id, alt): Promise<Resultado>`
  - `borrarMedio(id): Promise<Resultado>` — solo admin, rechaza si está en uso.
  - `TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif"]`, `TAMANO_MAXIMO = 10 * 1024 * 1024`.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/medios/acciones.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { medios, contenidos } from "@/db/esquema";
import { contarUsos, validarArchivo, TAMANO_MAXIMO } from "@/lib/medios/acciones";

describe("validación de archivos", () => {
  it("acepta los formatos permitidos", () => {
    for (const tipo of ["image/jpeg", "image/png", "image/webp", "image/avif"]) {
      expect(validarArchivo({ tipo, tamano: 1024 }).ok).toBe(true);
    }
  });

  it("rechaza un PDF disfrazado de imagen", () => {
    const r = validarArchivo({ tipo: "application/pdf", tamano: 1024 });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("formato");
  });

  it("rechaza un SVG, que puede llevar scripts", () => {
    expect(validarArchivo({ tipo: "image/svg+xml", tamano: 1024 }).ok).toBe(false);
  });

  it("rechaza un archivo que pasa del máximo", () => {
    const r = validarArchivo({ tipo: "image/jpeg", tamano: TAMANO_MAXIMO + 1 });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("10 MB");
  });
});

describe("uso de imágenes", () => {
  it("cuenta cuántos contenidos usan una imagen", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db.insert(medios).values({ url: "/images/x.jpg", nombre: "x.jpg" }).returning();

    await db.insert(contenidos).values([
      { tipo: "columna", slug: "a", titulo: "A", fecha: "2026-01-01", imagenId: medio.id },
      { tipo: "columna", slug: "b", titulo: "B", fecha: "2026-01-01", imagenId: medio.id },
      { tipo: "columna", slug: "c", titulo: "C", fecha: "2026-01-01" },
    ]);

    expect(await contarUsos(db, medio.id)).toBe(2);
    await cerrar();
  });

  it("no cuenta los contenidos borrados", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db.insert(medios).values({ url: "/images/y.jpg", nombre: "y.jpg" }).returning();
    await db.insert(contenidos).values({
      tipo: "columna", slug: "a", titulo: "A", fecha: "2026-01-01",
      imagenId: medio.id, eliminadoEn: new Date(),
    });

    expect(await contarUsos(db, medio.id)).toBe(0);
    await cerrar();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/medios`
Expected: FAIL — no existe `@/lib/medios/acciones`.

- [ ] **Step 3: Implementar**

```bash
npm i @vercel/blob
```

Crear `src/lib/medios/acciones.ts` con `validarArchivo`, `contarUsos`, `registrarMedio`, `actualizarAlt` y `borrarMedio`. Puntos que la implementación debe cumplir:

```ts
export const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const TAMANO_MAXIMO = 10 * 1024 * 1024;

export function validarArchivo(archivo: { tipo: string; tamano: number }):
  | { ok: true }
  | { ok: false; error: string } {
  if (!TIPOS_PERMITIDOS.includes(archivo.tipo)) {
    return { ok: false, error: "Ese formato no se admite. Usa JPG, PNG, WebP o AVIF." };
  }
  if (archivo.tamano > TAMANO_MAXIMO) {
    return { ok: false, error: "La imagen pasa de 10 MB." };
  }
  return { ok: true };
}

export async function contarUsos(conexion: any, medioId: string): Promise<number> {
  const [fila] = await conexion
    .select({ n: count() })
    .from(contenidos)
    .where(and(eq(contenidos.imagenId, medioId), isNull(contenidos.eliminadoEn)));
  return Number(fila.n);
}
```

`borrarMedio` llama `requerirAdmin()`, verifica `contarUsos(db, id) === 0` y devuelve
`{ ok: false, error: "Esa foto está en uso en N contenidos. Cámbialas antes de borrarla." }` si no lo está. Si está libre, borra el objeto de Blob con `del(url)` **solo cuando la URL empieza por `https://`** — las heredadas `/images/…` viven en el repositorio y no se tocan — y luego elimina la fila.

Crear `src/app/api/medios/subir/route.ts` usando `handleUpload` de `@vercel/blob/client`. En el callback `onBeforeGenerateToken`, llamar `requerirSesion()` y aplicar `validarArchivo`; en `onUploadCompleted`, llamar `registrarMedio`. Sin sesión, responder 401.

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/medios`
Expected: PASS, 6 pruebas.

- [ ] **Step 5: Commit**

```bash
git add src/lib/medios src/app/api/medios tests/medios package.json package-lock.json
git commit -m "feat: acciones y validación de la biblioteca de medios"
```

---

### Task 14: Biblioteca de imágenes

**Files:**
- Create: `src/lib/medios/procesar-imagen.ts`
- Create: `src/app/admin/medios/page.tsx`
- Create: `src/components/admin/BibliotecaMedios.tsx`
- Create: `src/components/admin/SelectorImagen.tsx`
- Create: `tests/medios/procesar-imagen.test.ts`

**Interfaces:**
- Consumes: `listarMedios`, `actualizarAlt`, `borrarMedio`, la ruta de subida.
- Produces: `calcularDimensiones(ancho, alto, maximo): { ancho: number; alto: number }` (pura, probable sin navegador) y `procesarImagen(archivo: File): Promise<File>`.

- [ ] **Step 1: Escribir la prueba que falla**

El redimensionado usa `canvas`, que no existe en Node. Se extrae la aritmética a una función pura y **esa** se prueba. Crear `tests/medios/procesar-imagen.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calcularDimensiones, MAXIMO_LADO } from "@/lib/medios/procesar-imagen";

describe("calcularDimensiones", () => {
  it("no agranda una imagen que ya es pequeña", () => {
    expect(calcularDimensiones(800, 600, MAXIMO_LADO)).toEqual({ ancho: 800, alto: 600 });
  });

  it("reduce una foto apaisada por su ancho", () => {
    expect(calcularDimensiones(4000, 3000, 2000)).toEqual({ ancho: 2000, alto: 1500 });
  });

  it("reduce una foto vertical por su alto", () => {
    expect(calcularDimensiones(3000, 4000, 2000)).toEqual({ ancho: 1500, alto: 2000 });
  });

  it("conserva la proporción en una imagen cuadrada", () => {
    expect(calcularDimensiones(3000, 3000, 2000)).toEqual({ ancho: 2000, alto: 2000 });
  });

  it("redondea a enteros, nunca a cero", () => {
    const r = calcularDimensiones(4001, 3, 2000);
    expect(Number.isInteger(r.ancho)).toBe(true);
    expect(Number.isInteger(r.alto)).toBe(true);
    expect(r.alto).toBeGreaterThanOrEqual(1);
  });

  it("el máximo por defecto es 2000", () => {
    expect(MAXIMO_LADO).toBe(2000);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/medios/procesar-imagen.test.ts`
Expected: FAIL — no existe el módulo.

- [ ] **Step 3: Implementar**

Crear `src/lib/medios/procesar-imagen.ts`:

```ts
export const MAXIMO_LADO = 2000;
export const CALIDAD_WEBP = 0.82;

/** Pura, para poder probarla sin navegador. */
export function calcularDimensiones(
  ancho: number,
  alto: number,
  maximo: number = MAXIMO_LADO
): { ancho: number; alto: number } {
  const mayor = Math.max(ancho, alto);
  if (mayor <= maximo) return { ancho, alto };

  const factor = maximo / mayor;
  return {
    ancho: Math.max(1, Math.round(ancho * factor)),
    alto: Math.max(1, Math.round(alto * factor)),
  };
}

/**
 * Redimensiona y convierte a WebP en el navegador, antes de subir.
 * Una foto de cámara de 8 MB llega a Blob pesando cientos de kilobytes,
 * y el equipo no necesita comprimirla por su cuenta.
 */
export async function procesarImagen(archivo: File): Promise<File> {
  const mapa = await createImageBitmap(archivo);
  const { ancho, alto } = calcularDimensiones(mapa.width, mapa.height);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  lienzo.getContext("2d")!.drawImage(mapa, 0, 0, ancho, alto);
  mapa.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    lienzo.toBlob(resolver, "image/webp", CALIDAD_WEBP)
  );

  if (!blob) return archivo;

  const nombre = archivo.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], nombre, { type: "image/webp" });
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/medios/procesar-imagen.test.ts`
Expected: PASS, 6 pruebas.

- [ ] **Step 5: Escribir la interfaz**

Crear `src/components/admin/BibliotecaMedios.tsx` (cliente) con: zona de arrastre que llama `procesarImagen` y luego `upload()` de `@vercel/blob/client` contra `/api/medios/subir`; cuadrícula de miniaturas; campo de texto alternativo editable en línea que llama `actualizarAlt`; y botón de borrar visible solo para admin, que muestra el error de imagen en uso.

Crear `src/components/admin/SelectorImagen.tsx`, el diálogo que usa el formulario de contenido para elegir portada: muestra la biblioteca, permite subir en el momento y devuelve el `id` del medio. **Impide seleccionar una imagen sin texto alternativo**, con el mensaje: *"Esta foto necesita una descripción antes de usarse como portada."*

Crear `src/app/admin/medios/page.tsx` que cargue `listarMedios()` y el rol de la sesión, y renderice la biblioteca.

- [ ] **Step 6: Verificación manual**

Subir una foto grande desde el panel y comprobar en la pestaña de red del navegador que lo que se envía pesa mucho menos que el original y va como `image/webp`. Asignarla como portada de una columna y verificar que aparece en `/columnas`. Intentar borrarla mientras está en uso y confirmar el rechazo.

- [ ] **Step 7: Commit**

```bash
git add src/lib/medios src/app/admin/medios src/components/admin tests/medios
git commit -m "feat: biblioteca de imágenes con subida y compresión en el navegador"
```

---

## Fase 5 — Ajustes y corte

### Task 15: Ajustes del sitio

**Files:**
- Create: `src/lib/ajustes/claves.ts`
- Create: `src/lib/ajustes/index.ts`
- Create: `tests/ajustes/ajustes.test.ts`

**Interfaces:**
- Consumes: tabla `ajustes`, `requerirAdmin`.
- Produces:
  - `CLAVES` con el esquema Zod y el valor por defecto de cada clave.
  - `leerAjuste<K>(clave: K): Promise<ValorDe<K>>` — cacheada con la etiqueta `"ajustes"`, devuelve el valor por defecto si la clave no existe o el valor guardado no valida.
  - `leerAjustes(): Promise<TodosLosAjustes>` — cacheada.
  - `guardarAjuste(clave, valor): Promise<Resultado>` — solo admin, valida e invalida la etiqueta.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `tests/ajustes/ajustes.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { ajustes } from "@/db/esquema";
import { CLAVES, consultarAjuste, escribirAjuste } from "@/lib/ajustes";

describe("ajustes", () => {
  it("devuelve el valor por defecto cuando la clave no existe", async () => {
    const { db, cerrar } = await crearDbPrueba();
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(
      CLAVES["sitio.enConstruccion"].porDefecto
    );
    await cerrar();
  });

  it("devuelve el valor guardado", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.enConstruccion", false);
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(false);
    await cerrar();
  });

  it("sobrescribe en vez de duplicar", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.enConstruccion", false);
    await escribirAjuste(db, "sitio.enConstruccion", true);

    const filas = await db.select().from(ajustes);
    expect(filas).toHaveLength(1);
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(true);
    await cerrar();
  });

  it("rechaza un valor que no cumple el esquema de la clave", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await expect(
      escribirAjuste(db, "sitio.enConstruccion", "sí" as never)
    ).rejects.toThrow();
    await cerrar();
  });

  it("cae al valor por defecto si lo guardado quedó corrupto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    // Escritura directa, saltándose la validación, como si viniera de una
    // versión anterior del esquema.
    await db.insert(ajustes).values({ clave: "portada.cifras", valor: { roto: true } });

    expect(await consultarAjuste(db, "portada.cifras")).toEqual(
      CLAVES["portada.cifras"].porDefecto
    );
    await cerrar();
  });

  it("valida la forma de las cifras de portada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "portada.cifras", [
      { valor: 35, sufijo: "+", etiqueta: "años al servicio de Antioquia" },
    ]);
    await expect(
      escribirAjuste(db, "portada.cifras", [{ valor: "treinta y cinco" }] as never)
    ).rejects.toThrow();
    await cerrar();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- tests/ajustes`
Expected: FAIL — no existe `@/lib/ajustes`.

- [ ] **Step 3: Implementar**

Crear `src/lib/ajustes/claves.ts`:

```ts
import { z } from "zod";

const cifra = z.object({ valor: z.number(), sufijo: z.string(), etiqueta: z.string() });
const hito = z.object({ anio: z.string(), titulo: z.string(), descripcion: z.string() });
const itemMenu = z.object({ etiqueta: z.string(), destino: z.string(), visible: z.boolean() });

export const CLAVES = {
  "sitio.enConstruccion": { esquema: z.boolean(), porDefecto: true },
  "sitio.mensajeConstruccion": {
    esquema: z.string(),
    porDefecto: "Estamos preparando este espacio. Vuelve pronto.",
  },
  "portada.tituloHero": { esquema: z.string(), porDefecto: "Gallón Memorias" },
  "portada.subtituloHero": {
    esquema: z.string(),
    porDefecto: "Memorias, reflexiones y conversaciones sobre Antioquia.",
  },
  "portada.imagenHero": { esquema: z.string(), porDefecto: "/images/gallon-retrato-obra-hd.jpg" },
  "portada.cifras": { esquema: z.array(cifra), porDefecto: [] },
  "portada.reflexionDestacada": { esquema: z.string().uuid().nullable(), porDefecto: null },
  "portada.franjaFotos": { esquema: z.array(z.string().uuid()), porDefecto: [] },
  "portada.seccionesVisibles": { esquema: z.array(z.string()), porDefecto: [] },
  "sobre.texto": { esquema: z.string(), porDefecto: "" },
  "sobre.trayectoria": { esquema: z.array(hito), porDefecto: [] },
  "navegacion.menu": { esquema: z.array(itemMenu), porDefecto: [] },
  "navegacion.redes": {
    esquema: z.object({ x: z.string(), instagram: z.string(), youtube: z.string() }),
    porDefecto: { x: "", instagram: "", youtube: "" },
  },
} as const;

export type ClaveAjuste = keyof typeof CLAVES;
export type ValorDe<K extends ClaveAjuste> = z.infer<(typeof CLAVES)[K]["esquema"]>;
```

Crear `src/lib/ajustes/index.ts`, que **debe reexportar `CLAVES`, `ClaveAjuste` y `ValorDe`** (`export * from "./claves"`) porque las pruebas y las pantallas importan todo desde `@/lib/ajustes`. Contiene además `consultarAjuste(conexion, clave)`, `escribirAjuste(conexion, clave, valor)`, y encima las envolturas `leerAjuste` / `leerAjustes` cacheadas con `unstable_cache` y etiqueta `"ajustes"`, más la Server Action `guardarAjuste` que llama `requerirAdmin()`, valida con el esquema de la clave, escribe con `onConflictDoUpdate` y ejecuta `revalidateTag("ajustes")` seguido de `revalidatePath("/", "layout")`.

**Regla clave:** `consultarAjuste` nunca lanza al leer. Si lo guardado no valida contra el esquema actual, devuelve el valor por defecto. Así un cambio de esquema no tumba el sitio público.

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- tests/ajustes`
Expected: PASS, 6 pruebas.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ajustes tests/ajustes
git commit -m "feat: lectura y escritura de los ajustes del sitio"
```

---

### Task 16: Pantalla de ajustes

**Files:**
- Create: `src/app/admin/ajustes/page.tsx`
- Create: `src/components/admin/PestanasAjustes.tsx`
- Create: `src/components/admin/ListaEditable.tsx`

**Interfaces:**
- Consumes: `leerAjustes`, `guardarAjuste`, `listarMedios`, `listarParaPanel("bitacora")`.
- Produces: nada para tareas posteriores.

- [ ] **Step 1: Escribir la página**

Crear `src/app/admin/ajustes/page.tsx`, que redirige a `/admin` si el rol no es admin, carga los ajustes, la lista de medios y las bitácoras publicadas, y renderiza `PestanasAjustes`.

- [ ] **Step 2: Escribir las pestañas**

Crear `src/components/admin/PestanasAjustes.tsx` con cuatro pestañas, cada una con su propio botón de guardar:

1. **Estado del sitio** — interruptor de `sitio.enConstruccion` y campo de `sitio.mensajeConstruccion`. Debajo del interruptor, un aviso en texto plano: *"Con el modo construcción encendido, los visitantes solo ven el mensaje de abajo. El resto del sitio queda oculto."*
2. **Portada** — título, subtítulo e imagen del hero (con `SelectorImagen`); `ListaEditable` de cifras; selector de reflexión destacada alimentado por las bitácoras publicadas, con la opción *"Ninguna"*; y selección ordenada de la franja de fotos.
3. **Sobre mí** — texto y `ListaEditable` de trayectoria.
4. **Navegación y redes** — `ListaEditable` del menú y los tres campos de redes.

Crear `src/components/admin/ListaEditable.tsx`, un componente genérico que recibe una definición de campos y un arreglo de valores, y permite agregar, editar, reordenar y quitar filas. Lo usan cifras, trayectoria y menú, que son la misma interacción con distintos campos.

- [ ] **Step 3: Verificación manual**

Apagar el modo construcción desde el panel y comprobar que la portada aparece **sin rebuild**. Volver a encenderlo. Editar una cifra de impacto y confirmar que el cambio se refleja. Corregir la cifra de columnas de 29 a 32.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/ajustes src/components/admin
git commit -m "feat: pantalla de ajustes del sitio"
```

---

### Task 17: El sitio público pasa a leer de la base de datos

La tarea con más riesgo del plan: aquí el sitio deja de depender de `src/data/`. Se hace sección por sección, verificando cada una antes de seguir.

El patrón actual es `page.tsx` (servidor) → `content.tsx` (cliente, que importa los datos). El cambio mínimo y seguro es que `page.tsx` consulte la base y pase los datos como props a `content.tsx`, que deja de importar de `@/data`.

**Files:**
- Modify: `src/app/page.tsx`, `src/app/columnas/page.tsx`, `src/app/columnas/content.tsx`, `src/app/columnas/[slug]/page.tsx`
- Modify: `src/app/bitacora/*`, `src/app/territorio-vivo/*`, `src/app/antioquia-piensa/*`, `src/app/voces/page.tsx`, `src/app/un-cafe/page.tsx`, `src/app/sobre/*`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/home/*` (los que leen de `@/data`)
- Delete: `src/data/columnas.ts`, `src/data/columnas-bodies.ts`, `src/data/content.ts`
- Create: `tests/publico/sitemap.test.ts`

**Interfaces:**
- Consumes: `listarPublicados`, `obtenerPublicado`, `leerAjustes`.
- Produces: nada.

- [ ] **Step 1: Inventariar lo que importa de `@/data`**

```bash
grep -rn "@/data" src/ --include="*.ts" --include="*.tsx"
```

Anotar cada archivo. Ninguno debe quedar al final de la tarea.

- [ ] **Step 2: Convertir las columnas**

En `src/app/columnas/page.tsx`, cargar los datos y pasarlos:

```tsx
import type { Metadata } from "next";
import ColumnasContent from "./content";
import { listarPublicados } from "@/lib/contenidos/consultas";
import { TIPOS } from "@/lib/admin/tipos";

export const metadata: Metadata = {
  title: "Columnas — Opinión en Al Poniente",
  description:
    "Columnas de opinión publicadas en Al Poniente. Reflexiones sobre Antioquia, competitividad, infraestructura y sociedad.",
};

export default async function ColumnasPage() {
  const columnas = await listarPublicados("columna");
  const anios = [...new Set(columnas.map((c) => c.fecha.slice(0, 4)))].sort().reverse();

  return <ColumnasContent columnas={columnas} categorias={["Todas", ...anios]} />;
}
```

En `src/app/columnas/content.tsx`, quitar `import { columnas, columnaCategories } from "@/data/columnas"` y recibirlos por props. El resto del componente no cambia, salvo los nombres de campo: `title` → `titulo`, `excerpt` → `resumen`, `date` → `fecha`, `image` → `imagenUrl`, `readTime` → `extra.readTime`.

La descripción del metadata decía "29 columnas"; se quita el número en vez de dejarlo desactualizado.

En `src/app/columnas/[slug]/page.tsx`, cambiar `generateStaticParams` a:

```tsx
export async function generateStaticParams() {
  const columnas = await listarPublicados("columna");
  return columnas.map((c) => ({ slug: c.slug }));
}
```

y obtener la columna con `obtenerPublicado("columna", slug)`. El cuerpo pasa de ser un arreglo de párrafos a HTML ya sanitizado, así que se renderiza con `dangerouslySetInnerHTML={{ __html: col.cuerpoHtml ?? "" }}`. **Es seguro porque se sanitizó al guardar**, en la tarea 4.

Las columnas anterior y siguiente salen del índice dentro del arreglo, igual que hoy.

- [ ] **Step 3: Verificar las columnas**

```bash
npm run build && npm run start
```

Recorrer `/columnas` y tres columnas concretas. Comparar contra el sitio en línea: mismo listado, mismo cuerpo, mismo enlace a Al Poniente.

- [ ] **Step 4: Repetir para las demás secciones**

Aplicar el mismo patrón a `bitacora`, `territorio-vivo`, `antioquia-piensa`, `voces` y `un-cafe`. Todas ellas quedarán con listados vacíos, porque su contenido está en borrador: verificar que cada página muestra su estado vacío sin romperse, no una pantalla de error.

- [ ] **Step 5: Convertir la portada y `sobre`**

En `src/app/page.tsx`, reemplazar la constante `UNDER_CONSTRUCTION` por el ajuste:

```tsx
export default async function Home() {
  const ajustes = await leerAjustes();

  if (ajustes["sitio.enConstruccion"]) {
    return <ConstructionScreen mensaje={ajustes["sitio.mensajeConstruccion"]} />;
  }
  // …
}
```

`ConstructionScreen` pasa a recibir el mensaje por prop. Las cifras, la franja de fotos, la reflexión destacada y el texto de "Sobre mí" se leen de los ajustes y se pasan a sus componentes.

La reflexión destacada solo se renderiza si el `id` guardado corresponde a una bitácora **publicada y no borrada**; si no, se omite el bloque.

- [ ] **Step 6: Convertir el sitemap**

Crear `tests/publico/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { construirSitemap } from "@/app/sitemap";

describe("sitemap", () => {
  it("incluye las páginas fijas y una entrada por columna publicada", () => {
    const entradas = construirSitemap([
      { slug: "a", fecha: "2026-03-01" },
      { slug: "b", fecha: "2026-01-01" },
    ]);

    const urls = entradas.map((e) => e.url);
    expect(urls).toContain("https://gallonantioquia.vercel.app");
    expect(urls).toContain("https://gallonantioquia.vercel.app/columnas/a");
    expect(urls).toContain("https://gallonantioquia.vercel.app/columnas/b");
  });

  it("no incluye rutas del panel", () => {
    const urls = construirSitemap([]).map((e) => e.url);
    expect(urls.some((u) => u.includes("/admin"))).toBe(false);
  });
});
```

Reescribir `src/app/sitemap.ts` extrayendo la construcción a `construirSitemap(columnas)` —pura, probable— y dejando el `export default` como la función asíncrona que llama `listarPublicados("columna")` y delega en ella.

- [ ] **Step 7: Eliminar los archivos de datos**

Solo cuando `grep -rn "@/data" src/` no devuelva nada:

```bash
git rm src/data/columnas.ts src/data/columnas-bodies.ts src/data/content.ts
npm run build
```

`src/types/index.ts` se conserva: `NavItem` y los demás tipos siguen describiendo la forma de los ajustes.

**Atención:** `src/lib/admin/migracion.ts` importa de `@/data`. Como la migración ya se corrió y no volverá a correrse, se elimina junto con `scripts/migrar-contenido.ts`, su prueba y el script de `package.json`. Dejar código que importa archivos borrados rompe la compilación.

- [ ] **Step 8: Verificación completa**

```bash
npm test
npm run build
```

Expected: todas las pruebas pasan y la compilación termina sin errores. Recorrer el sitio entero en `npm run start` comparando contra producción.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: el sitio público lee el contenido de la base de datos"
```

---

### Task 18: Despliegue

**Files:**
- Modify: `package.json` (script `build`)
- Create: `docs/despliegue-modulo-admin.md`

- [ ] **Step 1: Provisionar los servicios**

Crear la base en Neon y el almacén en Vercel Blob desde el panel de Vercel del proyecto `gallonantioquia`. Cargar las cinco variables de entorno de la tabla del encabezado en Production, Preview y Development.

- [ ] **Step 2: Aplicar el esquema y migrar en la base real**

```bash
vercel env pull .env.local
npm run db:aplicar
npm run db:migrar-contenido
npm run crear-admin -- cristian@inplux.co "Cristian" "<contraseña larga>"
```

Verificar el resumen impreso: 32 columnas publicadas y 25 borradores.

**Este paso va antes del despliegue.** Si se despliega primero, el sitio queda con listados vacíos hasta que se migre.

- [ ] **Step 3: Desplegar y verificar**

```bash
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

Se compila localmente y se sube el resultado. Reproduce cualquier fallo de empaquetado en segundos, en vez de esperar el ciclo de la nube.

Verificar en producción, en este orden:

1. `/` sigue mostrando la pantalla de construcción.
2. `/columnas` lista las 32 columnas y una de ellas abre bien.
3. `/admin` redirige a `/admin/login`.
4. Se entra con la cuenta de administrador.
5. Se publica un cambio de prueba y se ve reflejado en el sitio en menos de un minuto, sin despliegue nuevo.
6. `/robots.txt` contiene `Disallow: /admin`.

- [ ] **Step 4: Documentar el despliegue**

Crear `docs/despliegue-modulo-admin.md` con las variables de entorno, los comandos de migración y qué hacer si un despliegue falla.

- [ ] **Step 5: Commit**

```bash
git add docs package.json
git commit -m "docs: notas de despliegue del módulo de administración"
```

---

## Fase 6 — Entrega

### Task 19: Guía de uso

**Files:**
- Delete: `docs/guia-actualizacion.md`
- Create: `docs/guia-panel.md`

- [ ] **Step 1: Escribir la guía**

Crear `docs/guia-panel.md`, dirigida a Diego y Walter, en español llano y **sin una sola línea de código ni de terminal**. Debe cubrir, con capturas del panel ya desplegado:

1. Cómo entrar y qué hacer si se bloquea la cuenta (esperar 15 minutos o pedirle a un administrador que la reactive).
2. Publicar una columna nueva, de principio a fin.
3. La diferencia entre borrador y publicado, y cómo despublicar.
4. Subir una foto y ponerle descripción, y por qué la descripción es obligatoria.
5. Cambiar la foto y los textos de la portada.
6. Apagar el modo construcción cuando decidan abrir el sitio.
7. Recuperar algo borrado desde la papelera.
8. Invitar a alguien nuevo y darlo de baja.
9. A quién escribir si algo no funciona.

Incluir una advertencia visible: **el contenido de Territorio Vivo, Bitácora, Antioquia Piensa, Voces y Un Café está en borrador porque son textos de muestra creados durante el diseño. Los episodios de Un Café nombran invitados con los que no hay conversaciones grabadas. Revisarlos y reescribirlos antes de publicar.**

- [ ] **Step 2: Eliminar la guía vieja**

```bash
git rm docs/guia-actualizacion.md
```

Ya no aplica: describe editar arreglos de TypeScript y hacer `git push`, que es justo el flujo que este módulo reemplaza. Dejarla llevaría al equipo a editar archivos que ya no existen.

- [ ] **Step 3: Commit**

```bash
git add docs
git commit -m "docs: guía de uso del panel para el equipo de campaña"
```

---

## Verificación final

Antes de dar el módulo por terminado:

- [ ] `npm test` pasa entero.
- [ ] `npm run build` termina sin errores.
- [ ] `grep -rn "@/data" src/` no devuelve nada.
- [ ] Un editor no puede entrar a `/admin/ajustes` ni a `/admin/usuarios`, ni invocando sus acciones directamente.
- [ ] Publicar desde el panel se refleja en el sitio en menos de un minuto, sin despliegue.
- [ ] `/robots.txt` incluye `Disallow: /admin`.
- [ ] La papelera restaura como borrador, nunca como publicado.
- [ ] Las 32 columnas están publicadas y los 25 contenidos de muestra siguen en borrador.
