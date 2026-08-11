export type TipoContenido =
  | "columna"
  | "bitacora"
  | "historia"
  | "idea"
  | "voz"
  | "episodio"
  // Tipos de la campaña «A paso firme por Antioquia»
  | "evento"
  | "eje"
  | "proyecto";

/**
 * Iconos disponibles para los ejes del plan de gobierno. La lista se cierra a
 * propósito: cada valor tiene su dibujo en el sitio, así que inventar uno
 * dejaría la tarjeta sin icono.
 */
export const ICONOS_EJE = [
  "salud",
  "educacion",
  "campo",
  "infraestructura",
  "empleo",
  "ambiente",
] as const;

/** Un campo propio del tipo, que se guarda dentro de `extra`. */
export interface CampoExtra {
  nombre: string;
  etiqueta: string;
  control: "texto" | "url" | "numero" | "textarea" | "imagen" | "opcion" | "multiple";
  obligatorio: boolean;
  /** Solo para control "opcion" o "multiple". */
  opciones?: string[];
  ayuda?: string;
}

export interface ConfigTipo {
  tipo: TipoContenido;
  /** Nombre de la sección tal como la ve el equipo. */
  etiqueta: string;
  /** Para textos como "Nueva columna" o "Borrar columna". */
  singular: string;
  /** No siempre es el singular con una ese: «columnas invitadas». */
  plural: string;
  articulo: "la" | "el";
  /** Segmento bajo /admin. */
  rutaAdmin: string;
  /** Ruta pública del listado. */
  rutaPublica: string;
  taxonomia: { etiqueta: string; valores: string[] } | null;
  ordenPor: "fecha" | "orden";
  /**
   * Solo aplica a `ordenPor: "fecha"`. Lo editorial va de lo más nuevo a lo
   * más viejo; una agenda va al revés, del evento más próximo en adelante.
   */
  fechaAscendente?: boolean;
  /** Si el tipo usa cuerpo largo. Ideas y episodios solo llevan descripción. */
  usaCuerpo: boolean;
  camposExtra: CampoExtra[];
}

export const TIPOS: Record<TipoContenido, ConfigTipo> = {
  columna: {
    tipo: "columna",
    etiqueta: "Huellas en Antioquia",
    singular: "columna",
    plural: "columnas",
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
    plural: "entradas",
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
    plural: "historias",
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
        // Una historia tiene UN formato. Los datos reales traen `format: "texto"`
        // como valor suelto, y /territorio-vivo pinta una sola insignia cuyo
        // color depende de él. No confundir con `episodio.format`, que sí es lista.
        nombre: "format",
        etiqueta: "Formato",
        control: "opcion",
        obligatorio: true,
        opciones: ["texto", "video", "audio", "fotografia"],
      },
    ],
  },
  idea: {
    tipo: "idea",
    etiqueta: "Antioquia Piensa",
    singular: "idea",
    plural: "ideas",
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
    plural: "columnas invitadas",
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
    plural: "episodios",
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
  evento: {
    tipo: "evento",
    etiqueta: "Horario Gallón",
    singular: "evento",
    plural: "eventos",
    articulo: "el",
    rutaAdmin: "agenda",
    rutaPublica: "/horario",
    taxonomia: null,
    ordenPor: "fecha",
    fechaAscendente: true,
    usaCuerpo: false,
    camposExtra: [
      { nombre: "municipio", etiqueta: "Municipio", control: "texto", obligatorio: true },
      {
        nombre: "hora",
        etiqueta: "Hora",
        control: "texto",
        obligatorio: true,
        ayuda: 'Como se lee en la tarjeta: "10:00 a. m.".',
      },
      {
        nombre: "lugar",
        etiqueta: "Lugar",
        control: "texto",
        obligatorio: true,
        ayuda: 'Por ejemplo: "Parque Principal".',
      },
      {
        nombre: "enlaceInscripcion",
        etiqueta: "Enlace para asistir",
        control: "url",
        obligatorio: false,
        ayuda: "Formulario o evento. Si lo dejas vacío, el botón lleva a Contacto.",
      },
    ],
  },
  eje: {
    tipo: "eje",
    etiqueta: "Plan de Gobierno",
    singular: "eje",
    plural: "ejes",
    articulo: "el",
    rutaAdmin: "ejes",
    rutaPublica: "/plan-de-gobierno",
    taxonomia: null,
    ordenPor: "orden",
    usaCuerpo: true,
    camposExtra: [
      {
        nombre: "icono",
        etiqueta: "Icono",
        control: "opcion",
        obligatorio: true,
        opciones: [...ICONOS_EJE],
      },
    ],
  },
  proyecto: {
    tipo: "proyecto",
    etiqueta: "Proyectos Destacados",
    singular: "proyecto",
    plural: "proyectos",
    articulo: "el",
    rutaAdmin: "proyectos",
    rutaPublica: "/proyectos",
    taxonomia: {
      etiqueta: "Categoría",
      valores: ["Infraestructura", "Educación", "Campo", "Salud"],
    },
    ordenPor: "orden",
    usaCuerpo: true,
    camposExtra: [],
  },
};

export const LISTA_TIPOS: ConfigTipo[] = Object.values(TIPOS);

/** Los tipos que alimentan la página de campaña, en el orden del panel. */
export const TIPOS_CAMPANA: ConfigTipo[] = [TIPOS.evento, TIPOS.eje, TIPOS.proyecto];

export function configPorRutaAdmin(ruta: string): ConfigTipo | null {
  return LISTA_TIPOS.find((c) => c.rutaAdmin === ruta) ?? null;
}

export function esTipoValido(valor: string): valor is TipoContenido {
  return valor in TIPOS;
}
