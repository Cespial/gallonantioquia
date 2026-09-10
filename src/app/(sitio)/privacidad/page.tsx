import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata la campaña Gallón Gobernador los datos que dejas en el formulario de contacto.",
};

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">{children}</h2>
);
const Parrafo = ({ children }: { children: React.ReactNode }) => (
  <p className="font-body text-texto-secundario leading-relaxed mb-6">{children}</p>
);

export default function PrivacidadPage() {
  return (
    <>
      <PageHero title="Política de privacidad" subtitle="Cómo tratamos tu información personal." compact />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto prose-custom">
          <Parrafo>Última actualización: septiembre de 2026.</Parrafo>

          <Titulo>1. Qué información recogemos</Titulo>
          <Parrafo>
            Solo la que dejas voluntariamente en el formulario «Te escuchamos»: tu
            nombre, tu correo electrónico, tu teléfono si lo escribes, el
            municipio que eliges y el texto de tu propuesta o solicitud. No
            recogemos datos de ubicación ni información financiera.
          </Parrafo>

          <Titulo>2. Para qué la usamos</Titulo>
          <Parrafo>
            Para leer tu propuesta, responderte y ponernos en contacto contigo
            por la campaña. La lee únicamente el equipo de campaña. No la
            compartimos, vendemos ni cedemos a terceros, y la conservamos solo el
            tiempo necesario para atender tu mensaje y para la gestión de la
            campaña.
          </Parrafo>

          <Titulo>3. Cookies y analítica</Titulo>
          <Parrafo>
            El sitio usa únicamente las cookies necesarias para su funcionamiento.
            No se usan cookies de rastreo publicitario.
          </Parrafo>

          <Titulo>4. Tus derechos</Titulo>
          <Parrafo>
            Conforme a la Ley 1581 de 2012 sobre protección de datos personales,
            puedes conocer, actualizar, rectificar o pedir que eliminemos tus
            datos en cualquier momento. Escríbenos por el mismo formulario o por
            los canales de contacto publicados en el sitio, y atenderemos tu
            solicitud en un plazo máximo de diez días hábiles.
          </Parrafo>

          <Titulo>5. Contacto</Titulo>
          <Parrafo>
            Para cualquier consulta sobre esta política, usa el formulario «Te
            escuchamos» o los datos de contacto que aparecen al pie de cada
            página.
          </Parrafo>
        </div>
      </SectionWrapper>
    </>
  );
}
