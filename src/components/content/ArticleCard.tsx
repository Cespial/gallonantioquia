import Image from "next/image";
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
  basePath,
}: ArticleCardProps) {
  const FormatIcon = formatIcons[format];
  const href = `${basePath || "/territorio-vivo"}/${slug}`;

  return (
    <Link href={href} className="block group">
      <article
        className={cn(
          "bg-blanco-calido overflow-hidden border-editorial-thin shadow-sm",
          "transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1"
        )}
      >
        {/* Image with subtle zoom and overlay */}
        <div className="overflow-hidden relative aspect-[16/10]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-verde-antioquia/5 group-hover:bg-transparent transition-colors duration-500" />
          
          {/* Format badge - more minimal */}
          <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-blanco-calido/90 backdrop-blur-sm text-oscuro text-[10px] uppercase tracking-widest font-ui font-bold px-3 py-1.5 border border-borde">
            <FormatIcon className="w-3 h-3" />
            {formatLabels[format]}
          </span>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-dorado-tierra/40" />
            <span className="uppercase text-[10px] font-ui tracking-widest-editorial text-dorado-tierra font-bold">
              {category}
            </span>
          </div>

          <h3 className="font-display text-2xl mb-4 text-texto-principal group-hover:text-verde-antioquia transition-colors duration-300 leading-tight">
            {title}
          </h3>

          <p className="font-body text-sm text-texto-secundario mb-6 line-clamp-2 leading-relaxed italic">
            {excerpt}
          </p>

          <div className="pt-6 border-t border-borde/50 flex items-center justify-between text-[10px] text-texto-terciario font-ui uppercase tracking-widest">
            <div className="flex items-center gap-4">
               <time>{date}</time>
               <span>{readTime}</span>
            </div>
            <span className="text-verde-antioquia font-bold group-hover:translate-x-1 transition-transform inline-block">LEER &rarr;</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
