export const MAXIMO_LADO = 2000;
export const CALIDAD_WEBP = 0.82;

/** Pura, para poder probarla sin navegador. */
export function calcularDimensiones(
  ancho: number,
  alto: number,
  maximo: number = MAXIMO_LADO
): { ancho: number; alto: number } {
  const mayor = Math.max(ancho, alto);
  if (mayor <= maximo) return { ancho, alto };

  const factor = maximo / mayor;
  return {
    ancho: Math.max(1, Math.round(ancho * factor)),
    alto: Math.max(1, Math.round(alto * factor)),
  };
}

/**
 * Redimensiona y convierte a WebP en el navegador, antes de subir.
 * Una foto de cámara de 8 MB llega a Blob pesando cientos de kilobytes,
 * y el equipo no necesita comprimirla por su cuenta.
 */
export async function procesarImagen(archivo: File): Promise<File> {
  const mapa = await createImageBitmap(archivo);
  const { ancho, alto } = calcularDimensiones(mapa.width, mapa.height);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  lienzo.getContext("2d")!.drawImage(mapa, 0, 0, ancho, alto);
  mapa.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    lienzo.toBlob(resolver, "image/webp", CALIDAD_WEBP)
  );

  if (!blob) return archivo;

  const nombre = archivo.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], nombre, { type: "image/webp" });
}

/** Las dimensiones reales del archivo ya procesado, para guardarlas en la fila. */
export async function medirImagen(archivo: File): Promise<{ ancho: number; alto: number }> {
  const mapa = await createImageBitmap(archivo);
  const medida = { ancho: mapa.width, alto: mapa.height };
  mapa.close();
  return medida;
}
