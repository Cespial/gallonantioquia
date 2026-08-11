import Image from "next/image";
import Link from "next/link";
import { Map, Users } from "lucide-react";

type Cifra = { valor: number; sufijo: string; etiqueta: string };

const ICONOS = [Map, Users];

export default function FranjaCifras({
  cifras,
  mensaje,
}: {
  cifras: Cifra[];
  mensaje: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-campana-profundo py-9">
      <Image
        src="/images/campana/hero-montanas.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-campana-profundo/80" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">
          {cifras.slice(0, 2).map((cifra, i) => {
            const Icono = ICONOS[i] ?? Map;
            return (
              <li key={cifra.etiqueta} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30"
                >
                  <Icono className="h-8 w-8 text-white" strokeWidth={1.5} />
                </span>
                <span className="font-campana leading-none text-white">
                  <span className="block text-4xl font-extrabold lg:text-[3.2rem]">
                    {cifra.sufijo === "+" ? "+" : ""}
                    {cifra.valor.toLocaleString("es-CO")}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-white/80">
                    {cifra.etiqueta}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div>
          <p className="font-campana text-xl font-bold leading-tight text-white lg:text-[1.7rem]">
            {mensaje}
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-block rounded-full bg-campana-dorado px-8 py-3.5 font-campana text-[13px] font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
          >
            Únete al equipo
          </Link>
        </div>
      </div>
    </section>
  );
}
