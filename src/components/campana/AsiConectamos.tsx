import Image from "next/image";
import Vineta from "./Vineta";

const SIGNIFICA = [
  "Más cercanía a los municipios a las vías 4G que los llevan a los puertos y aeropuertos internacionales",
  "Más oportunidades para vender productos",
  "Más desarrollo para Antioquia",
  "Menores costos de transporte",
  "Menos tiempo de viaje",
  "Más turismo",
];

const RECUPERADAS = [
  "Intercambio vial del Aeropuerto José María Córdova",
  "Segunda etapa del Túnel de Oriente",
  "Avances de la Nueva Vía al Mar",
];

/**
 * El mockup parte la pantalla en dos mitades exactas y pega el contenido a los
 * bordes. Copiar eso al pie de la letra deja el texto colgando del filo en un
 * monitor ancho, así que la canaleta exterior crece cuando la ventana supera
 * los 1500 px y se queda en 1,25 rem —lo que mide en el mockup— por debajo.
 */
const CANAL_IZQ = "lg:pl-[max(1.25rem,calc((100vw-1500px)/2))]";
const CANAL_DER = "lg:pr-[max(1.25rem,calc((100vw-1500px)/2))]";

export default function AsiConectamos() {
  return (
    <section
      id="a-paso-firme"
      aria-labelledby="conectamos-titulo"
      className="bg-campana-hueso lg:grid lg:grid-cols-2 lg:items-stretch"
    >
      {/* Columna clara: titular, cita y la cifra de las vías. */}
      <div className={`px-5 py-12 lg:py-10 lg:pr-12 ${CANAL_IZQ}`}>
        <div className="relative mx-auto max-w-[46rem] lg:ml-auto lg:mr-0">
          <h2
            id="conectamos-titulo"
            className="relative z-10 font-campana uppercase leading-[0.92]"
          >
            <span className="block text-[2.1rem] font-normal tracking-[0.01em] text-campana-hoja sm:text-[2.6rem] lg:text-[3rem]">
              Así
            </span>
            <span className="block text-[2.1rem] font-normal tracking-[0.01em] text-campana-hoja sm:text-[2.6rem] lg:text-[3rem]">
              Conectamos
            </span>
            <span className="block text-[2.9rem] font-extrabold text-campana-tinta sm:text-[3.6rem] lg:text-[4.3rem]">
              Antioquia
            </span>
          </h2>

          {/* La mata de café se monta sobre la cola del titular: de ahí el
              z-index del h2 y el z-0 de aquí. */}
          <Image
            src="/images/campana/ilustracion-mata-cafe.webp"
            alt=""
            aria-hidden="true"
            width={900}
            height={900}
            sizes="(max-width: 1024px) 40vw, 260px"
            className="pointer-events-none absolute right-0 top-2 z-0 w-32 sm:w-40 lg:top-4 lg:w-56"
          />

          <p className="relative z-10 mt-6 border-l-[3px] border-campana-dorado pl-4 font-campana text-lg leading-snug text-campana-dorado sm:text-xl lg:text-[1.5rem]">
            Las <strong className="font-bold">mejores cosechas</strong> nacen
            <br className="hidden sm:block" /> cuando se{" "}
            <strong className="font-bold">trabaja en equipo</strong>.
          </p>

          <p className="relative z-10 mt-7 max-w-[34rem] font-campana text-[0.95rem] leading-relaxed text-neutral-700 lg:text-[1.05rem]">
            Dejamos contratados, en ejecución o en proceso de contratación cerca
            de 1.400 kilómetros de vías pavimentadas, lo que permitirá que
            Antioquia pase de tener el 45% al 73% de su red vial pavimentada
            antes de finalizar 2028.
          </p>
        </div>
      </div>

      {/* Columna oscura: lo que eso significa y las obras recuperadas. */}
      <div className="bg-campana-bosque py-12 lg:py-10">
        <h3
          className={`px-5 font-campana text-lg font-bold italic text-campana-hoja sm:text-xl lg:pl-12 lg:text-right lg:text-[1.6rem] ${CANAL_DER}`}
        >
          Esto significa para los antioqueños:
        </h3>

        {/* El panel se sale por el borde derecho de la pantalla: solo se
            redondea del lado que se ve. */}
        <div className="ml-5 mt-4 rounded-l-[2rem] bg-campana-hoja py-7 pl-6 pr-5 sm:ml-10 lg:ml-16 lg:rounded-l-[3rem] lg:py-4 lg:pl-14">
          <ul
            className={`space-y-3 font-campana text-[0.95rem] font-medium italic leading-snug text-white lg:space-y-2.5 lg:pl-6 lg:text-base ${CANAL_DER}`}
          >
            {SIGNIFICA.map((texto) => (
              <Vineta key={texto} tono="dorado" lado="derecha">
                {texto}
              </Vineta>
            ))}
          </ul>
        </div>

        <div className={`px-5 lg:pl-12 lg:text-right ${CANAL_DER}`}>
          <h3 className="mt-7 font-campana text-xl font-bold text-campana-dorado sm:text-2xl lg:text-[1.9rem]">
            Logramos que las obras se hicieran.
          </h3>
          <p className="mt-2 font-campana text-base font-bold leading-snug text-campana-hoja sm:text-lg lg:text-[1.35rem]">
            Recuperamos proyectos que estaban detenidos
            <br className="hidden lg:block" /> y que llevaban años enfrentando
            dificultades.
          </p>

          <ul className="mt-5 space-y-2.5 font-campana text-[0.95rem] text-white lg:text-[1.05rem]">
            {RECUPERADAS.map((texto) => (
              <Vineta key={texto} tono="dorado" lado="derecha">
                {texto}
              </Vineta>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
