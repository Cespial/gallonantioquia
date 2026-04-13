import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-brand text-6xl text-dorado-tierra mb-4">404</p>
      <h1 className="font-display text-3xl text-texto-principal mb-4">
        Pagina no encontrada
      </h1>
      <p className="font-body text-texto-secundario mb-8 max-w-md">
        La pagina que buscas no existe o fue movida. Te invitamos a explorar
        nuestras columnas y reflexiones.
      </p>
      <Link
        href="/"
        className="bg-dorado-tierra text-oscuro rounded-full px-6 py-3 font-heading font-bold text-sm hover:brightness-110 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
