"use server";

import { db } from "@/db";
import { guardarPropuesta, type ResultadoPropuesta } from "./propuestas";

/**
 * Recibe el formulario público de «Te escuchamos». Es el único punto del sitio
 * donde escribe alguien sin sesión, así que valida todo antes de tocar la base
 * y nunca devuelve al navegador nada más que el resultado.
 */
export async function enviarPropuesta(datos: FormData): Promise<ResultadoPropuesta> {
  return guardarPropuesta(db, {
    nombre: datos.get("nombre"),
    email: datos.get("email"),
    telefono: datos.get("telefono"),
    municipio: datos.get("municipio"),
    mensaje: datos.get("mensaje"),
  });
}
