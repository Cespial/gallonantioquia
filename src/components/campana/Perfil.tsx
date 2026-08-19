import Image from "next/image";
import Vineta from "./Vineta";
import { resaltar } from "./resaltar";

/** Los tres primeros van sobre la crema; los tres últimos, sobre el verde. */
const SEMBLANZA_CLARA = [
  "Nací en Andes, en el Suroeste antioqueño.",
  "Hago parte de una familia donde la disciplina, el valor de la palabra y el compromiso con la comunidad no se negocian.",
  "Me formé como Administrador de Empresas y especialista en Contratación Estatal. Soy experto en Formulación, Elaboración y Evaluación de Proyectos.",
];

const SEMBLANZA_VERDE = [
  "Llevo más de 30 años dedicado al servicio público y privado. Me he desempeñado, entre otros roles, como concejal, alcalde, representante a la Cámara, director de la Agencia de Desarrollo Rural y secretario de Infraestructura de Antioquia.",
  "Fui asesor comercial y gerente de Bancafé; emprendedor; gerente de Asesorías y Arrendamientos G. A.; miembro de Consejo directivo del Plan Departamental de Aguas y de Corantioquia; presidente de la Junta Directiva del Centro de Bienestar del Anciano, Jardín – Antioquia, y presidente de la Asociación de Usuarios de Televisión por Cable de Andes.",
  "He trabajado para impulsar proyectos que mejoren la movilidad, conecten los municipios, fortalezcan la competitividad y generen oportunidades para las familias antioqueñas.",
];

export default function Perfil({ frase }: { frase: string }) {
  return (
    <section
      id="soy-gallon"
      aria-labelledby="soy-gallon-titulo"
      className="relative isolate overflow-hidden bg-campana-crema"
    >
      {/* El retrato cruza el corte crema/verde y se sale por el flanco
          izquierdo. En móvil deja de flotar y encabeza la sección. */}
      <div className="relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:h-full lg:w-1/2">
        <Image
          src="/images/campana/gallon-abrazo.webp"
          alt="Horacio Gallón abraza a una mujer mayor durante un recorrido por Antioquia"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-[30%_center] lg:object-[58%_center]"
        />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 lg:px-8">
        <div className="lg:grid lg:grid-cols-2">
          <div aria-hidden="true" className="hidden lg:block" />
          <div className="pb-8 pt-10 lg:pb-5 lg:pt-9">
            {/* El titular y la frase dorada se leen como un bloque, pero son
                dos cosas: metiendo la frase dentro del h2, el nombre accesible
                del encabezado se volvía un párrafo entero. */}
            <div className="relative z-10 flex flex-wrap items-end gap-x-5 gap-y-2">
              <h2
                id="soy-gallon-titulo"
                className="[text-wrap:normal] font-campana uppercase leading-[0.95]"
              >
                <span className="block text-2xl font-medium tracking-[0.01em] text-campana-hoja sm:text-[1.75rem] lg:text-[2rem]">
                  Soy Horacio
                </span>
                <span className="mt-1 block text-5xl font-extrabold text-campana-tinta sm:text-6xl lg:text-[4.6rem]">
                  Gallón
                </span>
              </h2>
              <p className="border-campana-hoja font-campana text-base leading-tight text-campana-dorado sm:text-lg lg:mb-3 lg:max-w-[23rem] lg:border-l-[3px] lg:pl-5 lg:text-[1.3rem]">
                {resaltar(frase)}
              </p>
            </div>

            <ul className="mt-8 space-y-5 font-campana text-[0.95rem] leading-[1.5] text-neutral-700 lg:mt-9 lg:pr-6 lg:text-[0.9rem] lg:leading-[1.4]">
              {SEMBLANZA_CLARA.map((texto) => (
                <Vineta key={texto} tono="verde">
                  {texto}
                </Vineta>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* La ilustración de la semilla se apoya en la esquina, por encima del
          titular, tal como en el mockup. */}
      <Image
        src="/images/campana/ilustracion-semilla.webp"
        alt=""
        aria-hidden="true"
        width={647}
        height={647}
        sizes="200px"
        className="pointer-events-none absolute right-1 top-1 hidden w-[7.5rem] lg:block"
      />

      <div className="relative isolate overflow-hidden rounded-tr-[2.5rem] bg-campana-selva lg:rounded-tr-[3.5rem]">
        {/* La loma con la vía dorada que remata la esquina inferior derecha de
            la banda verde. Es parte del mockup, no un añadido. */}
        <Image
          src="/images/campana/adorno-colina.webp"
          alt=""
          aria-hidden="true"
          width={900}
          height={466}
          sizes="260px"
          className="pointer-events-none absolute bottom-0 right-0 -z-10 hidden w-[16.5rem] lg:block"
        />
        <div className="mx-auto max-w-[1500px] px-5 lg:px-8">
          <div className="lg:grid lg:grid-cols-2">
            <div aria-hidden="true" className="hidden lg:block" />
            <ul className="space-y-5 py-10 font-campana text-[0.95rem] leading-[1.5] text-white lg:py-6 lg:pr-6 lg:text-[0.9rem] lg:leading-[1.4]">
              {SEMBLANZA_VERDE.map((texto) => (
                <Vineta key={texto} tono="dorado">
                  {texto}
                </Vineta>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
