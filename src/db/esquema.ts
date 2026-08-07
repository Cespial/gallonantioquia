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
