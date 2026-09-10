import Image from "next/image";
import Vineta from "./Vineta";
import { Lineas, FraseDorada } from "./texto";
import type { PortadaConectamos } from "@/lib/ajustes/portada";

/**
 * El mockup parte la pantalla en dos mitades exactas y pega el contenido a los
 * bordes. Copiar eso al pie de la letra deja el texto colgando del filo en un
 * monitor ancho, así que la canaleta exterior crece cuando la ventana supera
 * los 1500 px y se queda en 1,25 rem —lo que mide en el mockup— por debajo.
 */
const CANAL_IZQ = "lg:pl-[max(2.25rem,calc((100vw-90rem)/2))]";
const CANAL_DER = "lg:pr-[max(1.25rem,calc((100vw-90rem)/2))]";

export default function AsiConectamos({ datos }: { datos: PortadaConectamos }) {
  return (
    <section
      id="a-paso-firme"
      aria-labelledby="conectamos-titulo"
      className="bg-campana-hueso lg:grid lg:grid-cols-2 lg:items-stretch"
    >
      {/* Columna clara: titular, cita y la cifra de las vías. */}
      <div className={`px-5 py-12 lg:py-6 lg:pr-12 ${CANAL_IZQ}`}>
        <div className="relative mx-auto max-w-[46rem] lg:ml-auto lg:mr-0">
          <h2
            id="conectamos-titulo"
            className="relative z-10 titular-sin-balance font-campana uppercase leading-[0.92]"
          >
            <span className="block text-[1.9rem] font-normal tracking-[0.01em] text-campana-hoja sm:text-[2.6rem] lg:text-[3.4rem]">
              {datos.linea1}
            </span>
            <span className="block text-[1.9rem] font-normal tracking-[0.01em] text-campana-hoja sm:text-[2.6rem] lg:text-[3.4rem]">
              {datos.linea2}
            </span>
            <span className="block text-[2.5rem] font-extrabold text-campana-tinta sm:text-[3.6rem] lg:text-[5.6rem]">
              {datos.linea3}
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
            className="pointer-events-none absolute right-0 top-0 z-0 w-24 sm:w-40 lg:-right-4 lg:top-[8.3rem] lg:w-[9.7rem]"
          />

          <p className="relative z-10 mt-5 border-l-[3px] border-campana-dorado pl-4 font-campana text-lg leading-snug text-campana-dorado sm:text-xl lg:text-[1.5rem]">
            <FraseDorada texto={datos.frase} />
          </p>

          <p className="relative z-10 mt-6 max-w-[36rem] font-campana text-[0.95rem] leading-relaxed text-neutral-700 lg:text-[1.05rem]">
            {datos.parrafo}
          </p>
        </div>
      </div>

      {/* Columna oscura: lo que eso significa y las obras recuperadas. */}
      <div className="bg-campana-bosque py-12 lg:py-5">
        <h3
          className={`px-5 font-campana text-lg font-bold italic text-campana-hoja sm:text-xl lg:pl-12 lg:text-right lg:text-[1.6rem] ${CANAL_DER}`}
        >
          {datos.significaTitulo}
        </h3>

        {/* El panel se sale por el borde derecho de la pantalla: solo se
            redondea del lado que se ve. */}
        <div className="ml-5 mt-3 rounded-l-[2rem] bg-campana-hoja py-7 pl-6 pr-5 sm:ml-10 lg:ml-52 lg:rounded-l-[3rem] lg:py-[1.15rem] lg:pl-14">
          <ul
            className={`space-y-3 font-campana text-[0.95rem] font-medium italic leading-snug text-white lg:space-y-2 lg:text-[0.95rem] lg:leading-[1.35] ${CANAL_DER}`}
          >
            {datos.significa.map((texto, i) => (
              <Vineta key={i} tono="dorado" lado="derecha">
                {texto}
              </Vineta>
            ))}
          </ul>
        </div>

        <div className={`px-5 lg:pl-12 lg:text-right ${CANAL_DER}`}>
          <h3 className="mt-5 font-campana text-xl font-bold text-campana-dorado sm:text-2xl lg:text-[1.75rem]">
            {datos.logramosTitulo}
          </h3>
          <p className="mt-2 font-campana text-base font-bold leading-snug text-campana-hoja sm:text-lg lg:text-[1.25rem]">
            <Lineas texto={datos.logramosBajada} />
          </p>

          <ul className="mt-3 space-y-1.5 font-campana text-[0.95rem] text-white lg:text-base">
            {datos.recuperadas.map((texto, i) => (
              <Vineta key={i} tono="dorado" lado="derecha">
                {texto}
              </Vineta>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
