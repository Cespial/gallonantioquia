import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import PullQuote from "@/components/content/PullQuote";
import AuthorBioBox from "@/components/content/AuthorBioBox";
import ArticleNavigation from "@/components/content/ArticleNavigation";
import NewsletterCTA from "@/components/content/NewsletterCTA";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/content/Breadcrumb";
import ReadingProgress from "@/components/layout/ReadingProgress";
import { stories } from "@/data/content";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);

  if (!story) {
    return { title: "Historia no encontrada" };
  }

  return {
    title: `${story.title} — Territorio Vivo`,
    description: story.excerpt,
    openGraph: {
      images: [{ url: story.image }],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const storyIndex = stories.findIndex((s) => s.slug === slug);

  if (storyIndex === -1) {
    notFound();
  }

  const story = stories[storyIndex];
  const prevStory = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const nextStory =
    storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const { full: dateFormatted } = formatDate(story.date);

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            datePublished: story.date,
            description: story.excerpt,
            image: `https://gallonantioquia.vercel.app${story.image}`,
            author: {
              "@type": "Person",
              name: "Luis Horacio Gallón Arango",
              url: "https://gallonantioquia.vercel.app/sobre",
            },
            publisher: { "@type": "Organization", name: "Gallón Memorias" },
          }),
        }}
      />
      <PageHero
        title={story.title}
        label={story.category}
        backgroundImage={story.image}
      />

      <SectionWrapper>
        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "Territorio Vivo", href: "/territorio-vivo" },
          { label: story.title },
        ]} />
        <article className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <time className="font-ui text-sm text-texto-terciario">
              {dateFormatted}
            </time>
            <span
              aria-hidden="true"
              className="w-1 h-1 rounded-full bg-texto-terciario/50"
            />
            <span className="font-ui text-sm text-texto-terciario">
              {story.readTime}
            </span>
            <Badge label={story.format} variant={story.format} />
          </div>

          {/* Article body */}
          <div className="prose-editorial">
            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              En el coraz&oacute;n del Suroeste antioque&ntilde;o, donde las
              monta&ntilde;as dibujan un horizonte verde interminable, las
              comunidades rurales han aprendido a vivir con la geograf&iacute;a
              como aliada y como obst&aacute;culo. Durante d&eacute;cadas, la
              falta de v&iacute;as adecuadas ha sido una barrera invisible que
              separa a las familias de los servicios b&aacute;sicos, los
              mercados y las oportunidades que el resto de Antioquia da por
              sentadas.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Cuando el asfalto llega por primera vez a una vereda, el cambio no
              es solo f&iacute;sico. Es un cambio de mentalidad, de
              posibilidades, de futuro. Los campesinos que antes perd&iacute;an
              horas en caminos de herradura ahora pueden sacar sus productos al
              mercado antes del mediod&iacute;a. Las madres que esperaban d&iacute;as
              para llevar a sus hijos al m&eacute;dico ahora llegan en menos de
              una hora. Los j&oacute;venes que se iban porque no ve&iacute;an
              futuro empiezan a quedarse, a emprender, a creer que su tierra
              tiene algo que ofrecer.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Esta historia es una de esas que no aparecen en los titulares de
              Medell&iacute;n, pero que transforman la vida cotidiana de miles de
              antioque&ntilde;os. Es la historia de una comunidad que
              esper&oacute; con paciencia y que hoy, finalmente, ve c&oacute;mo
              la infraestructura le abre las puertas a un presente m&aacute;s
              digno.
            </p>
          </div>

          <PullQuote
            quote="Los caminos no solo acortan distancias — abren futuros."
            author="Horacio Gall&oacute;n"
          />

          <div className="prose-editorial">
            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              La inversi&oacute;n en infraestructura rural no es un gasto: es
              una siembra. Cada kil&oacute;metro de placa huella, cada puente,
              cada v&iacute;a terciaria pavimentada genera un efecto
              multiplicador que se mide en calidad de vida, en productividad
              agr&iacute;cola, en acceso a salud y educaci&oacute;n. Antioquia
              tiene 125 municipios y nueve subregiones, y cada una merece estar
              conectada con las oportunidades que el departamento ofrece.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              El compromiso es claro: no dejar ning&uacute;n rinc&oacute;n
              atr&aacute;s. Porque cuando la infraestructura llega al campo, el
              campo llega al mercado. Y cuando el campo prospera, Antioquia
              entera se fortalece. Este es el territorio vivo que estamos
              construyendo &mdash; con obras, con presencia y con la
              convicci&oacute;n de que cada comunidad cuenta.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Recorrer estas veredas, escuchar a sus l&iacute;deres, ver los
              rostros de quienes reciben por primera vez una obra que esperaron
              a&ntilde;os &mdash; eso es lo que da sentido a esta labor. No hay
              plan de escritorio que reemplace la experiencia de caminar un
              territorio y entender sus necesidades de primera mano.
            </p>
          </div>

          <AuthorBioBox
            description="Hijo de Andes, Suroeste antioque&ntilde;o. M&aacute;s de tres d&eacute;cadas al servicio de Antioquia. Actual Secretario de Infraestructura F&iacute;sica de la Gobernaci&oacute;n de Antioquia, liderando la mayor inversi&oacute;n vial en la historia del departamento."
          />

          <ArticleNavigation
            basePath="/territorio-vivo"
            prev={prevStory}
            next={nextStory}
          />

          <NewsletterCTA
            title="Recibe m&aacute;s historias de Antioquia"
            subtitle="Suscr&iacute;bete y te enviaremos las nuevas historias de Territorio Vivo directamente a tu correo."
          />
        </article>
      </SectionWrapper>
    </>
  );
}
