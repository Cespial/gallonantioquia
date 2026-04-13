import Image from "next/image";

const photos = [
  "/images/gallon-discurso-microphone.jpg",
  "/images/gallon-conversacion-rural.jpg",
  "/images/gallon-presentacion.jpg",
  "/images/gallon-close-up.jpg",
  "/images/gallon-caminando-obra.jpg",
  "/images/gallon-pareja-futbol.jpg",
];

export default function PhotoBand() {
  return (
    <section className="overflow-hidden">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
        {photos.map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden group">
            <Image src={src} alt="" fill sizes="(max-width: 768px) 33vw, 16vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        ))}
      </div>
    </section>
  );
}
