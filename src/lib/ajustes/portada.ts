import { z } from "zod";
import { foto, fotoRepo } from "./foto";

// No importa `./claves`: `claves.ts` va a importar este módulo en una tarea
// posterior para armar `CLAVES_DE_EDITOR`, y ese sentido único evita un ciclo.

const texto = (max: number) => z.string().max(max);
/**
 * `maxLen` es el tope por ítem, no el de la lista. 220 alcanza para casi todo
 * el copy de hoy, salvo un par de líneas largas de la semblanza verde de
 * Perfil, que piden un tope propio más alto para no recortar el texto real.
 */
const lista = (max: number, maxLen = 220) => z.array(z.string().min(1).max(maxLen)).min(1).max(max);
const cifra = z.object({ valor: z.number(), sufijo: z.string(), etiqueta: z.string() });

const hero = z.object({ palabra: texto(30), subtitulo: texto(220), fondo: foto, retrato: foto });
const perfil = z.object({
  antetitulo: texto(40),
  nombre: texto(30),
  frase: texto(160),
  semblanzaClara: lista(4),
  semblanzaVerde: lista(4, 400),
  abrazo: foto,
});
const video = z.object({
  antetitulo: texto(60),
  titular: texto(120),
  parrafo1: texto(400),
  parrafo2: texto(400),
  url: z.string(),
});
const conectamos = z.object({
  linea1: texto(30),
  linea2: texto(30),
  linea3: texto(30),
  frase: texto(160),
  parrafo: texto(500),
  significaTitulo: texto(80),
  significa: lista(8),
  logramosTitulo: texto(80),
  logramosBajada: texto(200),
  recuperadas: lista(6),
});
const sumamos = z.object({
  titular1: texto(120),
  bajada1: texto(200),
  obras: lista(8),
  titular2: texto(120),
  bajada2: texto(200),
  emergencias: lista(10),
  retrato: foto,
});
const mosaico = z.object({ fotos: z.array(foto).length(6) });
const caracter = z.object({ titular: texto(200), frase: texto(120) });
const cafe = z.object({ parrafos: z.array(texto(500)).min(1).max(4), fotos: z.array(foto).length(2) });
const blog = z.object({ parrafo: texto(500) });
const podcast = z.object({ parrafo: texto(500), url: z.string() });
const equipo = z.object({ foto });
// Solo dos pictogramas en la franja (ver `ICONOS` en FranjaCifras.tsx): un
// tercero no tiene dónde pintarse.
const cifras = z.object({ cifras: z.array(cifra).min(1).max(2), mensaje: texto(160), fondo: foto });

export type PortadaHero = z.infer<typeof hero>;
export type PortadaPerfil = z.infer<typeof perfil>;
export type PortadaVideo = z.infer<typeof video>;
export type PortadaConectamos = z.infer<typeof conectamos>;
export type PortadaSumamos = z.infer<typeof sumamos>;
export type PortadaMosaico = z.infer<typeof mosaico>;
export type PortadaCaracter = z.infer<typeof caracter>;
export type PortadaCafe = z.infer<typeof cafe>;
export type PortadaBlog = z.infer<typeof blog>;
export type PortadaPodcast = z.infer<typeof podcast>;
export type PortadaEquipo = z.infer<typeof equipo>;
export type PortadaCifras = z.infer<typeof cifras>;

// El panorama de la cordillera abre el hero y cierra la franja de cifras: es
// decorativo en los dos sitios, por eso el alt vacío.
const PANORAMA = fotoRepo("/images/campana/panorama-cordillera.webp", "", 2400, 764);

