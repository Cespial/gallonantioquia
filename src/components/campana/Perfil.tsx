import Image from "next/image";
import Link from "next/link";
import { Award, Check, FileText, Newspaper, Star } from "lucide-react";

/**
 * Los cuatro pilares venían con «Lorem ipsum» en el mockup. Estos textos son
 * borradores sobrios, sin cifras ni cargos que no se puedan sustentar; el
 * equipo los ajusta desde el panel.
 */
const PILARES = [
  {
    icono: Star,
    titulo: "Experiencia",
    texto: "Años de servicio público y gestión en el territorio antioqueño.",
    destino: "/quien-es-gallon",
  },
  {
    icono: Award,
    titulo: "Logros",
    texto: "Obras que conectan a las subregiones con el resto del departamento.",
    destino: "/proyectos",
  },
  {
    icono: FileText,
    titulo: "Propuestas",
    texto: "Seis ejes de trabajo construidos escuchando a las comunidades.",
    destino: "/plan-de-gobierno",
  },
  {
    icono: Newspaper,
    titulo: "Medios",
    texto: "Columnas y publicaciones sobre el futuro de Antioquia.",
    destino: "/columnas",
  },
];

const NOTAS = [
  "Nací en Andes, en el suroeste antioqueño.",
  "Hago parte de una familia donde la disciplina, el valor de la palabra y el compromiso de comunidad no se negocian.",
];

export default function Perfil({ frase }: { frase: string }) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr_0.9fr] lg:gap-10 lg:px-10">
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <Image
            src="/images/campana/gallon-familia.webp"
            alt="Horacio Gallón junto a su familia"
            width={900}
            height={788}
            sizes="(max-width: 1024px) 90vw, 30vw"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="lg:border-r lg:border-neutral-200 lg:pr-12">
          <p className="font-campana text-2xl font-semibold uppercase leading-none text-campana-hoja lg:text-[1.7rem]">
            Soy
          </p>
          <h2 className="font-campana text-4xl font-extrabold uppercase leading-[0.9] text-campana-bosque lg:text-[3.4rem]">
            Horacio
            <br />
            Gallón
          </h2>

          <blockquote className="mt-5 border-l-4 border-campana-dorado pl-4 font-campana text-[15px] leading-relaxed text-neutral-700">
            {frase}
          </blockquote>

          <ul className="mt-5 space-y-2.5">
            {NOTAS.map((nota) => (
              <li key={nota} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-campana-hoja"
                >
                  <Check className="h-3 w-3 text-campana-hoja" strokeWidth={3} />
                </span>
                <span className="font-campana text-[15px] leading-snug text-neutral-700">
                  {nota}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/quien-es-gallon"
            className="mt-6 inline-block rounded-full bg-campana-bosque px-6 py-3 font-campana text-[12px] font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
          >
            Conoce más sobre Gallón
          </Link>
        </div>

        <ul className="space-y-5">
          {PILARES.map(({ icono: Icono, titulo, texto, destino }) => (
            <li key={titulo}>
              <Link href={destino} className="group flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-campana-bosque transition-colors group-hover:bg-campana-hoja"
                >
                  <Icono className="h-5 w-5 text-white" />
                </span>
                <span>
                  <span className="block font-campana text-lg font-bold text-campana-bosque">
                    {titulo}
                  </span>
                  <span className="block font-campana text-sm leading-snug text-neutral-600">
                    {texto}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
