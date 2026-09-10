import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones de uso del sitio de campaña Gallón Gobernador.",
};

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">{children}</h2>
);
const Parrafo = ({ children }: { children: React.ReactNode }) => (
  <p className="font-body text-texto-secundario leading-relaxed mb-6">{children}</p>
);

export default function TerminosPage() {
  return (
    <>
      <PageHero title="Términos de uso" subtitle="Condiciones para el uso de este sitio." compact />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto prose-custom">
          <Parrafo>Última actualización: septiembre de 2026.</Parrafo>

          <Titulo>1. Naturaleza del sitio</Titulo>
          <Parrafo>
            Este es el sitio de la campaña de Horacio Gallón a la Gobernación de
            Antioquia. Publica la trayectoria del candidato, sus columnas, la
            agenda de campaña, el plan de gobierno y las obras que impulsa. No es
            una plataforma comercial ni presta servicios a través de este medio.
          </Parrafo>

          <Titulo>2. Propiedad intelectual</Titulo>
          <Parrafo>
            Los textos, fotografías, videos, diseño y elementos gráficos de este
            sitio pertenecen a la campaña o a sus autores, salvo que se indique lo
            contrario. Puedes citar fragmentos breves con la debida atribución y
            enlace a la página original. La reproducción total sin autorización
            no está permitida.
          </Parrafo>

          <Titulo>3. Contenido de opinión</Titulo>
          <Parrafo>
            Las columnas y reflexiones publicadas expresan la opinión de su autor.
            Las cifras de obras y gestión corresponden a la información disponible
            en la fecha de publicación de cada pieza. Algunas imágenes de proyectos
            en curso son ilustraciones de referencia y se identifican como tales.
          </Parrafo>

          <Titulo>4. Enlaces externos</Titulo>
          <Parrafo>
            Este sitio puede contener enlaces a sitios de terceros, entre ellos
            medios de comunicación y plataformas de video. No somos responsables
            del contenido, las políticas de privacidad ni las prácticas de esos
            sitios.
          </Parrafo>

          <Titulo>5. Modificaciones</Titulo>
          <Parrafo>
            Estos términos pueden cambiar en cualquier momento. Los cambios rigen
            desde su publicación en esta página.
          </Parrafo>
        </div>
      </SectionWrapper>
    </>
  );
}
