import Image from "next/image";

/**
 * La fotografía de cierre, a sangre. Trae su propio degradado en el canal alfa:
 * se funde con el blanco de arriba y con el verde de la franja de cifras, así
 * que no lleva velos encima.
 */
export default function FotoEquipo() {
  return (
    <div className="relative h-56 w-full bg-white sm:h-72 lg:h-[31.5rem]">
      <Image
        src="/images/campana/equipo-cafe.webp"
        alt="Horacio Gallón acompañado de cuatro dirigentes antioqueños, tomando café en una finca"
        fill
        sizes="100vw"
        className="object-cover object-top"
      />
    </div>
  );
}
