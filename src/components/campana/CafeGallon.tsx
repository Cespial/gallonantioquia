import Image from "next/image";
import PortadaSeccion from "./PortadaSeccion";

type Foto = {
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  /** Clase de `object-position`, cuando el recorte se lleva al protagonista. */
  encuadre?: string;
};

/** Dos fotos reales de recorrido, no ilustraciones: el café de esta sección es
 *  el de sentarse a conversar, y eso se muestra con gente, no con granos. */
const FOTOS: Foto[] = [
  {
    src: "/images/gallon-parque-pueblo.jpg",
    alt: "Horacio Gallón conversa alrededor de una mesa con tazas de café, en el parque principal de un municipio antioqueño",
    ancho: 1920,
    alto: 1440,
  },
  {
    src: "/images/gallon-conversacion-rural.jpg",
    alt: "Horacio Gallón habla con un grupo de personas durante un recorrido por una vereda de Antioquia",
    ancho: 1280,
    alto: 1176,
    /** Recortada en vertical, el centro geométrico deja a Gallón contra el
     *  filo; el 60% lo trae al medio del cuadro. */
    encuadre: "object-[60%_center]",
  },
];

export default function CafeGallon() {
  return (
    <section
      id="cafe-gallon"
      aria-labelledby="cafe-gallon-titulo"
      className="bg-campana-crema"
    >
      <PortadaSeccion
        id="cafe-gallon-titulo"
        src="/images/campana/portada-cafe.webp"
        titulo="Café Gallón Antioquia"
      />

      <div className="mx-auto grid w-[min(83.125rem,100%_-_2.5rem)] gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-14">
        <div>
          <p className="titular-sin-balance font-campana text-2xl leading-[1.15] text-campana-dorado sm:text-3xl lg:text-[2.35rem]">
            Un símbolo en el que <strong className="font-bold">cabemos todos</strong>.
          </p>

          <div className="mt-6 space-y-5 font-campana text-[0.95rem] leading-[1.6] text-neutral-700 lg:mt-7 lg:text-[1rem]">
            <p>
              Café Gallón es, antes que un café, un símbolo de Antioquia. Y dentro de
              esa taza cabe cualquier café del departamento.
            </p>
            <p>
              Todos los cafés antioqueños son buenos y ninguno sabe igual. Cambian con el
              territorio, con el clima, con la altura a la que crece la mata: son esas
              variables las que hacen un buen café. Un café tan diverso como Antioquia, y
              por eso la representa.
            </p>
            <p>
              Y además el café es una excusa. Una taza abre una conversación, y de una
              conversación salen las ideas que después se vuelven proyectos. Así hemos
              recorrido el departamento:{" "}
              <strong className="font-semibold text-campana-tinta">
                sentándonos a hablar con quien vive cada municipio
              </strong>
              .
            </p>
          </div>
        </div>

        {/* Un par desparejo, no dos casillas de una tabla: la apaisada manda y
            la vertical entra desfasada. Las proporciones van fijas porque
            apiladas a su tamaño natural el par medía el triple que el texto y
            dejaba media franja en blanco. */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-5">
          {FOTOS.map((foto, i) => (
            <li
              key={foto.src}
              className={`overflow-hidden rounded-2xl shadow-[0_0.75rem_2rem_rgba(28,50,30,0.14)] ${
                i === 0
                  ? "aspect-[4/3] sm:col-span-3"
                  : "aspect-[4/3] sm:col-span-2 sm:mt-10 sm:aspect-[3/4]"
              }`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                width={foto.ancho}
                height={foto.alto}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                className={`h-full w-full object-cover ${foto.encuadre ?? ""}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
