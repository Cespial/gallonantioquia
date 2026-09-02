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
      {/* Escala y posición medidas por correlación contra el mockup: a 1440 px
          la foto va a 1232 px de ancho, arranca en el 25% y sube 292 px por
          encima del borde de la sección, que la recorta. */}
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full lg:w-full">
        <div className="relative h-full w-full lg:hidden">
          <Image
            src="/images/campana/gallon-senala.webp"
            alt="Horacio Gallón señala el valle de Aburrá desde un mirador"
            fill
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-campana-nata via-campana-nata/25 to-transparent"
          />
        </div>
        {/* Anclada a la caja de 1440 px del mockup, no al viewport: de otro
            modo, en pantallas anchas la figura se corre hacia el centro. */}
        {/* El recorte se desvanece por arriba y por la izquierda en su propio
            canal alfa, pero por abajo y por la derecha termina en corte recto
            (alfa medio 198 y 184 sobre 255). Ahí no llega a salirse de la
            sección —le sobran 135 px por abajo a 1280, y por la derecha se
            despega del borde en cuanto la ventana pasa de la caja de 90rem—,
            así que sin máscara la foto se lee como un rectángulo pegado sobre
            la crema. Las dos rampas apagan esos dos filos antes de que
            asomen. */}
        <div className="absolute inset-0 mx-auto hidden max-w-[90rem] lg:block">
          <Image
            src="/images/campana/gallon-senala.webp"
            alt="Horacio Gallón señala el valle de Aburrá desde un mirador"
            width={1400}
            height={1232}
            sizes="1232px"
            className="absolute -top-[30.75rem] left-[20.8%] w-[77rem] max-w-none [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,#000_72%,transparent_97%),linear-gradient(to_right,#000_78%,transparent_98%)]"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 py-12 lg:px-[3.1rem] lg:py-8">
        <div className="max-w-[40rem]">
          <h2
            id="sumamos-titulo"
            className="titular-sin-balance font-campana text-[1.7rem] font-extrabold leading-tight text-campana-tinta sm:text-[2.1rem] lg:text-[1.9rem] lg:leading-[1.15]"
          >
            Sumamos esfuerzos, articulamos<br className="hidden lg:inline" />{" "}
            voluntades y lideramos<br className="hidden lg:inline" /> con propósito.
          </h2>

          <p className="mt-5 font-campana text-base font-bold leading-snug text-campana-hoja sm:text-lg lg:text-[1.25rem]">
            Defendimos las grandes obras estratégicas<br className="hidden lg:inline" />{" "}
            e impulsamos el desarrollo de las vías terciarias.
          </p>

          <ul className="mt-4 space-y-2 font-campana text-[0.95rem] text-neutral-800 lg:text-base">
            {OBRAS_ESTRATEGICAS.map((texto) => (
              <Vineta key={texto} tono="dorado">
                {texto}
              </Vineta>
            ))}
          </ul>

          <hr className="my-6 border-t border-campana-hoja/70" />

          <h2 className="titular-sin-balance font-campana text-[1.7rem] font-extrabold leading-tight text-campana-tinta sm:text-[2.1rem] lg:text-[1.9rem] lg:leading-[1.15]">
            Respondimos a los llamados para<br className="hidden lg:inline" />{" "}
            buscar soluciones.
          </h2>

          <p className="mt-4 font-campana text-base font-bold leading-snug text-campana-hoja sm:text-lg lg:text-[1.25rem]">
            Acompañamos la gestión de las necesidades<br className="hidden lg:inline" />{" "}
            y emergencias de las vías.
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
