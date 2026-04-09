import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import PullQuote from "@/components/content/PullQuote";
import NewsletterForm from "@/components/content/NewsletterForm";
import Button from "@/components/ui/Button";
import { blogPosts } from "@/data/content";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Entrada no encontrada" };
  }

  return {
    title: `${post.title} — Bitácora de Camino`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);

  if (postIndex === -1) {
    notFound();
  }

  const post = blogPosts[postIndex];
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost =
    postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
  const { full: dateFormatted } = formatDate(post.date);

  return (
    <>
      <PageHero
        title={post.title}
        label={post.tag}
        backgroundImage={post.image}
      />

      <SectionWrapper>
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
              {post.readTime}
            </span>
          </div>

          {/* Article body */}
          <div className="prose-editorial">
            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Hay lecciones que no se aprenden en los libros ni en las oficinas.
              Se aprenden en el camino, en las veredas, en las conversaciones con
              la gente que vive lejos de los reflectores pero cerca de las
              realidades m&aacute;s profundas de este departamento. Cada
              recorrido por Antioquia me ha dejado algo: una historia, una
              pregunta, una convicci&oacute;n m&aacute;s firme de que gobernar
              es, ante todo, escuchar.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              En m&aacute;s de tres d&eacute;cadas de servicio p&uacute;blico he
              aprendido que la urgencia de la pol&iacute;tica empuja a decidir
              r&aacute;pido, a prometer m&aacute;s de lo posible, a hablar antes
              de entender. Pero las decisiones que verdaderamente transforman un
              territorio necesitan tiempo, consenso y la humildad de reconocer
              que uno no tiene todas las respuestas. La comunidad siempre sabe
              algo que uno ignora.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              El liderazgo que admiro no es el que impone, sino el que convoca.
              El que se sienta con el campesino, con la rectora, con el
              transportador, con el joven que quiere quedarse en su municipio
              pero no ve c&oacute;mo. Las mejores ideas de gobierno que he visto
              no nacieron en un despacho: nacieron en una reuni&oacute;n
              comunitaria, en la tienda del pueblo, en el borde de un camino
              destapado.
            </p>
          </div>

          <PullQuote
            quote="Escuchar es el primer acto de gobierno."
            author="Horacio Gall&oacute;n"
          />

          <div className="prose-editorial">
            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Antioquia es un departamento de contrastes. Tiene la
              sofisticaci&oacute;n de Medell&iacute;n y el aislamiento de
              veredas donde a&uacute;n no llega el asfalto. Tiene empresarios
              que compiten en mercados globales y familias campesinas que
              dependen de un camino de herradura para sacar su cosecha. Cerrar
              esas brechas no es solo un asunto de presupuesto: es un asunto de
              voluntad pol&iacute;tica, de prioridades claras y de presencia
              constante en el territorio.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Estas reflexiones no pretenden ser verdades absolutas. Son apuntes
              de camino, notas de un servidor p&uacute;blico que sigue
              aprendiendo. Porque la bit&aacute;cora no se escribe al llegar al
              destino &mdash; se escribe mientras se camina. Y en Antioquia,
              todav&iacute;a hay mucho camino por recorrer.
            </p>

            <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
              Comparto estas palabras con la esperanza de que inspiren una
              conversaci&oacute;n. Que alguien en una vereda del Oriente o en un
              barrio de Urab&aacute; lea esto y sienta que su voz importa.
              Porque la Antioquia que queremos no la construye un gobernante
              solo: la construimos entre todos, paso a paso, decisi&oacute;n a
              decisi&oacute;n, vereda a vereda.
            </p>
          </div>

          {/* Author box */}
          <div className="mt-12 p-6 bg-verde-suave rounded-card border border-borde/50">
            <h3 className="font-heading font-bold text-lg text-texto-principal mb-2">
              Sobre Horacio Gall&oacute;n
            </h3>
            <p className="font-body text-sm text-texto-secundario leading-relaxed mb-4">
              Hijo de Andes, Suroeste antioque&ntilde;o. M&aacute;s de tres
              d&eacute;cadas al servicio de Antioquia. Exalcalde, exrepresentante
              a la C&aacute;mara y columnista en Al Poniente.
            </p>
            <Button href="/sobre" variant="secondary" size="sm">
              Conocer m&aacute;s
            </Button>
          </div>

          {/* Prev / Next navigation */}
          <nav className="flex justify-between items-center mt-12 pt-8 border-t border-borde">
            {prevPost ? (
              <Link
                href={`/bitacora/${prevPost.slug}`}
                className="group font-ui text-sm text-texto-secundario hover:text-verde-antioquia transition-colors"
              >
                <span className="block text-xs uppercase tracking-label text-texto-terciario mb-1">
                  Anterior
                </span>
                <span className="group-hover:underline">
                  &larr; {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/bitacora/${nextPost.slug}`}
                className="group font-ui text-sm text-texto-secundario hover:text-verde-antioquia transition-colors text-right"
              >
                <span className="block text-xs uppercase tracking-label text-texto-terciario mb-1">
                  Siguiente
                </span>
                <span className="group-hover:underline">
                  {nextPost.title} &rarr;
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Newsletter CTA */}
          <div className="mt-16 p-8 bg-oscuro-verde rounded-card text-center">
            <h3 className="font-display text-2xl text-white mb-2">
              Recibe las reflexiones de Horacio
            </h3>
            <p className="font-body text-sm text-white/70 mb-6">
              Suscr&iacute;bete y recibir&aacute;s cada nueva entrada de la
              Bit&aacute;cora directamente en tu correo.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </article>
      </SectionWrapper>
    </>
  );
}
