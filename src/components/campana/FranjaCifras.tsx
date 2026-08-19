import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/animations/CountUp";

type Cifra = { valor: number; sufijo: string; etiqueta: string };

/** Los dos pictogramas se recortaron del mockup: son trazo blanco, no iconos
 *  de librería, y la silueta de Antioquia no existe en ninguna. */
const ICONOS = [
  { src: "/images/campana/icono-antioquia.webp", ancho: 179, alto: 181 },
  { src: "/images/campana/icono-ciudadanos.webp", ancho: 174, alto: 154 },
];

export default function FranjaCifras({
  cifras,
  mensaje,
}: {
  cifras: Cifra[];
  mensaje: string;
}) {
  return (
    <section
      aria-label="La campaña en cifras"
      className="relative isolate overflow-hidden bg-campana-profundo"
    >
      <Image
        src="/images/campana/panorama-cordillera.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-campana-profundo/78" />

      <div className="relative mx-auto grid max-w-[1230px] items-center gap-9 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-0 lg:py-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-7 sm:gap-x-10 lg:flex-nowrap lg:gap-x-7">
          {cifras.slice(0, 2).map((cifra, i) => {
            const icono = ICONOS[i] ?? ICONOS[0];
            return (
              <li
                key={cifra.etiqueta}
                className="flex items-center gap-4 sm:gap-6 [&+li]:border-l [&+li]:border-white/30 [&+li]:pl-6 sm:[&+li]:pl-10"
              >
                <span
                  aria-hidden="true"
                  className="flex h-[4.2rem] w-[4.2rem] shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 lg:h-[6.9rem] lg:w-[7.5rem]"
                >
                  <Image
                    src={icono.src}
                    alt=""
                    width={icono.ancho}
                    height={icono.alto}
                    sizes="64px"
                    className="h-9 w-auto lg:h-[3.4rem]"
                  />
                </span>
                <span className="font-campana leading-none text-white">
                  <span className="block text-[2.6rem] font-extrabold tracking-tight lg:text-[3.2rem]">
                    {cifra.sufijo === "+" ? "+" : ""}
                    <CountUp end={cifra.valor} />
                  </span>
                  <span className="mt-2 block h-[2px] w-full max-w-[7rem] bg-campana-dorado" />
                  <span className="mt-2 block max-w-[7rem] text-[0.95rem] font-medium leading-tight text-white lg:text-base">
                    {cifra.etiqueta}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div>
          <p className="font-campana text-xl font-bold leading-snug text-white lg:max-w-[27rem] lg:text-[1.35rem]">
            {mensaje}
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-block rounded-full bg-campana-dorado-boton px-14 py-3 font-campana text-sm font-bold uppercase tracking-[0.04em] text-campana-profundo transition-transform hover:scale-[1.03] lg:text-base"
          >
            Súmate al equipo
          </Link>
        </div>
      </div>
    </section>
  );
}
