import { CircleCheckBig } from "lucide-react";

/**
 * La viñeta con círculo y palomita del mockup. Aparece en cinco secciones con
 * dos variables: el color del icono y de qué lado del texto va.
 *
 * El icono se declara `aria-hidden` porque no aporta nada que el `<li>` no diga
 * ya: un lector de pantalla que anuncie «check» delante de cada frase de una
 * lista de treinta ítems solo estorba.
 */
export type TonoVineta = "verde" | "dorado" | "hoja";

const TONOS: Record<TonoVineta, string> = {
  verde: "text-campana-selva",
  dorado: "text-campana-dorado",
  hoja: "text-campana-hoja",
};

export default function Vineta({
  children,
  tono = "verde",
  lado = "izquierda",
  className = "",
}: {
  children: React.ReactNode;
  tono?: TonoVineta;
  /** En «Esto significa para los antioqueños» la lista va alineada a la
   *  derecha y el icono queda del otro lado. Solo a partir de `lg`: en una
   *  pantalla estrecha el texto en bandera derecha se vuelve ilegible. */
  lado?: "izquierda" | "derecha";
  className?: string;
}) {
  const icono = (
    <CircleCheckBig
      aria-hidden="true"
      strokeWidth={2}
      className={`mt-[0.15em] h-[1.15em] w-[1.15em] shrink-0 ${TONOS[tono]}`}
    />
  );

  return (
    <li
      className={`flex items-start gap-3 ${
        lado === "derecha" ? "lg:flex-row-reverse lg:text-right" : ""
      } ${className}`}
    >
      {icono}
      <span className="min-w-0">{children}</span>
    </li>
  );
}
