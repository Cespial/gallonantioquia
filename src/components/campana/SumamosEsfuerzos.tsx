import Image from "next/image";
import Vineta from "./Vineta";

const OBRAS_ESTRATEGICAS = [
  "Pavimentación de más de 1.400 kilómetros de vías secundarias.",
  "Construcción de placas huella en más de 100 municipios.",
  "Extensión del Metro hacia el Aburrá Norte.",
  "Segunda etapa del Túnel de Oriente.",
  "Nueva Vía al Mar - Túnel del Toyo.",
];

const EMERGENCIAS = [
  "Atención de derrumbes",
  "Recuperación de vías",
  "Maquinaria amarilla",
  "Mantenimiento",
  "Puntos críticos",
  "Estabilización",
  "Puentes",
];

export default function SumamosEsfuerzos() {
  return (
    <section
      id="por-antioquia"
      aria-labelledby="sumamos-titulo"
      className="relative isolate overflow-hidden bg-campana-nata"
    >
      {/* El retrato ocupa el flanco derecho y se funde con el fondo por su
          propio canal alfa. En móvil pasa a ser una franja superior. */}
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[58%]">
        <Image
          src="/images/campana/gallon-senala.webp"
          alt="Horacio Gallón señala el valle de Aburrá desde un mirador"
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-[60%_center] lg:object-[left_bottom]"
        />
        {/* Un velo que abre sitio al texto cuando la columna se estrecha. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-campana-nata via-campana-nata/25 to-transparent lg:w-1/3"
        />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-8">
        <div className="max-w-[36rem]">
          <h2
            id="sumamos-titulo"
            className="font-campana text-[1.7rem] font-extrabold leading-tight text-campana-tinta sm:text-[2.1rem] lg:text-[1.95rem] lg:leading-[1.15]"
          >
            Sumamos esfuerzos, articulamos voluntades y lideramos con propósito.
          </h2>

          <p className="mt-5 font-campana text-base font-bold leading-snug text-campana-hoja sm:text-lg lg:text-[1.25rem]">
            Defendimos las grandes obras estratégicas e impulsamos el desarrollo
            de las vías terciarias.
          </p>

          <ul className="mt-4 space-y-2 font-campana text-[0.95rem] text-neutral-800 lg:text-base">
            {OBRAS_ESTRATEGICAS.map((texto) => (
              <Vineta key={texto} tono="dorado">
                {texto}
              </Vineta>
            ))}
          </ul>

          <hr className="my-6 border-t border-campana-hoja/70" />

          <h2 className="font-campana text-[1.7rem] font-extrabold leading-tight text-campana-tinta sm:text-[2.1rem] lg:text-[1.95rem] lg:leading-[1.15]">
            Respondimos a los llamados para buscar soluciones.
          </h2>

          <p className="mt-4 font-campana text-base font-bold leading-snug text-campana-hoja sm:text-lg lg:text-[1.25rem]">
            Acompañamos la gestión de las necesidades y emergencias de las vías.
          </p>

          {/* Multicolumna, no rejilla: el mockup llena la primera columna antes
              de pasar a la segunda, y `grid-cols-2` los repartiría por filas. */}
          {/* Margen por ítem, no `space-y`: `space-y` cuelga del segundo hijo en
              adelante y desalinearía la cabeza de la segunda columna. */}
          <ul className="mt-5 font-campana text-[0.95rem] text-neutral-800 [&>li]:mb-2 sm:columns-2 sm:gap-x-10 lg:text-base">
            {EMERGENCIAS.map((texto) => (
              <Vineta key={texto} tono="dorado" className="break-inside-avoid">
                {texto}
              </Vineta>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
