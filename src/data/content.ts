import {
  Article,
  BlogPost,
  IdeaTopic,
  Episode,
  GuestColumn,
  TimelineEvent,
  ImpactStat,
  NavItem,
} from "@/types";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Territorio Vivo", href: "/territorio-vivo" },
  { label: "Bitácora", href: "/bitacora" },
  { label: "Antioquia Piensa", href: "/antioquia-piensa" },
  { label: "Un Café", href: "/un-cafe" },
  { label: "Voces", href: "/voces" },
  { label: "Participa", href: "/participa" },
];

// ---------------------------------------------------------------------------
// Impact Stats (Hero / Home)
// ---------------------------------------------------------------------------

export const impactStats: ImpactStat[] = [
  { value: 1040, suffix: "+", label: "km de vías pavimentadas" },
  { value: 10, suffix: ",1 billones", label: "en inversión vial 2024–2027" },
  {
    value: 100,
    suffix: "+",
    label: "municipios con convenios de placa huella",
  },
  {
    value: 1,
    suffix: ",7 billones",
    label: "aprobados para el Tren Multipropósito",
  },
  {
    value: 45000,
    suffix: "+",
    label: "personas movilizadas (fase 1 del tren)",
  },
  {
    value: 35,
    suffix: "+",
    label: "años de experiencia en sector público y privado",
  },
];

// ---------------------------------------------------------------------------
// Territorio Vivo — Stories
// ---------------------------------------------------------------------------