/** El copy y las fotos de hoy, literales: con esto la portada no cambia al desplegar. */
export const CLAVES_PORTADA = {
  "portada.hero": {
    esquema: hero,
    porDefecto: {
      palabra: "Antioquia",
      subtitulo: "Construyendo una Antioquia más fuerte, conectada y con oportunidades para todos.",
      fondo: PANORAMA,
      retrato: fotoRepo(
        "/images/campana/gallon-pulgar.webp",
        "Horacio Gallón, candidato a la Gobernación de Antioquia",
        1200,
        1239
      ),
    } satisfies PortadaHero,
  },

  "portada.perfil": {
    esquema: perfil,
    porDefecto: {
      antetitulo: "Soy Horacio",
      nombre: "Gallón",
      frase: "Todo gran café comienza con una buena semilla. Todo gran liderazgo también.",
      semblanzaClara: [
        "Nací en Andes, en el Suroeste antioqueño.",
        "Hago parte de una familia donde la disciplina, el valor de la palabra y el compromiso con la comunidad no se negocian.",
        "Me formé como Administrador de Empresas y especialista en Contratación Estatal. Soy experto en Formulación, Elaboración y Evaluación de Proyectos.",
      ],
      semblanzaVerde: [
        "Llevo más de 30 años dedicado al servicio público y privado. Me he desempeñado, entre otros roles, como concejal, alcalde, representante a la Cámara, director de la Agencia de Desarrollo Rural y secretario de Infraestructura de Antioquia.",
        "Fui asesor comercial y gerente de Bancafé; emprendedor; gerente de Asesorías y Arrendamientos G. A.; miembro de Consejo directivo del Plan Departamental de Aguas y de Corantioquia; presidente de la Junta Directiva del Centro de Bienestar del Anciano, Jardín – Antioquia, y presidente de la Asociación de Usuarios de Televisión por Cable de Andes.",
        "He trabajado para impulsar proyectos que mejoren la movilidad, conecten los municipios, fortalezcan la competitividad y generen oportunidades para las familias antioqueñas.",
      ],
      abrazo: fotoRepo(
        "/images/campana/gallon-abrazo.webp",
        "Horacio Gallón abraza a una mujer mayor durante un recorrido por Antioquia",
        1018,
        854
      ),
    } satisfies PortadaPerfil,
  },

  "portada.video": {
    esquema: video,
    porDefecto: {
      antetitulo: "En sus propias palabras",
      titular: "Una hoja de vida no alcanza a contar un recorrido.",
      parrafo1:
        "Treinta años entre lo público y lo privado: concejal, alcalde, representante a la Cámara, director de la Agencia de Desarrollo Rural y secretario de Infraestructura de Antioquia.",
      parrafo2:
        "Detrás de cada cargo hay municipios recorridos, obras destrabadas y gente escuchada en su propio pueblo. Eso no cabe en un renglón: pronto lo cuenta él mismo, aquí.",
      url: "",
    } satisfies PortadaVideo,
  },

  "portada.conectamos": {
    esquema: conectamos,
    porDefecto: {
      linea1: "Así",
      linea2: "Conectamos",
      linea3: "Antioquia",
      frase: "Las **mejores cosechas** nacen\ncuando se **trabaja en equipo**.",
      parrafo:
        "Dejamos contratados, en ejecución o en proceso de contratación cerca de 1.400 kilómetros de vías pavimentadas, lo que permitirá que Antioquia pase de tener el 45% al 73% de su red vial pavimentada antes de finalizar 2028.",
      significaTitulo: "Esto significa para los antioqueños:",
      significa: [
        "Más cercanía a los municipios a las vías 4G que los llevan a los puertos y aeropuertos internacionales",
        "Más oportunidades para vender productos",
        "Más desarrollo para Antioquia",
        "Menores costos de transporte",
        "Menos tiempo de viaje",
        "Más turismo",
      ],
      logramosTitulo: "Logramos que las obras se hicieran.",
      logramosBajada: "Recuperamos proyectos que estaban detenidos\ny que llevaban años enfrentando dificultades.",
      recuperadas: [
        "Intercambio vial del Aeropuerto José María Córdova",
        "Segunda etapa del Túnel de Oriente",
        "Avances de la Nueva Vía al Mar",
      ],
    } satisfies PortadaConectamos,
  },

  "portada.sumamos": {
    esquema: sumamos,
    porDefecto: {
      titular1: "Sumamos esfuerzos, articulamos\nvoluntades y lideramos\ncon propósito.",
      bajada1: "Defendimos las grandes obras estratégicas\ne impulsamos el desarrollo de las vías terciarias.",
      obras: [
        "Pavimentación de más de 1.400 kilómetros de vías secundarias.",
        "Construcción de placas huella en más de 100 municipios.",
        "Extensión del Metro hacia el Aburrá Norte.",
        "Segunda etapa del Túnel de Oriente.",
        "Nueva Vía al Mar - Túnel del Toyo.",
      ],
      titular2: "Respondimos a los llamados para\nbuscar soluciones.",
      bajada2: "Acompañamos la gestión de las necesidades\ny emergencias de las vías.",
      emergencias: [
        "Atención de derrumbes",
        "Recuperación de vías",
        "Maquinaria amarilla",
        "Mantenimiento",
        "Puntos críticos",
        "Estabilización",
        "Puentes",
      ],
      retrato: fotoRepo(
        "/images/campana/gallon-senala.webp",
        "Horacio Gallón señala el valle de Aburrá desde un mirador",
        1400,
        1232
      ),
    } satisfies PortadaSumamos,
  },

  "portada.mosaico": {
    esquema: mosaico,
    porDefecto: {
      fotos: [
        fotoRepo(
          "/images/campana/obra-placa-huella.webp",
          "Placa huella recién construida en una vía terciaria antioqueña",
          1100,
          733
        ),
        fotoRepo(
          "/images/campana/obra-cordillera.webp",
          "Vista aérea de la cordillera antioqueña atravesada por una vía",
          1000,
          318
        ),
        fotoRepo(
          "/images/campana/obra-metro.webp",
          "Imagen de referencia del tren del Río, creada con inteligencia artificial",
          370,
          262
        ),
        fotoRepo(
          "/images/campana/obra-viaducto.webp",
          "Vista aérea de una doble calzada entre montañas verdes",
          1000,
          720
        ),
        fotoRepo(
          "/images/campana/obra-puerto.webp",
          "Grúas pórtico de un puerto marítimo en la costa antioqueña",
          1000,
          563
        ),
        fotoRepo(
          "/images/campana/obra-tunel.webp",
          "Cuadrilla de obreros trabajando en el frente de excavación de un túnel",
          900,
          1350
        ),
      ],
    } satisfies PortadaMosaico,
  },

  "portada.caracter": {
    esquema: caracter,
    porDefecto: {
      titular:
        "Mi carácter se ha cultivado recorriendo Antioquia, trabajando con sus municipios y convirtiendo proyectos en resultados.",
      frase: "**Antioquia** será nuestra\n**mejor cosecha**",
    } satisfies PortadaCaracter,
  },

  "portada.cafe": {
    esquema: cafe,
    porDefecto: {
      parrafos: [
        "Café Gallón es, antes que un café, un símbolo de Antioquia. Y dentro de esa taza cabe cualquier café del departamento.",
        "Todos los cafés antioqueños son buenos y ninguno sabe igual. Cambian con el territorio, con el clima, con la altura a la que crece la mata: son esas variables las que hacen un buen café. Un café tan diverso como Antioquia, y por eso la representa.",
        "Y además el café es una excusa. Una taza abre una conversación, y de una conversación salen las ideas que después se vuelven proyectos. Así hemos recorrido el departamento: **sentándonos a hablar con quien vive cada municipio**.",
      ],
      fotos: [
        fotoRepo(
          "/images/gallon-parque-pueblo.jpg",
          "Horacio Gallón conversa alrededor de una mesa con tazas de café, en el parque principal de un municipio antioqueño",
          1920,
          1440
        ),
        fotoRepo(
          "/images/gallon-conversacion-rural.jpg",
          "Horacio Gallón habla con un grupo de personas durante un recorrido por una vereda de Antioquia",
          1280,
          1176
        ),
      ],
    } satisfies PortadaCafe,
  },

  "portada.blog": {
    esquema: blog,
    porDefecto: {
      parrafo:
        "Escribo para explicar decisiones, no para adornarlas. En estas columnas están las obras que destrabamos, los debates que dimos y las razones detrás de cada una: infraestructura, competitividad, territorio y la Antioquia que se construye a paso firme.",
    } satisfies PortadaBlog,
  },

  "portada.podcast": {
    esquema: podcast,
    porDefecto: {
      parrafo:
        "Un podcast para sentarse a hablar sin afán: con quien conoce un territorio palmo a palmo, con quien lleva media vida en un oficio, con quien tiene una idea que a Antioquia le sirve. El mismo café de siempre, ahora grabado.",
      url: "",
    } satisfies PortadaPodcast,
  },

  "portada.equipo": {
    esquema: equipo,
    porDefecto: {
      foto: fotoRepo(
        "/images/campana/equipo-cafe.webp",
        "Horacio Gallón acompañado de cuatro dirigentes antioqueños, tomando café en una finca",
        1280,
        975
      ),
    } satisfies PortadaEquipo,
  },

  "portada.cifras": {
    esquema: cifras,
    porDefecto: {
      cifras: [
        { valor: 125, sufijo: "", etiqueta: "Municipios visitados" },
        { valor: 10000, sufijo: "+", etiqueta: "Ciudadanos visitados" },
      ],
      mensaje: "Unidos construiremos una Antioquia más fuerte, más justa y con más oportunidades.",
      fondo: PANORAMA,
    } satisfies PortadaCifras,
  },
} as const;

