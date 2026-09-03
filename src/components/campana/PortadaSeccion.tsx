import Image from "next/image";

/**
 * La portada de una sección: la pieza gráfica de campaña, a sangre.
 *
 * Las seis portadas vienen a 1600 × 614 con el título **dibujado dentro**. Por
 * eso el `h2` presta su texto al lector de pantalla y la imagen entra como
 * adorno: anunciar las dos cosas leería el titular dos veces.
 *
 * ⚠️ No se recorta a una altura fija a propósito. Con `object-cover` a 19 rem,
 * a 1440 px se comen 250 px de alto y el titular de «SOY GALLÓN» —que arranca
 * a 60 px del borde superior— pierde la primera línea. Con la relación de
 * aspecto nativa no se pierde nada a ningún ancho.
 */
export default function PortadaSeccion({
  id,
  src,
  titulo,
  className = "",
}: {
  /** El `aria-labelledby` de la sección apunta aquí. */
  id: string;
  src: string;
  /** Lo que dice la pieza. Es el nombre accesible de la sección. */
  titulo: string;
  className?: string;
}) {
  return (
    <h2 id={id} className={`relative block aspect-[1600/614] w-full ${className}`}>
      <span className="sr-only">{titulo}</span>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </h2>
  );
}
