/**
 * Map of image filenames to object-position values.
 * Calibrated per image based on actual dimensions and face location.
 * Vertical (portrait) images need lower % values to show the face
 * since object-cover crops aggressively top/bottom on wide containers.
 */
const facePositions: Record<string, string> = {
  // VERTICAL images (portrait) — face near top, need low % to show head
  "gallon-retrato-obra-hd.jpg": "center 10%",
  "gallon-retrato-montanas-portrait.jpg": "center 10%",
  "gallon-retrato-casco.jpg": "center 15%",
  "gallon-hablando-comunidad.jpg": "center 15%",
  "gallon-presentacion.jpg": "center 15%",
  "gallon-tunel-mar.jpg": "center 15%",
  "gallon-tunel-moso.jpg": "center 15%",
  "gallon-entrevista-medellin.jpg": "center 20%",
  "gallon-discurso-microphone.jpg": "center 20%",
  "gallon-pareja-futbol.jpg": "center 25%",
  "gallon-close-up.jpg": "center 20%",
  "gallon-alcalde.jpg": "center 20%",
  "gallon-portada.jpg": "center 15%",

  // HORIZONTAL/SQUARE images — face more centered, moderate %
  "gallon-retrato-montanas-wide.jpg": "center 25%",
  "gallon-discurso.jpg": "center 20%",
  "gallon-evento-banderas.jpg": "center 20%",
  "gallon-conversacion-rural.jpg": "center 25%",
  "gallon-caminando-obra.jpg": "center 30%",
  "gallon-vias-seguridad.jpg": "center 30%",
  "gallon-reunion-biblioteca.jpg": "center 25%",
  "gallon-familia-grande.jpg": "center 25%",
  "gallon-familia-intima.jpg": "center 25%",
  "gallon-cafe.jpg": "center 25%",
  "gallon-congreso.jpg": "center 20%",
  "gallon-mascota.jpg": "center 25%",
  "gallon-parque-pueblo.jpg": "center 35%",

  // LANDSCAPE/PAISAJES — centrar normalmente
  "hero-gallon-montanas.jpg": "center 35%",
  "hero-montanas-panoramico.jpg": "center",
  "fondo-mapa-antioquia.jpg": "center",
  "fondo-cafetal.jpg": "center",
  "og-image-gallon.jpg": "center",
};

/**
 * Given a full image path like "/images/gallon-discurso.jpg",
 * returns the optimal object-position for face centering.
 */
export function getFacePosition(imagePath: string): string {
  const filename = imagePath.split("/").pop() || "";
  return facePositions[filename] || "center";
}
