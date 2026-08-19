import Image from "next/image";

/**
 * Las seis obras, en la rejilla asimétrica del mockup: dos filas de tres, con
 * anchos distintos en cada fila y la segunda algo más alta que la primera.
 */
const OBRAS = [
  {
    src: "/images/campana/obra-placa-huella.webp",
    alt: "Placa huella recién construida en una vía terciaria antioqueña",
    clase: "lg:col-span-12",
  },
  {
    src: "/images/campana/obra-cordillera.webp",
    alt: "Vista aérea de la cordillera antioqueña atravesada por una vía",
    clase: "lg:col-span-25",
  },
  {
    src: "/images/campana/obra-metro.webp",
    alt: "Imagen de referencia del tren del Río, creada con inteligencia artificial",
    clase: "lg:col-span-12",
  },
  {
    src: "/images/campana/obra-viaducto.webp",
    alt: "Vista aérea de una doble calzada entre montañas verdes",
    clase: "lg:col-span-18 lg:row-start-2",
  },
  {
    src: "/images/campana/obra-puerto.webp",
    alt: "Grúas pórtico de un puerto marítimo en la costa antioqueña",
    clase: "lg:col-span-23 lg:row-start-2",
  },
  {
    src: "/images/campana/obra-tunel.webp",
    alt: "Cuadrilla de obreros trabajando en el frente de excavación de un túnel",
    clase: "lg:col-span-8 lg:row-start-2",
  },
];

export default function MosaicoObras() {
  return (
    <section aria-label="Obras de infraestructura en Antioquia" className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8 lg:py-12">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-[repeat(49,minmax(0,1fr))] lg:grid-rows-[14rem_18rem] lg:gap-4">
          {OBRAS.map((obra) => (
            <li key={obra.src} className={`relative h-40 lg:h-auto ${obra.clase}`}>
              <Image
                src={obra.src}
                alt={obra.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="rounded-sm object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