/** Orden de la portada, nombre para el equipo y ancla a la que salta «Ver la portada». */
export const FRANJAS = [
  { clave: "portada.hero", etiqueta: "Hero: A paso firme", ancla: "#inicio" },
  { clave: "portada.perfil", etiqueta: "Soy Horacio Gallón", ancla: "#soy-gallon" },
  { clave: "portada.video", etiqueta: "Video: en sus propias palabras", ancla: "#conoce-a-gallon" },
  { clave: "portada.conectamos", etiqueta: "Así conectamos Antioquia", ancla: "#a-paso-firme" },
  { clave: "portada.sumamos", etiqueta: "Sumamos esfuerzos", ancla: "#por-antioquia" },
  { clave: "portada.mosaico", etiqueta: "Mosaico de obras", ancla: "#por-antioquia" },
  { clave: "portada.caracter", etiqueta: "Mi carácter", ancla: "#cafe-gallon" },
  { clave: "portada.cafe", etiqueta: "Café Gallón", ancla: "#cafe-gallon" },
  { clave: "portada.blog", etiqueta: "Blog Gallón", ancla: "#blog" },
  { clave: "portada.podcast", etiqueta: "Podcast", ancla: "#podcast" },
  { clave: "portada.equipo", etiqueta: "Foto de equipo", ancla: "#podcast" },
  { clave: "portada.cifras", etiqueta: "Cifras y cierre", ancla: "#podcast" },
] as const;
export type ClavePortada = (typeof FRANJAS)[number]["clave"];