export const stories: Article[] = [
  {
    slug: "el-puente-que-volvio-a-unir",
    title: "El puente que volvió a unir a dos veredas",
    excerpt:
      "Durante más de una década, las familias de dos veredas del Suroeste dependían de un paso improvisado sobre el río. Hoy, un puente de concreto les devolvió la conexión con el hospital, la escuela y el mercado más cercano.",
    category: "Comunidades",
    date: "2025-02-10",
    readTime: "5 min",
    format: "texto",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    slug: "el-alcalde-que-convirtio",
    title: "El alcalde que convirtió una carretera en oportunidad",
    excerpt:
      "En un municipio del Norte antioqueño, la pavimentación de 12 kilómetros de vía rural desencadenó un auge económico que nadie anticipaba. El alcalde cuenta cómo la infraestructura cambió la historia de su pueblo.",
    category: "Líderes Locales",
    date: "2025-01-22",
    readTime: "7 min",
    format: "fotografia",
    image:
      "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    slug: "una-escuela-conectada",
    title: "Una escuela que volvió a conectarse con el mundo",
    excerpt:
      "En la vereda El Silencio, los niños caminaban tres horas para llegar a clase. Con la nueva placa huella y un puente peatonal, el trayecto se redujo a cuarenta minutos. Esta es su historia.",
    category: "Conectividad",
    date: "2024-11-05",
    readTime: "4 min",
    format: "video",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    slug: "cafe-sin-barro",
    title: "Café sin barro: cuando la placa huella cambió todo",
    excerpt:
      "Los cafeteros de una vereda del Suroeste perdían hasta el 15 % de su cosecha en el trayecto al punto de acopio. La placa huella no solo les ahorró tiempo: les devolvió la rentabilidad y la dignidad.",
    category: "Campo y Empresa",
    date: "2024-09-18",
    readTime: "6 min",
    format: "audio",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6227db76b6e?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    slug: "la-vuelta-al-suroeste",
    title: "La vuelta al Suroeste: un sueño de asfalto",
    excerpt:
      "Recorrimos 280 kilómetros por carreteras que apenas hace dos años eran trocha. Desde Jardín hasta Caramanta, una crónica sobre la transformación que se siente en cada curva.",
    category: "Crónicas de Viaje",
    date: "2024-08-03",
    readTime: "8 min",
    format: "texto",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    slug: "mujeres-que-mueven-uraba",
    title: "Mujeres que mueven a Urabá",
    excerpt:
      "En Apartadó, Turbo y Carepa, un grupo de mujeres lidera cooperativas de transporte y logística que conectan el campo con los puertos. Sus rostros y sus historias, en esta galería fotográfica.",
    category: "Comunidades",
    date: "2024-06-25",
    readTime: "5 min",
    format: "fotografia",
    image:
      "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&h=600&fit=crop",
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Story categories (filter bar)
// ---------------------------------------------------------------------------

export const storyCategories: string[] = [
  "Todas",
  "Comunidades",
  "Líderes Locales",
  "Campo y Empresa",
  "Crónicas de Viaje",
  "Conectividad",
];

// ---------------------------------------------------------------------------
// Bitácora — Featured Reflection (home page)
// ---------------------------------------------------------------------------

export const featuredReflection: BlogPost = {
  slug: "lo-que-uno-aprende-cuando-escucha",
  title: "Lo que uno aprende cuando escucha más de lo que habla",
  tag: "Liderazgo",
  excerpt:
    "He recorrido cientos de veredas en Antioquia. En cada una aprendí que la gente no necesita que uno llegue con respuestas — necesita que uno llegue con los oídos abiertos. Escuchar es el primer acto de gobierno.",
  date: "2025-03-15",
  readTime: "6 min",
  image:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
};

// ---------------------------------------------------------------------------
// Bitácora — Blog Posts
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
  {
    slug: "lo-que-uno-aprende-cuando-escucha",
    title: "Lo que uno aprende cuando escucha más de lo que habla",
    tag: "Liderazgo",
    excerpt:
      "He recorrido cientos de veredas en Antioquia. En cada una aprendí que la gente no necesita que uno llegue con respuestas — necesita que uno llegue con los oídos abiertos. Escuchar es el primer acto de gobierno.",
    date: "2025-03-15",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
  },
  {
    slug: "gobernar-tambien-es-saber-esperar",
    title: "Gobernar también es saber esperar",
    tag: "Servicio Público",
    excerpt:
      "La urgencia de la política empuja a decidir rápido. Pero hay decisiones que necesitan tiempo, consenso y paciencia. Aprendí que saber esperar no es debilidad — es responsabilidad con el futuro.",
    date: "2025-02-28",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
  },
  {
    slug: "las-carreteras-conectan-suenos",
    title: "Las carreteras conectan sueños",
    tag: "Territorio",
    excerpt:
      "Cuando uno pavimenta una vía, no está poniendo asfalto: está conectando a un niño con su escuela, a un campesino con el mercado, a una familia con el hospital. Las carreteras son puentes entre lo posible y lo real.",
    date: "2025-02-10",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
  },
  {
    slug: "hacer-lo-impensable",
    title: "Hacer lo impensable",
    tag: "Decisiones",
    excerpt:
      "Cuando propusimos el Tren Multipropósito, muchos dijeron que era un sueño imposible. Hoy los recursos están aprobados. Esta reflexión es sobre la importancia de atreverse a pensar en grande, incluso cuando el entorno dice que no se puede.",
    date: "2025-01-20",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop",
  },
  {
    slug: "recorrer-antioquia-a-pie",
    title: "Recorrer Antioquia a pie",
    tag: "Aprendizajes",
    excerpt:
      "No hay plan de gobierno que reemplace la experiencia de caminar un territorio. Cada vereda tiene su ritmo, su historia y sus necesidades. Estas son las lecciones que me dejó el camino.",
    date: "2024-12-15",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  },
];

// ---------------------------------------------------------------------------
// Blog tags (filter bar)
// ---------------------------------------------------------------------------

export const blogTags: string[] = [
  "Todos",
  "Liderazgo",
  "Servicio Público",
  "Territorio",
  "Decisiones",
  "Aprendizajes",
];

// ---------------------------------------------------------------------------
// Antioquia Piensa — Idea Topics
// ---------------------------------------------------------------------------

export const ideas: IdeaTopic[] = [
  {
    number: "01",
    slug: "infraestructura-brechas-rurales",
    title: "Infraestructura para cerrar brechas rurales",
    description:
      "Cómo la conectividad vial transforma la vida del campo antioqueño.",
  },
  {
    number: "02",
    slug: "futuro-logistico",
    title: "El futuro logístico de Antioquia",
    description:
      "Puertos, trenes y corredores viales: la competitividad que viene.",
  },
  {
    number: "03",
    slug: "desarrollo-regional",
    title: "Desarrollo regional y equilibrio territorial",
    description: "125 municipios, 9 subregiones, una sola Antioquia.",
  },
  {
    number: "04",
    slug: "hub-innovacion",
    title: "Antioquia como hub de innovación",
    description: "Más allá de Medellín: innovación en cada rincón.",
  },
  {
    number: "05",
    slug: "infraestructura-agricultura",
    title: "Infraestructura y agricultura",
    description:
      "Cuando el asfalto llega al campo, el campo llega al mercado.",
  },
  {
    number: "06",
    slug: "obras-turismo",
    title: "Obras para el turismo",
    description: "Conectar los tesoros de Antioquia con el mundo.",
  },
];

// ---------------------------------------------------------------------------
// Un Café — Episodes
// ---------------------------------------------------------------------------

export const episodes: Episode[] = [
  {
    number: 1,
    title: "Antioquia rural: oportunidades y desafíos",
    guest: "María Eugenia Ospina",
    guestRole: "Líder campesina del Suroeste",
    description:
      "Conversamos con María Eugenia sobre las realidades del campo antioqueño: la lucha por la conectividad, el acceso a mercados y las oportunidades que se abren cuando la infraestructura llega a las veredas.",
    format: ["Video", "Podcast"],
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
  },
  {
    number: 2,
    title: "El liderazgo joven en los municipios",
    guest: "Carolina Restrepo",
    guestRole: "Alcaldesa de municipio joven",
    description:
      "Carolina nos comparte su experiencia como alcaldesa joven, los retos de gobernar con recursos limitados y cómo una nueva generación de líderes está transformando la política local en Antioquia.",
    format: ["Video", "Podcast", "Resumen escrito"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=600&fit=crop",
  },
  {
    number: 3,
    title: "Infraestructura y desarrollo económico",
    guest: "Jorge Alberto Mesa",
    guestRole: "Empresario antioqueño",
    description:
      "Jorge Alberto habla sobre la relación directa entre infraestructura y competitividad empresarial, y cómo los corredores viales están abriendo nuevas oportunidades de negocio en las subregiones.",
    format: ["Video", "Podcast"],
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop",
  },
  {
    number: 4,
    title: "La Antioquia que viene",
    guest: "Ana María Velásquez",
    guestRole: "Académica e investigadora",
    description:
      "Ana María analiza las tendencias de desarrollo territorial en Antioquia, el impacto del Tren Multipropósito y los desafíos que enfrenta el departamento para lograr un crecimiento equilibrado entre sus subregiones.",
    format: ["Podcast", "Resumen escrito"],
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
  },
];

// ---------------------------------------------------------------------------
// Voces — Guest Columns
// ---------------------------------------------------------------------------

export const guestColumns: GuestColumn[] = [
  {
    slug: "el-camino-del-emprendedor-rural",
    authorName: "Hernán Darío Gómez Restrepo",
    authorRole: "Empresario agroindustrial",
    authorCategory: "Empresario",
    authorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    title: "El camino del emprendedor rural",
    excerpt:
      "En Urabá aprendimos que el desarrollo económico no nace en las oficinas de Medellín, sino en las fincas, los caminos destapados y las cooperativas que mueven el banano hasta el puerto. La infraestructura es el habilitador silencioso de todo lo que hacemos.",
    date: "2025-03-01",
    pullQuote:
      "Sin vías, no hay mercado. Sin mercado, no hay futuro para el campo.",
  },
  {
    slug: "la-comunidad-que-no-espera",
    authorName: "Luz Dary Montoya Echavarría",
    authorRole: "Presidenta JAC vereda El Carmelo, Urrao",
    authorCategory: "Líder Social",
    authorImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    title: "La comunidad que no espera",
    excerpt:
      "Cuando el Estado tarda, la comunidad se organiza. Pero cuando el Estado llega de verdad — con obras, con presencia, con escucha — todo cambia. En nuestra vereda pasamos de juntar piedras para tapar huecos a tener una placa huella que nos conecta con el pueblo.",
    date: "2025-02-15",
    pullQuote:
      "No pedimos limosna. Pedimos que nos escuchen y que cumplan.",
  },
  {
    slug: "educacion-sin-aislamiento",
    authorName: "Gloria Patricia Ríos Arango",
    authorRole: "Rectora I.E. Rural Nutibara, Frontino",
    authorCategory: "Rectora",
    authorImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b964f212?w=200&h=200&fit=crop",
    title: "Educación sin aislamiento",
    excerpt:
      "Cada invierno perdíamos semanas enteras de clase porque los niños no podían cruzar el río. Hoy, con el puente nuevo y la vía mejorada, la asistencia subió un 30 %. La infraestructura no es un lujo — es una condición para que la educación funcione.",
    date: "2025-01-28",
    pullQuote:
      "Un puente no es solo concreto: es el derecho de un niño a llegar a su escuela.",
  },
  {
    slug: "datos-para-decidir-mejor",
    authorName: "Andrés Felipe Calle Agudelo",
    authorRole:
      "Investigador en desarrollo territorial, Universidad de Antioquia",
    authorCategory: "Investigador",
    authorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    title: "Datos para decidir mejor",
    excerpt:
      "Antioquia necesita más que buenas intenciones: necesita datos, indicadores y seguimiento riguroso. La inversión en infraestructura debe medirse no solo en kilómetros construidos, sino en vidas transformadas, tiempos de desplazamiento reducidos y oportunidades económicas creadas.",
    date: "2025-01-10",
    pullQuote:
      "Lo que no se mide no se mejora. Y en infraestructura, medir es cuidar la inversión pública.",
  },
];

// ---------------------------------------------------------------------------
// Timeline — Sobre Gallón
// ---------------------------------------------------------------------------

export const timelineEvents: TimelineEvent[] = [
  {
    year: "1969",
    title: "Nace en Andes",
    description:
      "Nace en el municipio de Andes, en el corazón del Suroeste antioqueño, tierra cafetera y de gente trabajadora.",
  },
  {
    year: "1988",
    title: "Inicia carrera en Bancafé",
    description:
      "Comienza su trayectoria profesional en Bancafé, donde aprende de cerca la economía rural y las dinámicas del campo colombiano.",
  },
  {
    year: "2001",
    title: "Concejal de Andes",
    description:
      "Es elegido concejal de Andes, dando sus primeros pasos en el servicio público y la representación de su comunidad.",
  },
  {
    year: "2001–2005",
    title: "Gerente de Bancafé, sucursal Jardín",
    description:
      "Asume la gerencia de la sucursal de Bancafé en Jardín, fortaleciendo su conocimiento del tejido económico del Suroeste.",
  },
  {
    year: "2005–2007",
    title: "Gerente de Asesorías y Arrendamientos G.A.",
    description:
      "Lidera la empresa Asesorías y Arrendamientos G.A., desarrollando experiencia en gestión privada y proyectos empresariales.",
  },
  {
    year: "2008–2011",
    title: "Alcalde de Andes",
    description:
      "Es elegido alcalde de Andes con 9.984 votos, el mayor caudal electoral del municipio. Lidera un gobierno cercano a la gente, enfocado en obras y desarrollo local.",
  },
  {
    year: "2014–2018",
    title: "Representante a la Cámara por Antioquia",
    description:
      "Llega al Congreso de la República como Representante a la Cámara por Antioquia, donde impulsa proyectos legislativos clave para el departamento.",
  },
  {
    year: "2015",
    title: "Ley de Turbo como Distrito Especial",
    description:
      "Impulsa y logra la aprobación de la Ley que convierte a Turbo en Distrito Especial, un hito para Urabá y la costa antioqueña.",
  },
  {
    year: "Post 2018",
    title: "Director ADR, Unidad Territorial Antioquia–Chocó",
    description:
      "Dirige la Unidad Territorial Antioquia–Chocó de la Agencia de Desarrollo Rural (ADR), acercando la política agropecuaria a las comunidades rurales.",
  },
  {
    year: "2024",
    title: "Secretario de Infraestructura Física de Antioquia",
    description:
      "Es nombrado Secretario de Infraestructura Física de la Gobernación de Antioquia, liderando la mayor inversión vial en la historia del departamento.",
  },
];

// ---------------------------------------------------------------------------
// Bio
// ---------------------------------------------------------------------------

export const bioShort: string =
  "Hijo de Andes, Suroeste antioqueño. Más de tres décadas al servicio de Antioquia. Actual Secretario de Infraestructura Física de la Gobernación de Antioquia.";

export const bioLong: string =
  "Hijo de Andes, en el corazón cafetero del Suroeste antioqueño. Desde muy joven se vinculó al sector financiero y al servicio público. Inició su carrera en Bancafé, donde comprendió de primera mano las necesidades del campo colombiano. Fue concejal de Andes, gerente de sucursal bancaria en Jardín y empresario. En 2008 fue elegido alcalde de Andes con la mayor votación en la historia del municipio — 9.984 votos — liderando un gobierno cercano a la gente, enfocado en obras, educación y desarrollo rural. Como Representante a la Cámara por Antioquia (2014–2018), impulsó proyectos legislativos clave, entre ellos la Ley que convirtió a Turbo en Distrito Especial, un hito para Urabá y la costa antioqueña. Posteriormente dirigió la Unidad Territorial Antioquia–Chocó de la Agencia de Desarrollo Rural (ADR), llevando la política agropecuaria directamente a las comunidades. Hoy, como Secretario de Infraestructura Física de la Gobernación de Antioquia, lidera la mayor inversión vial en la historia del departamento: más de 10,1 billones de pesos destinados a pavimentar vías, construir placa huella en más de 100 municipios y hacer realidad el Tren Multipropósito del río Magdalena. Más de 35 años de trayectoria en el sector público y privado lo respaldan como un líder que conoce a Antioquia, la ha recorrido y la sigue construyendo.";

// ---------------------------------------------------------------------------
// Manifesto Quotes
// ---------------------------------------------------------------------------

export const manifestoQuotes: string[] = [
  "Antioquia se construye escuchando, recorriendo y aprendiendo de su gente.",
  "La infraestructura no es solo asfalto, es dignidad, oportunidad y futuro para los territorios.",
  "Gobernar es servir, y servir es caminar al lado de la gente.",
  "Los caminos no solo acortan distancias — abren futuros.",
  "Un departamento que escucha a sus comunidades es un departamento que avanza.",
];
