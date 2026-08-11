/** Tope de `esquemaSlug`. El título admite 300, así que hay que recortar. */
export const LARGO_MAXIMO_SLUG = 120;

/**
 * Convierte un título en un slug apto para URL: minúsculas, sin tildes,
 * separado por guiones. Debe producir salidas que pasen `esquemaSlug`,
 * incluido su límite de longitud: el slug se autogenera, así que un slug
 * inválido deja al usuario sin poder guardar y sin saber por qué.
 */
export function generarSlug(texto: string): string {
  const base = texto
    .normalize("NFD")
    // Marcas diacríticas combinantes. Se escriben con escapes unicode a
    // propósito: los caracteres en crudo son invisibles y se corrompen al
    // copiarse entre archivos.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base.length <= LARGO_MAXIMO_SLUG) return base;

  // Cortar en el último guion anterior al tope, para no partir una palabra
  // por la mitad ni dejar un guion colgando que el regex rechazaría.
  const recortado = base.slice(0, LARGO_MAXIMO_SLUG);
  const ultimoGuion = recortado.lastIndexOf("-");
  return ultimoGuion > 0 ? recortado.slice(0, ultimoGuion) : recortado;
}
