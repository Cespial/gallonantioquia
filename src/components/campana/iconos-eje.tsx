import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  Route,
  Sprout,
  TreePine,
  type LucideIcon,
} from "lucide-react";

/** Cada valor de ICONOS_EJE tiene aquí su dibujo. */
const MAPA: Record<string, LucideIcon> = {
  salud: HeartPulse,
  educacion: GraduationCap,
  campo: Sprout,
  infraestructura: Route,
  empleo: Briefcase,
  ambiente: TreePine,
};

export function IconoEje({ nombre, className }: { nombre: string; className?: string }) {
  const Icono = MAPA[nombre] ?? HeartPulse;
  return <Icono className={className} strokeWidth={1.5} aria-hidden="true" />;
}
