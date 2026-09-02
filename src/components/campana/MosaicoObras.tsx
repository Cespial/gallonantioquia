import Image from "next/image";

/**
 * Las seis obras, en la rejilla asimétrica del mockup: dos filas de tres, con
 * anchos distintos en cada fila y la segunda algo más alta que la primera.
 *
 * ⚠️ El reparto NO puede escribirse como `col-span-25`: Tailwind 3 solo trae
 * `col-span-1` … `col-span-12`, así que cualquier número mayor se descarta en
 * silencio, el elemento se queda en `grid-column: auto` y la foto colapsa a una
 * tira de una columna. La forma que sí genera CSS es el valor arbitrario de
 * `col`: `col-[span_25/span_25]`. Por eso van todas con la misma sintaxis,
 * aunque las de 8 y 12 también funcionarían con la utilidad corta.
 *
 * `vw` es el ancho que ocupa cada foto sobre la caja de 90rem, para que
 * `sizes` pida a Next el recorte del tamaño correcto y no uno de 40vw para
 * todas: la cordillera ocupa la mitad de la franja y el túnel, un sexto.
 */
const OBRAS = [
  {
    src: "/images/campana/obra-placa-huella.webp",
    alt: "Placa huella recién construida en una vía terciaria antioqueña",
    clase: "lg:col-[span_12/span_12]",
    vw: 25,
  },
  {
    src: "/images/campana/obra-cordillera.webp",
    alt: "Vista aérea de la cordillera antioqueña atravesada por una vía",
    clase: "lg:col-[span_25/span_25]",
    vw: 52,
  },
  {
    src: "/images/campana/obra-metro.webp",
    alt: "Imagen de referencia del tren del Río, creada con inteligencia artificial",
    clase: "lg:col-[span_12/span_12]",
    vw: 25,
  },
  {
    src: "/images/campana/obra-viaducto.webp",
    alt: "Vista aérea de una doble calzada entre montañas verdes",
    clase: "lg:col-[span_18/span_18] lg:row-start-2",
    vw: 37,
  },
  {
    src: "/images/campana/obra-puerto.webp",
    alt: "Grúas pórtico de un puerto marítimo en la costa antioqueña",
    clase: "lg:col-[span_23/span_23] lg:row-start-2",
    vw: 47,
  },
  {
    src: "/images/campana/obra-tunel.webp",
    alt: "Cuadrilla de obreros trabajando en el frente de excavación de un túnel",
    clase: "lg:col-[span_8/span_8] lg:row-start-2",
    vw: 17,
  },
];

export default function MosaicoObras() {
  return (
    <section aria-label="Obras de infraestructura en Antioquia" className="bg-white">
      <div className="mx-auto max-w-[90rem] px-5 py-10 lg:px-8 lg:py-12">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-[repeat(49,minmax(0,1fr))] lg:grid-rows-[14rem_18rem] lg:gap-4">
          {OBRAS.map((obra) => (
            <li key={obra.src} className={`relative h-40 lg:h-auto ${obra.clase}`}>
              <Image
                src={obra.src}
                alt={obra.alt}
                fill
                sizes={`(max-width: 1024px) 50vw, ${obra.vw}vw`}
                className="rounded-sm object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
