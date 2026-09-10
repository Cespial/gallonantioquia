import { z } from "zod";

/**
 * Una ranura de foto guarda la instantánea completa: el id para saber que el
 * medio está en uso (contarUsos lo busca en los ajustes), y url, descripción y
 * medidas para pintar sin consultar. Por defecto `medioId` es nulo y la url
 * es la ruta heredada del repositorio.
 */
export const foto = z.object({
  medioId: z.string().uuid().nullable(),
  // Solo dos orígenes: una ruta del propio repositorio (`/images/…`) o el Blob
  // de Vercel, que es donde aterriza lo que se sube desde la biblioteca. Sin
  // este cerco, una url pegada a mano metería en la portada una imagen de un
  // dominio ajeno —que además `next/image` no tiene autorizado y rompería el
  // renderizado— y de paso serviría para rastrear a quien visita el sitio.
  url: z
    .string()
    .min(1)
    .refine(
      (u) => u.startsWith("/") || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(u),
      { message: "La foto debe ser del sitio o de la biblioteca." }
    ),
  alt: z.string(),
  ancho: z.number().int().positive().nullable(),
  alto: z.number().int().positive().nullable(),
});

export type Foto = z.infer<typeof foto>;

export function fotoRepo(url: string, alt: string, ancho: number | null = null, alto: number | null = null): Foto {
  return { medioId: null, url, alt, ancho, alto };
}
