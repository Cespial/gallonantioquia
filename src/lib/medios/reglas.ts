import { and, count, desc, eq, isNull } from "drizzle-orm";
import { contenidos, medios, type Medio, type NuevoMedio } from "@/db/esquema";

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

/** Cuántos contenidos vivos usan esa imagen como portada. */
export async function contarUsos(conexion: any, medioId: string): Promise<number> {
  const [fila] = await conexion
    .select({ n: count() })
    .from(contenidos)
    .where(and(eq(contenidos.imagenId, medioId), isNull(contenidos.eliminadoEn)));
  return Number(fila.n);
}

export async function consultarMedios(conexion: any): Promise<Medio[]> {
  return conexion.select().from(medios).orderBy(desc(medios.creadoEn));
}

export async function registrarMedio(conexion: any, datos: NuevoMedio): Promise<Medio> {
  const [fila] = await conexion.insert(medios).values(datos).returning();
  return fila;
}
