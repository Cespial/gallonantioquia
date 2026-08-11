/**
 * Carga el contenido inicial de la campaña: los seis ejes, los cuatro
 * proyectos destacados y la agenda del mockup, más los ajustes de portada.
 *
 * Es idempotente: se puede volver a correr sin duplicar nada. Los textos son
 * borradores tomados del mockup; el equipo los ajusta desde el panel.
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { and, eq, isNull } from "drizzle-orm";
import * as esquema from "@/db/esquema";
import { contenidos, medios } from "@/db/esquema";
import { escribirAjuste } from "@/lib/ajustes";

neonConfig.webSocketConstructor = WebSocket;

const EJES = [
  ["salud", "Salud", "Más cobertura y atención cercana en todas las subregiones."],
  ["educacion", "Educación", "Educación pública de calidad, del preescolar a la formación técnica."],
  ["campo", "Campo y Desarrollo Rural", "Apoyo al campesino y desarrollo rural sostenible."],
  ["infraestructura", "Infraestructura", "Vías que conectan regiones y abren oportunidades."],
  ["empleo", "Empleo y Emprendimiento", "Condiciones para crear empresa y generar trabajo formal."],
  ["ambiente", "Medio Ambiente", "Cuidado del agua, los bosques y la vida de Antioquia."],
] as const;

const PROYECTOS = [
  [
    "vias-para-la-integracion",
    "Vías para la integración",
    "Infraestructura",
    "Mejoramiento y construcción de vías que conectan regiones y oportunidades.",
    "/images/campana/proyecto-infraestructura.webp",
  ],
  [
    "educacion-con-calidad",
    "Educación con calidad",
    "Educación",
    "Fortalecimiento de la educación pública para construir un mejor futuro.",
    "/images/campana/proyecto-educacion.webp",
  ],
  [
    "apoyo-al-campo",
    "Apoyo al campo",
    "Campo",
    "Impulsamos al campesino y el desarrollo rural sostenible.",
    "/images/campana/proyecto-campo.webp",
  ],
  [
    "salud-para-todos",
    "Salud para todos",
    "Salud",
    "Más cobertura, atención y bienestar para los antioqueños.",
    "/images/campana/proyecto-salud.webp",
  ],
] as const;

const AGENDA = [
  ["tamesis-2026-10-24", "Támesis", "2026-10-24", "10:00 a. m.", "Parque Principal"],
  ["andes-2026-10-25", "Andes", "2026-10-25", "02:00 p. m.", "Plaza Principal"],
  ["jardin-2026-10-26", "Jardín", "2026-10-26", "09:00 a. m.", "Casa de Cultura"],
] as const;

/** Municipios de Antioquia por subregión, para el desplegable del formulario. */
const MUNICIPIOS = [
  // Valle de Aburrá
  "Medellín", "Barbosa", "Bello", "Caldas", "Copacabana", "Envigado", "Girardota", "Itagüí",
  "La Estrella", "Sabaneta",
  // Suroeste
  "Amagá", "Andes", "Angelópolis", "Betania", "Betulia", "Caramanta", "Ciudad Bolívar",
  "Concordia", "Fredonia", "Hispania", "Jardín", "Jericó", "La Pintada", "Montebello",
  "Pueblorrico", "Salgar", "Santa Bárbara", "Támesis", "Tarso", "Titiribí", "Urrao", "Valparaíso",
  "Venecia",
  // Oriente
  "Abejorral", "Alejandría", "Argelia", "Carmen de Viboral", "Cocorná", "Concepción", "Granada",
  "Guarne", "Guatapé", "La Ceja", "La Unión", "Marinilla", "Nariño", "Peñol", "Retiro",
  "Rionegro", "San Carlos", "San Francisco", "San Luis", "San Rafael", "San Vicente", "Santuario",
  "Sonsón",
  // Occidente
  "Abriaquí", "Anzá", "Armenia", "Buriticá", "Caicedo", "Cañasgordas", "Dabeiba", "Ebéjico",
  "Frontino", "Giraldo", "Heliconia", "Liborina", "Olaya", "Peque", "Sabanalarga", "San Jerónimo",
  "Santa Fe de Antioquia", "Sopetrán", "Uramita",
  // Norte
  "Angostura", "Belmira", "Briceño", "Campamento", "Carolina del Príncipe", "Don Matías",
  "Entrerríos", "Gómez Plata", "Guadalupe", "Ituango", "San Andrés de Cuerquia", "San José de la Montaña",
  "San Pedro de los Milagros", "Santa Rosa de Osos", "Toledo", "Valdivia", "Yarumal",
  // Nordeste
  "Amalfi", "Anorí", "Cisneros", "Remedios", "San Roque", "Santo Domingo", "Segovia", "Vegachí",
  "Yalí", "Yolombó",
  // Bajo Cauca
  "Caucasia", "Cáceres", "El Bagre", "Nechí", "Tarazá", "Zaragoza",
  // Magdalena Medio
  "Caracolí", "Maceo", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Yondó",
  // Urabá
  "Apartadó", "Arboletes", "Carepa", "Chigorodó", "Murindó", "Mutatá", "Necoclí", "San Juan de Urabá",
  "San Pedro de Urabá", "Turbo", "Vigía del Fuerte",
];

