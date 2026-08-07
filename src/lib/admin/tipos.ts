export type TipoContenido =
  | "columna"
  | "bitacora"
  | "historia"
  | "idea"
  | "voz"
  | "episodio";

/** Un campo propio del tipo, que se guarda dentro de `extra`. */
export interface CampoExtra {
  nombre: string;
  etiqueta: string;
  control: "texto" | "url" | "numero" | "textarea" | "imagen" | "multiple";
  obligatorio: boolean;
  /** Solo para control "multiple". */
  opciones?: string[];
  ayuda?: string;
}

export interface ConfigTipo {
  tipo: TipoContenido;
  /** Nombre de la sección tal como la ve el equipo. */
  etiqueta: string;
  /** Para textos como "Nueva columna" o "Borrar columna". */
  singular: string;
  articulo: "la" | "el";
  /** Segmento bajo /admin. */
  rutaAdmin: string;
  /** Ruta pública del listado. */
  rutaPublica: string;
  taxonomia: { etiqueta: string; valores: string[] } | null;
  ordenPor: "fecha" | "orden";
  /** Si el tipo usa cuerpo largo. Ideas y episodios solo llevan descripción. */
  usaCuerpo: boolean;
  camposExtra: CampoExtra[];
}

export const TIPOS: Record<TipoContenido, ConfigTipo> = {
  columna: {
    tipo: "columna",
    etiqueta: "Huellas en Antioquia",
    singular: "columna",
    articulo: "la",
    rutaAdmin: "columnas",
    rutaPublica: "/columnas",
    taxonomia: { etiqueta: "Año", valores: ["2026", "2022", "2021"] },
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      {
        nombre: "sourceUrl",
        etiqueta: "Enlace a la publicación original",
        control: "url",
        obligatorio: false,
        ayuda: "La dirección en Al Poniente. Déjalo vacío si no se publicó en otro medio.",
      },
      { nombre: "readTime", etiqueta: "Tiempo de lectura", control: "texto", obligatorio: false, ayuda: 'Por ejemplo: "5 min".' },
    ],
  },
  bitacora: {
    tipo: "bitacora",
    etiqueta: "Bitácora",
    singular: "entrada",
    articulo: "la",
    rutaAdmin: "bitacora",
    rutaPublica: "/bitacora",
    taxonomia: {
      etiqueta: "Tema",
      valores: ["Liderazgo", "Servicio Público", "Territorio", "Decisiones", "Aprendizajes"],
    },
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "readTime", etiqueta: "Tiempo de lectura", control: "texto", obligatorio: false },
    ],
  },
  historia: {
    tipo: "historia",
    etiqueta: "Territorio Vivo",
    singular: "historia",
    articulo: "la",
    rutaAdmin: "historias",
    rutaPublica: "/territorio-vivo",
    taxonomia: {
      etiqueta: "Categoría",
      valores: ["Comunidades", "Líderes Locales", "Campo y Empresa", "Crónicas de Viaje", "Conectividad"],
    },
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "readTime", etiqueta: "Tiempo de lectura", control: "texto", obligatorio: false },
      {
        nombre: "format",
        etiqueta: "Formato",
        control: "multiple",
        obligatorio: true,
        opciones: ["texto", "video", "audio", "fotografia"],
      },
    ],
  },
  idea: {
    tipo: "idea",
    etiqueta: "Antioquia Piensa",
    singular: "idea",
    articulo: "la",
    rutaAdmin: "ideas",
    rutaPublica: "/antioquia-piensa",
    taxonomia: null,
    ordenPor: "orden",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "number", etiqueta: "Número", control: "texto", obligatorio: true, ayuda: 'Dos dígitos, por ejemplo "01".' },
    ],
  },
  voz: {
    tipo: "voz",
    etiqueta: "Voces",
    singular: "columna invitada",
    articulo: "la",
    rutaAdmin: "voces",
    rutaPublica: "/voces",
    taxonomia: null,
    ordenPor: "fecha",
    usaCuerpo: true,
    camposExtra: [
      { nombre: "authorName", etiqueta: "Nombre del autor", control: "texto", obligatorio: true },
      { nombre: "authorRole", etiqueta: "Cargo del autor", control: "texto", obligatorio: true },
      { nombre: "authorCategory", etiqueta: "Área", control: "texto", obligatorio: false },
      { nombre: "authorImage", etiqueta: "Foto del autor", control: "imagen", obligatorio: false },
      { nombre: "pullQuote", etiqueta: "Frase destacada", control: "textarea", obligatorio: false },
    ],
  },
  episodio: {
    tipo: "episodio",
    etiqueta: "Un Café",
    singular: "episodio",
    articulo: "el",
    rutaAdmin: "un-cafe",
    rutaPublica: "/un-cafe",
    taxonomia: null,
    ordenPor: "orden",
    usaCuerpo: false,
    camposExtra: [
      { nombre: "number", etiqueta: "Número de episodio", control: "numero", obligatorio: true },
      { nombre: "guest", etiqueta: "Invitado", control: "texto", obligatorio: true },
      { nombre: "guestRole", etiqueta: "Cargo del invitado", control: "texto", obligatorio: true },
      {
        nombre: "format",
        etiqueta: "Formatos disponibles",
        control: "multiple",
        obligatorio: true,
        opciones: ["Video", "Podcast", "Resumen escrito"],
      },
    ],
  },
};

export const LISTA_TIPOS: ConfigTipo[] = Object.values(TIPOS);

export function configPorRutaAdmin(ruta: string): ConfigTipo | null {
  return LISTA_TIPOS.find((c) => c.rutaAdmin === ruta) ?? null;
}

export function esTipoValido(valor: string): valor is TipoContenido {
  return valor in TIPOS;
}
