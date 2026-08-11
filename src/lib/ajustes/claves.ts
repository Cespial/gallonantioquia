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
    esquema: z.object({
      x: z.string(),
      instagram: z.string(),
      youtube: z.string(),
      facebook: z.string(),
      tiktok: z.string(),
    }),
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
  /** Alimenta el desplegable del formulario «Te escuchamos». */
  "campana.municipios": { esquema: z.array(z.string()), porDefecto: [] },
  "contacto.email": { esquema: z.string(), porDefecto: "info@gallongobernador.com" },
  "contacto.telefono": { esquema: z.string(), porDefecto: "+57 300 123 4567" },
  "contacto.direccion": { esquema: z.string(), porDefecto: "Medellín, Antioquia, Colombia" },
  /** Solo dígitos con indicativo, como lo pide el enlace de wa.me. */
  "contacto.whatsapp": { esquema: z.string(), porDefecto: "573001234567" },
} as const;

export type ClaveAjuste = keyof typeof CLAVES;
export type ValorDe<K extends ClaveAjuste> = z.infer<(typeof CLAVES)[K]["esquema"]>;
