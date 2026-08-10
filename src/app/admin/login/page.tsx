import type { Metadata } from "next";
import FormularioAcceso from "./formulario";

export const metadata: Metadata = {
  title: "Entrar — Administración",
  robots: { index: false, follow: false },
};

export default function PaginaAcceso() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-arena">
      <div className="text-center">
        <h1 className="font-display text-2xl text-texto-principal">Administración del sitio</h1>
        <p className="mt-1 text-sm text-texto-secundario">Gallón Memorias</p>
      </div>
      <FormularioAcceso />
    </main>
  );
}
