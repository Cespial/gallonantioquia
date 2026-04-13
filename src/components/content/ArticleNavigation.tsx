import Link from "next/link";

interface ArticleNavigationProps {
  basePath: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export default function ArticleNavigation({ basePath, prev, next }: ArticleNavigationProps) {
  return (
    <nav className="flex justify-between items-center mt-12 pt-8 border-t border-borde">
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group font-ui text-sm text-texto-secundario hover:text-verde-antioquia transition-colors max-w-[45%]"
        >
          <span className="block text-xs uppercase tracking-label text-texto-terciario mb-1">
            Anterior
          </span>
          <span className="group-hover:underline line-clamp-2">
            &larr; {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group font-ui text-sm text-texto-secundario hover:text-verde-antioquia transition-colors text-right max-w-[45%]"
        >
          <span className="block text-xs uppercase tracking-label text-texto-terciario mb-1">
            Siguiente
          </span>
          <span className="group-hover:underline line-clamp-2">
            {next.title} &rarr;
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
