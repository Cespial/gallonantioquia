import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import PullQuote from "@/components/content/PullQuote";
import Button from "@/components/ui/Button";
import { ideas } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

const ideaContent: Record<string, { paragraphs: string[]; quote: string }> = {
  "infraestructura-brechas-rurales": {
    paragraphs: [
      "Antioquia es un departamento de contrastes. Mientras Medellín y su area metropolitana concentran la mayor parte de la inversión y la conectividad, decenas de municipios rurales siguen dependiendo de caminos destapados que se vuelven intransitables con cada temporada de lluvias. La brecha entre lo urbano y lo rural no es solo economica: es una deuda historica con las comunidades que alimentan al departamento.",
      "La conectividad vial es el primer eslabon de la cadena de desarrollo rural. Cuando una vereda tiene acceso a una via pavimentada o a una placa huella en buen estado, los tiempos de desplazamiento se reducen drasticamente. Los campesinos pueden sacar sus productos al mercado sin perder cosecha en el camino. Los ninos llegan a la escuela sin embarrarse hasta las rodillas. Las ambulancias pueden entrar cuando hay una emergencia.",
      "Los datos lo confirman: en los municipios donde se ha invertido en infraestructura vial terciaria, la produccion agricola ha crecido en promedio un 18% en los dos anos siguientes a la intervencion. La asistencia escolar mejora, la atencion en salud se agiliza y los precios de los productos del campo se estabilizan porque los intermediarios ya no cobran sobrecostos por el mal estado de las vias.",
      "El reto no es solo construir, sino mantener. Antioquia necesita un modelo sostenible de mantenimiento vial que involucre a las comunidades, a los municipios y al departamento. Las juntas de accion comunal han demostrado que cuando se les da herramientas y recursos, pueden ser las mejores aliadas del mantenimiento preventivo.",
      "Cerrar las brechas rurales no es un gasto: es la inversion mas rentable que puede hacer Antioquia. Cada kilometro de via rural pavimentada es un puente entre el aislamiento y la oportunidad, entre el olvido y la dignidad.",
    ],
    quote:
      "Cada kilometro de via rural pavimentada es un puente entre el aislamiento y la oportunidad.",
  },
  "futuro-logistico": {
    paragraphs: [
      "Antioquia esta en una posicion geografica privilegiada. Conecta el interior del pais con los puertos del Caribe, con el Pacifico chocoano y con las fronteras del norte. Sin embargo, esa ventaja natural ha sido desaprovechada durante decadas por la falta de infraestructura logistica moderna.",
      "El Tren Multiproposito del rio Magdalena es quizas el proyecto mas transformador en la historia reciente del departamento. Con 1,7 billones de pesos aprobados, este corredor ferroviario promete mover carga y pasajeros de manera eficiente, reduciendo costos logisticos y descongestionando las carreteras que hoy soportan un trafico para el que no fueron disenadas.",
      "Pero el tren es solo una pieza del rompecabezas. Antioquia necesita pensar su futuro logistico de manera integral: los corredores viales que conectan las subregiones con los centros de acopio, los puertos de Uraba que pueden convertirse en la puerta de entrada y salida del comercio internacional, y las plataformas multimodales que articulen carretera, rio y ferrocarril.",
      "La competitividad de las empresas antioquenas depende directamente de los costos de transporte. Un empresario del Oriente antioqueno que quiere exportar sus productos gasta hoy hasta un 30% mas en logistica que un competidor con acceso directo a un puerto. Reducir esa brecha no es solo un tema de infraestructura: es un tema de justicia economica y territorial.",
      "El futuro logistico de Antioquia se construye hoy, con decisiones que trascienden los periodos de gobierno y con una vision de largo plazo que ponga la conectividad al servicio de la productividad y el bienestar de todas las subregiones.",
    ],
    quote:
      "La competitividad de Antioquia se juega en sus corredores logisticos, no solo en sus oficinas.",
  },
  "desarrollo-regional": {
    paragraphs: [
      "Antioquia tiene 125 municipios agrupados en 9 subregiones, cada una con vocacion productiva, identidad cultural y desafios propios. Sin embargo, el modelo de desarrollo ha sido historicamente centralista: Medellin y el Valle de Aburra concentran mas del 60% del PIB departamental, mientras subregiones como el Bajo Cauca, el Nordeste o el Occidente luchan por atraer inversion y retener talento.",
      "El equilibrio territorial no significa repartir recursos por igual, sino invertir de manera estrategica donde el impacto es mayor. Significa reconocer que un peso invertido en conectividad en una vereda del Suroeste genera mas transformacion que el mismo peso invertido en una autopista del Area Metropolitana que ya tiene alternativas de movilidad.",
      "Las subregiones de Antioquia tienen un potencial enorme que ha sido subvalorado. Uraba es la despensa agricola del pais y puede ser su principal corredor de comercio exterior. El Oriente antioqueno tiene una base empresarial solida y un ecosistema de innovacion creciente. El Suroeste cafetero combina turismo, agricultura de alta calidad y una cultura de emprendimiento que merece ser potenciada.",
      "El desarrollo regional requiere descentralizar no solo recursos, sino tambien decisiones. Los alcaldes y las comunidades conocen mejor que nadie las prioridades de sus territorios. El papel del departamento debe ser el de articulador, facilitador y garante de que la inversion llegue donde mas se necesita.",
      "Una sola Antioquia no significa una Antioquia uniforme: significa una Antioquia donde cada subregion tiene las condiciones minimas para desarrollar su potencial y donde ningun municipio queda atras por falta de voluntad politica o de inversion publica.",
    ],
    quote:
      "125 municipios, 9 subregiones, una sola Antioquia. El equilibrio territorial es posible.",
  },
  "hub-innovacion": {
    paragraphs: [
      "Cuando se habla de innovacion en Antioquia, la conversacion suele girar en torno a Medellin: Ruta N, el Distrito de Innovacion, las startups del Poblado. Pero la innovacion no puede ser un privilegio metropolitano. Antioquia necesita llevar la cultura de la innovacion a cada rincon del departamento.",
      "En municipios como Santa Rosa de Osos, jovenes emprendedores estan usando tecnologia para optimizar la produccion lechera. En Uraba, cooperativas bananeras experimentan con drones para monitorear plagas. En el Suroeste, caficultores adoptan aplicaciones moviles para rastrear la calidad de su grano desde la finca hasta la taza. La innovacion rural existe, pero necesita apoyo, conectividad y acceso a capital.",
      "La infraestructura digital es tan importante como la infraestructura vial. Un municipio con fibra optica y buena senal de internet puede atraer teletrabajadores, ofrecer telemedicina y dar acceso a educacion virtual de calidad. La pandemia demostro que la conectividad digital no es un lujo: es un derecho y una herramienta de desarrollo.",
      "Antioquia tiene todo para ser un hub de innovacion descentralizado: universidades de calidad, una cultura empresarial arraigada, diversidad de vocaciones productivas y una diaspora de talento antioqueno que esta dispuesta a volver si encuentra condiciones favorables. Lo que falta es una politica publica que articule estos activos y los ponga al servicio de todo el departamento.",
      "Innovar no es solo crear tecnologia: es encontrar nuevas formas de resolver problemas viejos. Y en Antioquia, los problemas viejos de conectividad, acceso a mercados y desigualdad territorial tienen soluciones innovadoras esperando ser implementadas.",
    ],
    quote:
      "La innovacion no puede ser un privilegio metropolitano. Antioquia entera tiene derecho a innovar.",
  },
  "infraestructura-agricultura": {
    paragraphs: [
      "En Antioquia, el campo alimenta al departamento y al pais. Pero el campo antioqueno enfrenta un obstaculo que no tiene que ver con la calidad de la tierra ni con el esfuerzo de los campesinos: las vias. Cuando el asfalto no llega a la finca, el producto no llega al mercado — o llega tarde, danado y a un precio que no compensa el esfuerzo.",
      "Los cafeteros del Suroeste lo saben bien. Antes de la placa huella, perdian hasta el 15% de su cosecha en el trayecto al punto de acopio. Las mulas cargaban el cafe por trochas de barro que en invierno se convertian en trampas. Hoy, con vias terciarias mejoradas, el cafe llega limpio, a tiempo y con mejor precio. La infraestructura no cambio la calidad del grano: cambio la posibilidad de que el grano llegara a su destino.",
      "Lo mismo ocurre con los bananeros de Uraba, los ganaderos del Bajo Cauca, los agricultores del Oriente y los paneleros del Norte. En todos los casos, la ecuacion es la misma: mejor via, menor costo de transporte, mayor rentabilidad, mas incentivo para seguir produciendo. La infraestructura vial es el habilitador invisible de la economia rural.",
      "Pero no se trata solo de vias. Los centros de acopio, las cadenas de frio, los mercados campesinos con infraestructura adecuada y los distritos de riego son complementos esenciales. Una politica de infraestructura para la agricultura debe pensar en toda la cadena: desde la finca hasta el consumidor final, pasando por el transporte, el almacenamiento y la comercializacion.",
      "Cuando la infraestructura llega al campo, el campo se transforma. Y cuando el campo se transforma, Antioquia entera se beneficia. La seguridad alimentaria, la generacion de empleo rural y la reduccion de la pobreza dependen en buena medida de que las vias, los puentes y los servicios basicos lleguen a donde hoy no llegan.",
    ],
    quote:
      "Cuando el asfalto llega al campo, el campo llega al mercado. Asi de simple, asi de transformador.",
  },
  "obras-turismo": {
    paragraphs: [
      "Antioquia tiene tesoros que el mundo aun no conoce. Desde los farallones del Citara en el Suroeste hasta las playas de Necocli en Uraba, pasando por los pueblos patrimoniales de Jardin, Jerico y Santa Fe de Antioquia, el departamento tiene una oferta turistica diversa y autentica que podria posicionarse entre las mejores de America Latina.",
      "Pero el turismo necesita infraestructura. No se trata de construir grandes resorts o complejos hoteleros: se trata de garantizar que el viajero pueda llegar a su destino de manera segura y comoda. Una carretera en buen estado, un puente que no se cierre en invierno, senalizacion adecuada y servicios basicos en las zonas rurales son condiciones minimas para que el turismo funcione como motor de desarrollo.",
      "El caso de Jardin es ilustrativo. Este municipio del Suroeste se ha convertido en uno de los destinos mas visitados de Colombia gracias a su patrimonio arquitectonico, su cultura cafetera y su entorno natural. Pero durante anos, el acceso por carretera fue un obstaculo: vias estrechas, sin pavimentar en largos tramos, que disuadian a muchos visitantes. La mejora vial de los ultimos anos ha sido determinante para el crecimiento turistico del municipio.",
      "El turismo rural y comunitario es una oportunidad enorme para las subregiones de Antioquia. Pero requiere una inversion coordinada entre infraestructura vial, servicios publicos, formacion de talento local y promocion. Los municipios no pueden hacerlo solos: necesitan el respaldo del departamento y una estrategia que articule lo publico con lo privado.",
      "Conectar los tesoros de Antioquia con el mundo no es solo un eslogan: es una politica publica que puede generar empleo, reducir la pobreza y darle a las comunidades rurales una alternativa economica sostenible y digna.",
    ],
    quote:
      "Conectar los tesoros de Antioquia con el mundo: esa es la promesa del turismo bien hecho.",
  },
};

