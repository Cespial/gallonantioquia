import Button from "@/components/ui/Button";

interface AuthorBioBoxProps {
  description?: string;
}

export default function AuthorBioBox({
  description = "Hijo de Andes, Suroeste antioque\u00f1o. M\u00e1s de tres d\u00e9cadas al servicio de Antioquia. Exalcalde, exrepresentante a la C\u00e1mara y columnista en Al Poniente.",
}: AuthorBioBoxProps) {
  return (
    <div className="mt-12 p-6 bg-verde-suave rounded-card border border-borde/50">
      <h3 className="font-heading font-bold text-lg text-texto-principal mb-2">
        Sobre Horacio Gall&oacute;n
      </h3>
      <p className="font-body text-sm text-texto-secundario leading-relaxed mb-4">
        {description}
      </p>
      <Button href="/sobre" variant="secondary" size="sm">
        Conocer m&aacute;s
      </Button>
    </div>
  );
}
