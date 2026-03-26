import { cn } from "@/lib/utils";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  index: number;
  isLast?: boolean;
}

export default function TimelineItem({
  year,
  title,
  description,
  index,
  isLast,
}: TimelineItemProps) {
  void index; // reserved for future alternating layouts
  return (
    <div className="flex gap-4 md:gap-8">
      {/* Year */}
      <div className="flex-shrink-0 w-16 md:w-20 pt-0.5 text-right">
        <span className="font-display font-bold text-dorado-tierra text-lg">{year}</span>
      </div>

      {/* Timeline line + node */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        {/* Node */}
        <div className="w-4 h-4 rounded-full bg-verde-antioquia border-2 border-dorado-tierra z-10 flex-shrink-0" />

        {/* Vertical line */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-verde-antioquia/30 mt-0" />
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-8", isLast && "pb-0")}>
        <h4 className="font-heading font-bold text-texto-principal">{title}</h4>
        <p className="font-body text-sm text-texto-secundario mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
