import Link from "next/link";
import type { EjeGobierno } from "@/types";
import { IconoEje } from "./iconos-eje";

export default function PlanDeGobierno({ ejes }: { ejes: EjeGobierno[] }) {
  return (
    <div className="bg-campana-bosque px-5 py-11 lg:px-12 lg:py-12">
      <h2 className="font-campana leading-none">
        <span className="block text-lg font-semibold uppercase tracking-wide text-white/70">
          Plan de
        </span>
        <span className="block text-3xl font-extrabold uppercase text-white lg:text-[2.6rem]">
          Gobierno
        </span>
      </h2>
      <p className="mt-2 font-campana text-sm text-white/70">
        Conoce nuestros ejes estratégicos
      </p>

      {ejes.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/30 p-8 text-center font-campana text-sm text-white/70">
          Los ejes del plan se publican desde el panel.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ejes.map((eje) => (
            <li key={eje.slug}>
              <Link
                href={`/plan-de-gobierno/${eje.slug}`}
                className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/25 px-3 py-5 text-center transition-colors hover:border-white/70 hover:bg-white/5"
              >
                <IconoEje nombre={eje.icono} className="h-9 w-9 text-white" />
                <span className="font-campana text-[13px] font-medium leading-tight text-white">
                  {eje.titulo}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7 text-center">
        <Link
          href="/plan-de-gobierno"
          className="inline-block rounded-full bg-campana-dorado px-8 py-3.5 font-campana text-[13px] font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
        >
          Ver plan completo
        </Link>
      </div>
    </div>
  );
}
