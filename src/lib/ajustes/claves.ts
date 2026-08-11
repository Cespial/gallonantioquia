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
    esquema: z.object({ x: z.string(), instagram: z.string(), youtube: z.string() }),
    porDefecto: { x: "", instagram: "", youtube: "" },
  },
} as const;

export type ClaveAjuste = keyof typeof CLAVES;
export type ValorDe<K extends ClaveAjuste> = z.infer<(typeof CLAVES)[K]["esquema"]>;
