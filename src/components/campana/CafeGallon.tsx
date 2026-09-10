import Image from "next/image";
import PortadaSeccion from "./PortadaSeccion";
import { resaltar } from "./resaltar";
import type { PortadaCafe } from "@/lib/ajustes/portada";

/**
 * La segunda foto va recortada en vertical: el centro geométrico deja a
 * Gallón contra el filo, y el 60% lo trae al medio del cuadro. No hay dónde
 * guardar ese encuadre en el ajuste —es geometría del layout, no del
 * contenido—, así que se queda fijo aquí, por índice.
 */
const ENCUADRES: (string | undefined)[] = [undefined, "object-[60%_center]"];

export default function CafeGallon({ datos }: { datos: PortadaCafe }) {
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
            {datos.parrafos.map((parrafo, i) => (
              <p key={i}>{resaltar(parrafo)}</p>
            ))}
          </div>
        </div>

        {/* Un par desparejo, no dos casillas de una tabla: la apaisada manda y
            la vertical entra desfasada. Las proporciones van fijas porque
            apiladas a su tamaño natural el par medía el triple que el texto y
            dejaba media franja en blanco. */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-5">
          {datos.fotos.map((foto, i) => (
            <li
              key={foto.url}
              className={`overflow-hidden rounded-2xl shadow-[0_0.75rem_2rem_rgba(28,50,30,0.14)] ${
                i === 0
                  ? "aspect-[4/3] sm:col-span-3"
                  : "aspect-[4/3] sm:col-span-2 sm:mt-10 sm:aspect-[3/4]"
              }`}
            >
              <Image
                src={foto.url}
                alt={foto.alt}
                width={foto.ancho ?? (i === 0 ? 1920 : 1280)}
                height={foto.alto ?? (i === 0 ? 1440 : 1176)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                className={`h-full w-full object-cover ${ENCUADRES[i] ?? ""}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
