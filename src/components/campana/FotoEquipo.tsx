import Image from "next/image";

/**
 * La fotografía de cierre, a sangre.
 *
 * La imagen trae su propio degradado en el canal alfa: se desvanece por arriba
 * y por abajo. Por eso el fondo del bloque no es un color plano sino un
 * degradado que arranca en blanco —el de la sección anterior— y termina en el
 * verde profundo de la franja de cifras: así el desvanecido inferior funde con
 * la franja siguiente en vez de cortarse contra un blanco.
 *
 * El alto sale de medir el mockup: la foto se muestra a escala completa y se
 * recorta arriba y abajo, no se encoge. Con un alto menor, las tazas de café
 * quedan fuera de cuadro.
 */
export default function FotoEquipo() {
  return (
    <div className="relative h-56 w-full bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_74%,#1c321e_100%)] sm:h-72 lg:h-[37.5rem]">
      <Image
        src="/images/campana/equipo-cafe.webp"
        alt="Horacio Gallón acompañado de cuatro dirigentes antioqueños, tomando café en una finca"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
