import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/esquema";

/**
 * Si la cuenta todavía usa la contraseña que le puso quien la creó.
 *
 * Vive en su propio archivo, y no dentro de `sesion.ts`, por la misma razón que
 * `reglas.ts` vive aparte de `acciones.ts`: importar `@/db` exige
 * `DATABASE_URL`, y `sesion.ts` tiene que poder importarse en una prueba que
 * solo quiere ejercitar las guardas de rol. Aquí queda una sola cosa que
 * mockear.
 *
 * Se lee de la base y no del token. La sesión es un JWT de ocho horas: seguiría
 * diciendo «debe cambiarla» un buen rato después de que la persona la cambió, y
 * la dejaría encerrada en la pantalla de contraseña hasta volver a entrar.
 */
export async function tieneClavePendiente(id: string): Promise<boolean> {
  const [fila] = await db
    .select({ debe: usuarios.debeCambiarPassword })
    .from(usuarios)
    .where(eq(usuarios.id, id));
  return fila?.debe ?? false;
}
