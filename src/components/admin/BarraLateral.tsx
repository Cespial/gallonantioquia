import Link from "next/link";
import { LISTA_TIPOS } from "@/lib/admin/tipos";

export default function BarraLateral({ rol }: { rol: "admin" | "editor" }) {
  return (
    <nav aria-label="Secciones del panel" className="w-56 shrink-0 border-r border-borde p-4">
      <Link href="/admin" className="block font-medium text-texto-principal mb-4">
        Resumen
      </Link>

      <p className="text-xs uppercase tracking-wide text-texto-terciario mb-2">Contenido</p>
      <ul className="space-y-1 mb-6">
        {LISTA_TIPOS.map((t) => (
          <li key={t.tipo}>
            <Link
              href={`/admin/${t.rutaAdmin}`}
              className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia"
            >
              {t.etiqueta}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs uppercase tracking-wide text-texto-terciario mb-2">Sitio</p>
      <ul className="space-y-1">
        <li>
          <Link
            href="/admin/mensajes"
            className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia"
          >
            Propuestas
          </Link>
        </li>
        <li>
          <Link
            href="/admin/medios"
            className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia"
          >
            Fotos
          </Link>
        </li>
        <li>
          <Link
            href="/admin/papelera"
            className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia"
          >
            Papelera
          </Link>
        </li>
        {rol === "admin" && (
          <>
            <li>
              <Link
                href="/admin/ajustes"
                className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia"
              >
                Ajustes
              </Link>
            </li>
            <li>
              <Link
                href="/admin/usuarios"
                className="block py-1 text-sm text-texto-secundario hover:text-verde-antioquia"
              >
                Usuarios
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
