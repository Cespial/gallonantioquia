/**
 * El patrón de título del mockup: una primera palabra pequeña y en color, y
 * la segunda grande en verde. Se repite en todas las secciones.
 */
export default function TituloPagina({
  arriba,
  abajo,
  descripcion,
  tono = "claro",
}: {
  arriba: string;
  abajo: string;
  descripcion?: string;
  tono?: "claro" | "oscuro";
}) {
  const oscuro = tono === "oscuro";

  return (
    <header
      className={
        oscuro
          ? "bg-campana-bosque py-14 lg:py-16"
          : "border-b border-neutral-200 bg-campana-hueso py-12 lg:py-14"
      }
    >
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <h1 className="font-campana leading-none">
          <span
            className={`block text-lg font-semibold uppercase tracking-wide ${
              oscuro ? "text-white/70" : "text-campana-dorado"
            }`}
          >
            {arriba}
          </span>
          <span
            className={`block text-4xl font-extrabold uppercase lg:text-[3.2rem] ${
              oscuro ? "text-white" : "text-campana-bosque"
            }`}
          >
            {abajo}
          </span>
        </h1>

        {descripcion && (
          <p
            className={`mt-3 max-w-2xl font-campana text-[15px] leading-relaxed ${
              oscuro ? "text-white/80" : "text-neutral-600"
            }`}
          >
            {descripcion}
          </p>
        )}
      </div>
    </header>
  );
}
