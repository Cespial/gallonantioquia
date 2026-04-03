"use client";

import {
  Building2,
  TreePine,
  Droplets,
  Coffee,
  Heart,
  PenLine,
} from "lucide-react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Scrollytelling from "@/components/content/Scrollytelling";
import FadeIn from "@/components/animations/FadeIn";

/* -------------------------------------------------------------------------- */
/*  Scrollytelling chapters — based on real biographical research              */
/* -------------------------------------------------------------------------- */

const chapters = [
  {
    id: "andes",
    label: "Capítulo 1 — Los orígenes",
    year: "1969",
    title: "Nací en Andes",
    text: "Nací el 6 de noviembre de 1969 en Andes, en el corazón del Suroeste antioqueño. Tierra cafetera, de gente trabajadora y de montañas verdes que se pierden entre las nubes. Ahí aprendí lo primero que sé de la vida: que el trabajo honesto y la comunidad lo son todo.",
    image: "/images/hero-montanas-panoramico.jpg",
    quote: "El Suroeste me enseñó que las cosas se construyen con las manos y con la palabra.",
  },
  {
    id: "bancafe",
    label: "Capítulo 2 — Primeros pasos",
    year: "1988",
    title: "Empecé vendiendo café",
    text: "A los 19 años entré a Bancafé como asesor comercial. Recorrí fincas, cooperativas y pueblos del Suroeste. Ahí entendí de primera mano lo que necesita el campo colombiano: caminos, crédito y alguien que escuche. Después fui gerente de la sucursal en Jardín y luego monté mi propia empresa.",
    image: "/images/gallon-vias-seguridad.jpg",
  },
  {
    id: "derrota",
    label: "Capítulo 3 — La derrota que me formó",
    year: "2003",
    title: "Perdí por 672 votos",
    text: "En 2003 me lancé a la Alcaldía de Andes. Perdí por 672 votos — 6.051 contra 6.723. Fue un golpe duro. Pero esa derrota me enseñó algo que no se aprende ganando: humildad, paciencia y la certeza de que el camino no se recorre con prisa, sino con convicción.",
    image: "/images/gallon-entrevista-medellin.jpg",
    stat: { value: 672, suffix: "", label: "votos de diferencia" },
    quote: "De las derrotas se aprende más que de las victorias. Eso lo sé por experiencia.",
  },
  {
    id: "alcalde",
    label: "Capítulo 4 — El regreso",
    year: "2008",
    title: "Volví con todo",
    text: "Cuatro años después, Andes me dio su confianza con 9.984 votos — el 60,82% — la mayor votación en la historia del municipio. Como alcalde lideré un gobierno cercano, enfocado en obras, educación y desarrollo rural. Aprendí que gobernar es escuchar antes de decidir.",
    image: "/images/gallon-discurso.jpg",
    stat: { value: 9984, suffix: "", label: "votos — récord histórico de Andes" },
  },
  {
    id: "congreso",
    label: "Capítulo 5 — El Congreso",
    year: "2014",
    title: "Llegué al Congreso por Antioquia",
    text: "En 2014 Antioquia me eligió Representante a la Cámara. Fui vicepresidente de la Comisión de Presupuesto y presidí la Comisión de Descentralización. Pero mi mayor orgullo fue la Ley 1883 de 2018: convertir a Turbo en Distrito Especial — el primero de Antioquia y el sexto de Colombia. Un hito para Urabá.",
    image: "/images/gallon-caminando-obra.jpg",
    quote: "Turbo merece ser la puerta de Colombia al mundo. Con esa ley abrimos ese camino.",
  },
  {
    id: "reinvencion",
    label: "Capítulo 6 — Reinventarme",
    year: "2019",
    title: "Me reinventé en el campo",
    text: "Después del Congreso dirigí la Unidad Territorial Antioquia–Chocó de la Agencia de Desarrollo Rural. Volví al campo, a las comunidades, a lo esencial. Llevé la política agropecuaria directamente a las veredas. Fueron años de reencontrarme con la razón de todo: servir.",
    image: "/images/gallon-conversacion-rural.jpg",
  },
  {
    id: "infraestructura",
    label: "Capítulo 7 — La gran obra",
    year: "2024",
    title: "La mayor inversión vial de la historia",
    text: "Hoy como Secretario de Infraestructura de Antioquia tengo la responsabilidad más grande de mi vida: liderar inversiones por más de $45 billones. El Túnel del Toyo al 98% — el más largo de Latinoamérica. La segunda calzada del Túnel de Oriente. El Tren Multipropósito con 190 km y 19 estaciones. Más de 1.040 km de vías y placa huella en 100+ municipios.",
    image: "/images/gallon-tunel-mar.jpg",
    stat: { value: 1040, suffix: "+", label: "km de vías pavimentadas" },
    quote: "Antioquia no se construyó con miedo.",
  },
  {
    id: "futuro",
    label: "Capítulo 8 — El camino sigue",
    year: "Hoy",
    title: "El camino sigue",
    text: "Más de 35 años de camino me respaldan. Conozco a Antioquia, la he recorrido, y la sigo construyendo. Cada vereda que visito, cada puente que inauguramos, cada familia que se conecta con el mundo me confirma lo mismo: este departamento tiene todo para ser el mejor del país. Y yo voy a seguir caminándolo.",
    image: "/images/hero-gallon-montanas.jpg",
    quote: "Yo creo que Antioquia se construye escuchando, recorriendo y aprendiendo de su gente.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Roles                                                                      */
/* -------------------------------------------------------------------------- */

const roles = [
  { icon: Building2, title: "Miembro de la Junta Directiva del Metro de Medellín" },
  { icon: TreePine, title: "Miembro del Consejo Directivo de Corantioquia" },
  { icon: Droplets, title: "Miembro del Consejo Directivo del Plan Departamental de Aguas" },
  { icon: Coffee, title: "Delegado de la Cooperativa de Caficultores de Andes" },
  { icon: Heart, title: "Presidente de la Junta Directiva del Centro de Bienestar del Anciano, Jardín" },
  { icon: PenLine, title: "Columnista en Al Poniente — 20+ columnas publicadas" },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function SobreContent() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Luis Horacio Gallón Arango",
            jobTitle: "Secretario de Infraestructura Física de Antioquia",
            birthDate: "1969-11-06",
            birthPlace: { "@type": "Place", name: "Andes, Antioquia, Colombia" },
            alumniOf: [
              { "@type": "CollegeOrUniversity", name: "Universidad Cooperativa de Colombia" },
              { "@type": "CollegeOrUniversity", name: "Universidad de Medellín" },
            ],
            sameAs: ["https://twitter.com/GallonHoracio", "https://instagram.com/gallonantioquia"],
          }),
        }}
      />

      {/* ================================================================== */}
      {/* 1. Hero                                                             */}
      {/* ================================================================== */}
      <section className="relative bg-[#0B3B24] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/gallon-retrato-obra-hd.jpg"
            alt="Horacio Gallón"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B24] via-[#0B3B24]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-24 md:py-32">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-6">
              Mi historia
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] tracking-tight text-white max-w-3xl mb-6">
              El camino que<br />
              <span className="italic text-dorado-tierra">me trajo</span><br />
              hasta aquí.
            </h1>
            <p className="font-body text-white/60 text-lg max-w-xl leading-relaxed">
              Nací en Andes. Llevo más de treinta años caminando este departamento.
              Esta es mi historia — contada en primera persona, como debe ser.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. Scrollytelling — 8 capítulos                                     */}
      {/* ================================================================== */}
      <Scrollytelling chapters={chapters} />

      {/* ================================================================== */}
      {/* 3. Personal — Más allá del cargo                                    */}
      {/* ================================================================== */}
      <section className="py-20 md:py-28 bg-dorado-claro/20 border-t border-borde/50">
        <div className="max-w-4xl mx-auto px-6 md:px-16">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="overflow-hidden">
                <img
                  src="/images/gallon-pareja-futbol.jpg"
                  alt="Horacio Gallón con su esposa"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div>
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-3">
                  La persona
                </p>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[0.95] tracking-tight mb-4">
                  Más allá del cargo
                </h3>
                <p className="font-body text-texto-secundario leading-relaxed">
                  Soy hincha del fútbol, hijo de Andes, esposo, padre de Carlos Andrés y Juan Esteban,
                  y abuelo. Cuando no estoy recorriendo las vías del departamento, estoy con mi familia,
                  con mi café y con mis montañas. Al final del día, todo lo que hago es para que la gente
                  de Antioquia viva mejor.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. Otros roles                                                      */}
      {/* ================================================================== */}
      <section className="py-20 md:py-28 border-t border-borde/50">
        <div className="max-w-5xl mx-auto px-6 md:px-16">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-3">
              Otros roles
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] tracking-tight mb-12">
              También sirvo en
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-borde/50">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <FadeIn key={role.title} delay={index * 80}>
                  <div className="flex items-start gap-4 py-6 px-4 border-b border-r border-borde/50">
                    <Icon className="w-5 h-5 text-dorado-tierra shrink-0 mt-0.5" />
                    <p className="font-heading text-sm text-texto-principal leading-snug">
                      {role.title}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
