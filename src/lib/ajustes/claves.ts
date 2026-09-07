import { z } from "zod";

const cifra = z.object({ valor: z.number(), sufijo: z.string(), etiqueta: z.string() });
const hito = z.object({ anio: z.string(), titulo: z.string(), descripcion: z.string() });
const itemMenu = z.object({ etiqueta: z.string(), destino: z.string(), visible: z.boolean() });

export const CLAVES = {
  "sitio.enConstruccion": { esquema: z.boolean(), porDefecto: true },
  "sitio.mensajeConstruccion": {
    esquema: z.string(),
    porDefecto: "Estamos preparando este espacio. Vuelve pronto.",
  },
  "portada.tituloHero": { esquema: z.string(), porDefecto: "Gallón Memorias" },
  "portada.subtituloHero": {
    esquema: z.string(),
    porDefecto: "Memorias, reflexiones y conversaciones sobre Antioquia.",
  },
  "portada.imagenHero": {
    esquema: z.string(),
    porDefecto: "/images/gallon-retrato-obra-hd.jpg",
  },
  "portada.cifras": { esquema: z.array(cifra), porDefecto: [] },
  "portada.reflexionDestacada": { esquema: z.string().uuid().nullable(), porDefecto: null },
  "portada.franjaFotos": { esquema: z.array(z.string().uuid()), porDefecto: [] },
  "portada.seccionesVisibles": { esquema: z.array(z.string()), porDefecto: [] },
  "sobre.texto": { esquema: z.string(), porDefecto: "" },
  "sobre.trayectoria": { esquema: z.array(hito), porDefecto: [] },
  "navegacion.menu": { esquema: z.array(itemMenu), porDefecto: [] },
  "navegacion.redes": {
    // ⚠️ Cada red va opcional con `.catch("")`, no obligatoria. La fila que
    // había guardada traía solo tres claves —se escribió antes de que
    // existieran facebook y tiktok— y con el objeto estricto el `safeParse`
    // fallaba entero: los ajustes caían al valor por defecto y el pie se
    // quedaba sin un solo icono aunque hubiera enlaces guardados.
    esquema: z.object({
      x: z.string().catch(""),
      instagram: z.string().catch(""),
      youtube: z.string().catch(""),
      facebook: z.string().catch(""),
      tiktok: z.string().catch(""),
    }).partial().transform((v) => ({
      x: v.x ?? "",
      instagram: v.instagram ?? "",
      youtube: v.youtube ?? "",
      facebook: v.facebook ?? "",
      tiktok: v.tiktok ?? "",
    })),
    porDefecto: { x: "", instagram: "", youtube: "", facebook: "", tiktok: "" },
  },

  // --- Campaña «A paso firme por Antioquia» ---
  "campana.subtituloHero": {
    esquema: z.string(),
    porDefecto:
      "Construyendo una Antioquia más fuerte, conectada y con oportunidades para todos.",
  },
  "campana.frasePerfil": {
    esquema: z.string(),
    porDefecto: "Todo gran café comienza con una buena semilla. Todo gran liderazgo también.",
  },
  "campana.mensajeCierre": {
    esquema: z.string(),
    porDefecto:
      "Unidos construiremos una Antioquia más fuerte, más justa y con más oportunidades.",
  },
  /**
   * El video de la franja «Soy Horacio Gallón». Se pega el enlace tal como se
   * copia del navegador (YouTube, youtu.be, shorts o Vimeo): `urlIncrustable`
   * lo traduce a la URL que acepta el iframe. Vacío = la sección muestra la
   * pieza de campaña y anuncia que el video viene en camino.
   */
  "campana.videoPerfil": { esquema: z.string(), porDefecto: "" },
  /** Enlace al podcast (canal de YouTube, Spotify…). Vacío = «en camino». */
  "campana.podcast": { esquema: z.string(), porDefecto: "" },
  /** Alimenta el desplegable del formulario «Te escuchamos». */
  "campana.municipios": { esquema: z.array(z.string()), porDefecto: [] },
  "contacto.email": { esquema: z.string(), porDefecto: "info@gallongobernador.com" },
  "contacto.telefono": { esquema: z.string(), porDefecto: "+57 300 123 4567" },
  "contacto.direccion": { esquema: z.string(), porDefecto: "Medellín, Antioquia, Colombia" },
  /** Solo dígitos con indicativo, como lo pide el enlace de wa.me. */
  "contacto.whatsapp": { esquema: z.string(), porDefecto: "573001234567" },
} as const;

export type ClaveAjuste = keyof typeof CLAVES;

/**
 * Lo que un editor puede cambiar sin ser administrador.
 *
 * El equipo de campaña necesita mover el video, el podcast, los textos de la
 * portada y los datos de contacto sin pedir permiso, pero no debería poder
 * apagar el sitio, rehacer el menú ni reescribir la biografía. La lista se
 * declara en blanco —lo que no está, no se puede— para que una clave nueva
 * nazca cerrada y haya que abrirla a conciencia.
 *
 * `guardarAjuste` la hace cumplir en el servidor. Lo que la pantalla muestre o
 * esconda es cortesía, no control de acceso.
 */
export const CLAVES_DE_EDITOR = [
  "campana.videoPerfil",
  "campana.podcast",
  "campana.subtituloHero",
  "campana.frasePerfil",
  "campana.mensajeCierre",
  "contacto.email",
  "contacto.telefono",
  "contacto.whatsapp",
  "contacto.direccion",
  "navegacion.redes",
] as const satisfies readonly ClaveAjuste[];

export function editorPuedeEscribir(clave: string): boolean {
  return (CLAVES_DE_EDITOR as readonly string[]).includes(clave);
}

export type ValorDe<K extends ClaveAjuste> = z.infer<(typeof CLAVES)[K]["esquema"]>;
