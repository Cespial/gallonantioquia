import Link from "next/link";
import { cn } from "@/lib/utils";
import { Video, Headphones, Camera, FileText } from "lucide-react";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  format: "texto" | "video" | "audio" | "fotografia";
  image: string;
  featured?: boolean;
  basePath?: string;
}

const formatIcons: Record<ArticleCardProps["format"], React.ElementType> = {
  texto: FileText,
  video: Video,
  audio: Headphones,
  fotografia: Camera,
};

const formatLabels: Record<ArticleCardProps["format"], string> = {
  texto: "Texto",
  video: "Video",
  audio: "Audio",
  fotografia: "Foto",
};

export default function ArticleCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readTime,
  format,
  image,
  featured,
  basePath,
}: ArticleCardProps) {
  const FormatIcon = formatIcons[format];
  const href = `${basePath || "/territorio-vivo"}/${slug}`;

  return (
    <Link href={href} className="block group">
      <article
        className={cn(
          "bg-blanco-calido rounded-card overflow-hidden border border-borde/50 shadow-sm",
          "transition-all duration-300",
          "hover:shadow-md hover:-translate-y-0.5"
        )}
      >
        {/* Image */}
        <div className="overflow-hidden rounded-t-card relative">
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full object-cover transition-transform duration-500 group-hover:scale-105",
              featured ? "aspect-[16/9]" : "aspect-[16/10]"
            )}
          />
          {/* Format badge */}
          <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-oscuro/70 backdrop-blur-sm text-white text-xs font-ui font-semibold px-2.5 py-1 rounded-full">
            <FormatIcon className="w-3.5 h-3.5" />
            {formatLabels[format]}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="uppercase text-xs font-ui tracking-label text-verde-antioquia font-semibold">
            {category}
          </span>

          <h3
            className={cn(
              "font-heading font-bold mt-2 text-texto-principal transition-colors duration-200 group-hover:text-verde-antioquia",
              featured ? "text-xl md:text-2xl" : "text-lg"
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              "font-body text-sm text-texto-secundario mt-2 line-clamp-2",
              featured && "md:text-base md:line-clamp-3"
            )}
          >
            {excerpt}
          </p>

          <div className="flex items-center gap-3 mt-4 text-xs text-texto-terciario font-ui">
            <time>{date}</time>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-texto-terciario/50" />
            <span>{readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