async function principal() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: esquema });

  /** Registra la imagen si no está, y devuelve su id. */
  async function medio(url: string, nombre: string, alt: string) {
    const [existente] = await db.select().from(medios).where(eq(medios.url, url));
    if (existente) return existente.id;

    const [fila] = await db.insert(medios).values({ url, nombre, alt }).returning();
    return fila.id;
  }

  async function upsert(fila: typeof contenidos.$inferInsert) {
    const [existente] = await db
      .select()
      .from(contenidos)
      .where(
        and(
          eq(contenidos.tipo, fila.tipo),
          eq(contenidos.slug, fila.slug!),
          isNull(contenidos.eliminadoEn)
        )
      );

    if (existente) {
      await db.update(contenidos).set(fila).where(eq(contenidos.id, existente.id));
      return "actualizado";
    }
    await db.insert(contenidos).values(fila);
    return "creado";
  }

  let n = 0;

  for (const [icono, titulo, descripcion] of EJES) {
    await upsert({
      tipo: "eje",
      slug: icono,
      titulo,
      resumen: descripcion,
      cuerpoHtml: `<p>${descripcion}</p>`,
      fecha: "2026-08-11",
      estado: "publicado",
      orden: EJES.findIndex((e) => e[0] === icono),
      extra: { icono },
    });
    n++;
  }

  for (const [slug, titulo, categoria, descripcion, imagen] of PROYECTOS) {
    const imagenId = await medio(imagen, `${slug}.webp`, `Fotografía del proyecto ${titulo}`);
    await upsert({
      tipo: "proyecto",
      slug,
      titulo,
      resumen: descripcion,
      cuerpoHtml: `<p>${descripcion}</p>`,
      fecha: "2026-08-11",
      categoria,
      estado: "publicado",
      orden: PROYECTOS.findIndex((p) => p[0] === slug),
      imagenId,
      extra: {},
    });
    n++;
  }

  for (const [slug, municipio, fecha, hora, lugar] of AGENDA) {
    await upsert({
      tipo: "evento",
      slug,
      titulo: `${municipio} — ${lugar}`,
      resumen: `Encuentro con la comunidad en ${municipio}.`,
      fecha,
      estado: "publicado",
      extra: { municipio, hora, lugar, enlaceInscripcion: "" },
    });
    n++;
  }

  await escribirAjuste(db, "navegacion.menu", [
    { etiqueta: "Inicio", destino: "/", visible: true },
    { etiqueta: "Quién es Gallón", destino: "/quien-es-gallon", visible: true },
    { etiqueta: "Horario Gallón", destino: "/horario", visible: true },
    { etiqueta: "Plan de Gobierno", destino: "/plan-de-gobierno", visible: true },
    { etiqueta: "Te Escuchamos", destino: "/te-escuchamos", visible: true },
    { etiqueta: "Proyectos", destino: "/proyectos", visible: true },
    { etiqueta: "Contacto", destino: "/contacto", visible: true },
  ]);

  await escribirAjuste(db, "campana.municipios", MUNICIPIOS);
  await escribirAjuste(db, "portada.cifras", [
    { valor: 125, sufijo: "", etiqueta: "Municipios visitados" },
    { valor: 10000, sufijo: "+", etiqueta: "Ciudadanos visitados" },
  ]);

  console.log(`Contenido de campaña sembrado: ${n} registros.`);
  console.log(`Municipios cargados en el formulario: ${MUNICIPIOS.length}.`);
  await pool.end();
}

principal().catch((e) => {
  console.error("Falló la siembra:", e);
  process.exit(1);
});
