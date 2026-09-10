import { medios, type NuevoMedio } from "@/db/esquema";
import { CLAVES_PORTADA } from "@/lib/ajustes/portada";
import type { Foto } from "@/lib/ajustes/foto";

// Las fotos de hoy en la portada, tomadas de los mismos valores por defecto
// que ya viven en `CLAVES_PORTADA` (una sola fuente de verdad: así el alt y
// las medidas no se repiten a mano y quedan siempre en sincronía con lo que
// de verdad se ve en el sitio). El panorama de la cordillera aparece dos
// veces —fondo del hero y fondo del cierre— y se deduplica por url más abajo.
const D = CLAVES_PORTADA;
const FOTOS_DE_HOY: Foto[] = [
  D["portada.hero"].porDefecto.fondo,
  D["portada.hero"].porDefecto.retrato,
  D["portada.perfil"].porDefecto.abrazo,
  D["portada.sumamos"].porDefecto.retrato,
  ...D["portada.mosaico"].porDefecto.fotos,
  D["portada.equipo"].porDefecto.foto,
  ...D["portada.cafe"].porDefecto.fotos,
  D["portada.cierre"].porDefecto.fondo,
];

function porNombreDeArchivo(url: string): string {
  return url.split("/").pop() ?? url;
}

const urlsVistas = new Set<string>();

/** Las 13 fotos de campaña, sin repetir url, listas para insertarse en `medios`. */
export const MEDIOS_PORTADA: NuevoMedio[] = FOTOS_DE_HOY.filter((foto) => {
  if (urlsVistas.has(foto.url)) return false;
  urlsVistas.add(foto.url);
  return true;
}).map((foto) => ({
  url: foto.url,
  nombre: porNombreDeArchivo(foto.url),
  alt: foto.alt,
  ancho: foto.ancho,
  alto: foto.alto,
}));

/**
 * Da de alta en la biblioteca de medios las fotos que ya se usan en la
 * portada, para que aparezcan al elegir foto desde el panel sin tener que
 * volver a subirlas. Idempotente por `url` (`onConflictDoNothing`): correrla
 * de nuevo no duplica nada, por eso puede repetirse en cada despliegue.
 *
 * Devuelve cuántas filas insertó de verdad.
 */
export async function sembrarMediosPortada(conexion: any): Promise<number> {
  const filas = await conexion
    .insert(medios)
    .values(MEDIOS_PORTADA)
    .onConflictDoNothing({ target: medios.url })
    .returning();
  return filas.length;
}
