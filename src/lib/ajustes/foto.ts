import { z } from "zod";

/**
 * Una ranura de foto guarda la instantánea completa: el id para saber que el
 * medio está en uso (contarUsos lo busca en los ajustes), y url, descripción y
 * medidas para pintar sin consultar. Por defecto `medioId` es nulo y la url
 * es la ruta heredada del repositorio.
 */
export const foto = z.object({
  medioId: z.string().uuid().nullable(),
  url: z.string().min(1),
  alt: z.string(),
  ancho: z.number().int().positive().nullable(),
  alto: z.number().int().positive().nullable(),
});

export type Foto = z.infer<typeof foto>;

export function fotoRepo(url: string, alt: string, ancho: number | null = null, alto: number | null = null): Foto {
  return { medioId: null, url, alt, ancho, alto };
}
