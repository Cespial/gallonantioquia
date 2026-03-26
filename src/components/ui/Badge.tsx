import {
  Video,
  Headphones,
  Volume2,
  Camera,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "video"
  | "podcast"
  | "texto"
  | "audio"
  | "fotografia"
  | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  video: "bg-red-500/90 text-white",
  podcast: "bg-purple-500/90 text-white",
  audio: "bg-amber-500/90 text-white",
  fotografia: "bg-blue-500/90 text-white",
  texto: "bg-verde-antioquia/90 text-white",
  default: "bg-texto-terciario/20 text-texto-secundario",
};

const iconMap: Record<BadgeVariant, React.ElementType | null> = {
  video: Video,
  podcast: Headphones,
  audio: Volume2,
  fotografia: Camera,
  texto: FileText,
  default: null,
};

const commonStyles =
  "font-ui text-xs font-semibold uppercase tracking-label px-2.5 py-1 rounded-full inline-flex items-center gap-1";

export default function Badge({ label, variant = "default" }: BadgeProps) {
  const Icon = iconMap[variant];

  return (
    <span className={cn(commonStyles, variantStyles[variant])}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {label}
    </span>
  );
}
