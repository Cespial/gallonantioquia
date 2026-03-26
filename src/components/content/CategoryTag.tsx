import { cn } from "@/lib/utils";

interface CategoryTagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryTag({ label, active, onClick }: CategoryTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-ui text-xs uppercase tracking-label font-semibold",
        "rounded-full px-4 py-1.5 cursor-pointer transition-all duration-200",
        active
          ? "bg-verde-antioquia text-white"
          : "bg-verde-suave text-verde-antioquia hover:brightness-95"
      )}
    >
      {label}
    </button>
  );
}
