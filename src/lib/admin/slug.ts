/**
 * Convierte un título en un slug apto para URL: minúsculas, sin tildes,
 * separado por guiones. Debe producir salidas que pasen `esquemaSlug`.
 */
export function generarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    // Marcas diacríticas combinantes. Se escriben con escapes unicode a
    // propósito: los caracteres en crudo son invisibles y se corrompen al
    // copiarse entre archivos.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