export async function generateStaticParams() {
  return ideas.map((idea) => ({
    slug: idea.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idea = ideas.find((i) => i.slug === slug);

  if (!idea) {
    return { title: "Idea no encontrada" };
  }

  return {
    title: `${idea.title} — Antioquia Piensa`,
    description: idea.description,
  };
}

export default async function IdeaDetailPage({ params }: Props) {
  const { slug } = await params;
  const idea = ideas.find((i) => i.slug === slug);

  if (!idea) {
    notFound();
  }

  const content = ideaContent[slug];

  return (
    <>
      <PageHero title={idea.title} label={`Idea ${idea.number}`} />

      <SectionWrapper>
        <div className="max-w-3xl mx-auto prose-editorial">
          <FadeIn>
            {content ? (
              <>
                {content.paragraphs.slice(0, 2).map((p, i) => (
                  <p
                    key={i}
                    className="font-body text-texto-secundario text-lg leading-relaxed mb-6"
                  >
                    {p}
                  </p>
                ))}

                <PullQuote quote={content.quote} />

                {content.paragraphs.slice(2).map((p, i) => (
                  <p
                    key={i + 2}
                    className="font-body text-texto-secundario text-lg leading-relaxed mb-6"
                  >
                    {p}
                  </p>
                ))}
              </>
            ) : (
              <>
                <p className="font-body text-texto-secundario text-lg leading-relaxed mb-6">
                  {idea.description}
                </p>
                <p className="font-body text-texto-secundario text-lg leading-relaxed mb-6">
                  Contenido en desarrollo.
                </p>
              </>
            )}
          </FadeIn>

          <div className="mt-12">
            <Button href="/antioquia-piensa" variant="secondary">
              Volver a Antioquia Piensa
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
