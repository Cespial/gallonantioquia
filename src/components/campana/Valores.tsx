import { Handshake, Landmark, Leaf, Users } from "lucide-react";

const VALORES = [
  { icono: Users, titulo: "Cercanía", detalle: "con la comunidad" },
  { icono: Landmark, titulo: "Experiencia", detalle: "pública" },
  { icono: Handshake, titulo: "Construcción", detalle: "colectiva" },
  { icono: Leaf, titulo: "Desarrollo", detalle: "regional" },
];

export default function Valores() {
  return (
    <section className="bg-white pb-16 lg:pb-20" aria-label="Principios de la campaña">
      <ul className="mx-auto grid max-w-[1400px] gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {VALORES.map(({ icono: Icono, titulo, detalle }) => (
          <li
            key={titulo}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <Icono className="h-9 w-9 shrink-0 text-campana-bosque" strokeWidth={1.5} />
            <p className="font-campana leading-tight">
              <span className="block text-lg font-bold text-campana-bosque">{titulo}</span>
              <span className="block text-sm text-neutral-600">{detalle}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
