/**
 * Map of image filenames to object-position values.
 * Centers on the face/subject for each photo so cropping looks natural.
 * Default is "center" if not listed here.
 */
const facePositions: Record<string, string> = {
  // Retratos — rostro en la parte superior
  "gallon-retrato-obra-hd.jpg": "center 15%",
  "gallon-retrato-casco.jpg": "center 20%",
  "gallon-retrato-montanas-portrait.jpg": "center 15%",
  "gallon-retrato-montanas-wide.jpg": "center 15%",

  // De pie hablando — rostro en el tercio superior
  "gallon-discurso.jpg": "center 25%",
  "gallon-hablando-comunidad.jpg": "center 30%",
  "gallon-tunel-mar.jpg": "center 25%",
  "gallon-evento-banderas.jpg": "center 25%",
  "gallon-presentacion.jpg": "center 25%",
  "gallon-discurso-microphone.jpg": "center 25%",
  "gallon-entrevista-medellin.jpg": "center 30%",

  // Grupos de pie — rostros un poco más abajo
  "gallon-conversacion-rural.jpg": "center 30%",
  "gallon-caminando-obra.jpg": "center 30%",
  "gallon-vias-seguridad.jpg": "center 35%",
  "gallon-reunion-biblioteca.jpg": "center 25%",

  // Grupos interiores / sentados
  "gallon-familia-grande.jpg": "center 30%",
  "gallon-familia-intima.jpg": "center 30%",
  "gallon-pareja-futbol.jpg": "center 35%",
  "gallon-close-up.jpg": "center 30%",
  "gallon-parque-pueblo.jpg": "center 40%",

  // Paisajes — centrar normalmente
  "hero-gallon-montanas.jpg": "center 40%",
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
