import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play, Video, Headphones, FileText } from "lucide-react";

interface EpisodeCardProps {
  number: number;
  title: string;
  guest: string;
  guestRole: string;
  description: string;
  format: string[];
  image: string;
}

const formatConfig: Record<string, { icon: React.ElementType; color: string }> = {
  Video: { icon: Video, color: "bg-verde-antioquia text-white" },
  Podcast: { icon: Headphones, color: "bg-dorado-tierra text-oscuro" },
  "Resumen escrito": { icon: FileText, color: "bg-verde-suave text-verde-antioquia" },
};

export default function EpisodeCard({
  number,
  title,
  guest,
  guestRole,
  description,
  format,
  image,
}: EpisodeCardProps) {
  return (
    <article
      className={cn(
        "group bg-blanco-calido rounded-card overflow-hidden border border-borde/50 shadow-sm",
        "transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Thumbnail with play overlay */}
      <div className="relative overflow-hidden rounded-t-card aspect-[16/10]">
        <Image
          src={image}
          alt={`${title} - ${guest}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-oscuro/20 transition-colors duration-300 group-hover:bg-oscuro/30">
          <div className="w-16 h-16 rounded-full bg-dorado-tierra flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="w-7 h-7 text-oscuro fill-oscuro ml-1" />
          </div>
        </div>

        {/* Episode number badge */}
        <span className="absolute top-3 left-3 bg-dorado-tierra text-oscuro font-bold rounded-full px-3 py-1 text-xs font-ui">
          Ep. {number}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-xl text-texto-principal transition-colors duration-200 group-hover:text-verde-antioquia">
          {title}
        </h3>

        {/* Guest info */}
        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 rounded-full bg-verde-suave flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-bold text-verde-antioquia text-sm">
              {guest
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-texto-principal">{guest}</p>
            <p className="font-ui text-xs text-texto-terciario">{guestRole}</p>
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-texto-secundario mt-3 line-clamp-2">{description}</p>

        {/* Format badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {format.map((fmt) => {
            const config = formatConfig[fmt];
            const Icon = config?.icon || FileText;
            const colorClass = config?.color || "bg-verde-suave text-verde-antioquia";

            return (
              <span
                key={fmt}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-ui font-semibold px-2.5 py-1 rounded-full",
                  colorClass
                )}
              >
                <Icon className="w-3 h-3" />
                {fmt}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}
