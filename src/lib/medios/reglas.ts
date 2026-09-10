import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import {
  ajustes,
  ajustesHistorial,
  contenidos,
  medios,
  type Medio,
  type NuevoMedio,
} from "@/db/esquema";

// Reglas puras y consultas que reciben la conexión. Igual que en contenidos:
// nada de esto vive en `./acciones`, que lleva `"use server"`.

export const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const TAMANO_MAXIMO = 10 * 1024 * 1024;

export function validarArchivo(archivo: {
  tipo: string;
  tamano: number;
}): { ok: true } | { ok: false; error: string } {
  // El SVG queda fuera a propósito: es XML y puede traer scripts dentro, así
  // que servirlo desde nuestro dominio sería un vector de inyección.
  if (!TIPOS_PERMITIDOS.includes(archivo.tipo)) {
    return { ok: false, error: "Ese formato no se admite. Usa JPG, PNG, WebP o AVIF." };
  }
  if (archivo.tamano > TAMANO_MAXIMO) {
    return { ok: false, error: "La imagen pasa de 10 MB." };
  }
  return { ok: true };
}

/**
 * Cuántos contenidos vivos, franjas de la portada e historiales de deshacer
 * usan esa imagen: la suma de las tres cuentas es lo que ve el editor antes de
 * dejarlo borrarla.
 *
 * Las franjas de la portada guardan la foto entera dentro de su ajuste
 * (`{ medioId, url, alt, ancho, alto }`, ver `src/lib/ajustes/foto.ts`), así
 * que no hay una columna que apuntar como en `contenidos.imagenId`: se busca
 * por texto dentro del jsonb. El patrón lleva un espacio después de los dos
 * puntos porque así serializa Postgres un jsonb al convertirlo a texto
 * (`'{"a":1}'::jsonb::text` da `{"a": 1}`, no `{"a":1}`); el id nunca se
 * concatena en el SQL, viaja como parámetro ligado del `sql` de drizzle.
 *
 * El historial cuenta igual que el valor vivo: una foto que ya salió de la
 * portada pero sigue en la pila de deshacer no se puede borrar de la
 * biblioteca, porque deshacer la devolvería al sitio público apuntando a un
 * archivo que ya no existe.
 */
export async function contarUsos(conexion: any, medioId: string): Promise<number> {
  const [filaContenidos] = await conexion
    .select({ n: count() })
    .from(contenidos)
    .where(and(eq(contenidos.imagenId, medioId), isNull(contenidos.eliminadoEn)));

  const patron = `%"medioId": "${medioId}"%`;
  const [filaAjustes] = await conexion
    .select({ n: count() })
    .from(ajustes)
    .where(sql`${ajustes.valor}::text like ${patron}`);

  const [filaHistorial] = await conexion
    .select({ n: count() })
    .from(ajustesHistorial)
    .where(sql`${ajustesHistorial.valor}::text like ${patron}`);

  return Number(filaContenidos.n) + Number(filaAjustes.n) + Number(filaHistorial.n);
}

export async function consultarMedios(conexion: any): Promise<Medio[]> {
  return conexion.select().from(medios).orderBy(desc(medios.creadoEn));
}

/**
 * Idempotente por `url`: la subida se anota dos veces —el navegador al
 * terminar y el webhook de Blob poco después— y la segunda debe devolver la
 * fila que ya existe en vez de romper contra el índice único.
 */
export async function registrarMedio(conexion: any, datos: NuevoMedio): Promise<Medio> {
  const [fila] = await conexion
    .insert(medios)
    .values(datos)
    .onConflictDoNothing({ target: medios.url })
    .returning();
  if (fila) return fila;
  const [existente] = await conexion.select().from(medios).where(eq(medios.url, datos.url));
  return existente;
}
