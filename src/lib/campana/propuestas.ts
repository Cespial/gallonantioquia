import { z } from "zod";
import { mensajes } from "@/db/esquema";

// Puro y con conexión por parámetro, como el resto del proyecto: la Server
// Action vive en `./acciones` y este archivo no importa `@/db`.

export const esquemaPropuesta = z.object({
  nombre: z.string().trim().min(1, "Escribe tu nombre").max(120),
  email: z.string().trim().toLowerCase().email("Revisa el correo, no parece válido"),
  telefono: z.string().trim().max(40).optional(),
  municipio: z.string().trim().max(120).optional(),
  mensaje: z
    .string()
    .trim()
    .min(1, "Cuéntanos tu propuesta")
    .max(5000, "El mensaje es demasiado largo"),
});

export type DatosPropuesta = z.infer<typeof esquemaPropuesta>;

export type ResultadoPropuesta =
  | { ok: true }
  | { ok: false; errores: Record<string, string> };

export async function guardarPropuesta(
  conexion: any,
  datos: unknown
): Promise<ResultadoPropuesta> {
  const revision = esquemaPropuesta.safeParse(datos);

  if (!revision.success) {
    const errores: Record<string, string> = {};
    for (const problema of revision.error.issues) {
      errores[problema.path.join(".")] = problema.message;
    }
    return { ok: false, errores };
  }

  const { nombre, email, telefono, municipio, mensaje } = revision.data;

  await conexion.insert(mensajes).values({
    nombre,
    email,
    telefono: telefono || null,
    municipio: municipio || null,
    mensaje,
  });

  return { ok: true };
}
