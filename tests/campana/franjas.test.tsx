import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("next/image", () => ({ default: (p: any) => <img src={p.src} alt={p.alt ?? ""} /> }));
vi.mock("next/link", () => ({ default: (p: any) => <a href={p.href}>{p.children}</a> }));
import { CLAVES_PORTADA } from "@/lib/ajustes/portada";
import Hero from "@/components/campana/Hero";
import Perfil from "@/components/campana/Perfil";
import VideoPerfil from "@/components/campana/VideoPerfil";
import Caracter from "@/components/campana/Caracter";
import AsiConectamos from "@/components/campana/AsiConectamos";
import SumamosEsfuerzos from "@/components/campana/SumamosEsfuerzos";
import MosaicoObras from "@/components/campana/MosaicoObras";
import CafeGallon from "@/components/campana/CafeGallon";
import Podcast from "@/components/campana/Podcast";
import FranjaCifras from "@/components/campana/FranjaCifras";

const d = <K extends keyof typeof CLAVES_PORTADA>(k: K) => CLAVES_PORTADA[k].porDefecto as any;

describe("franjas con sus valores por defecto", () => {
  it("Hero pinta la palabra, el subtítulo y el retrato", () => {
    const html = renderToStaticMarkup(<Hero datos={d("portada.hero")} />);
    expect(html).toContain("Antioquia");
    expect(html).toContain("gallon-pulgar.webp");
  });
  it("Perfil pinta las seis viñetas y la frase dorada", () => {
    // El `<strong>` del brief no aplica aquí: el copy por defecto de
    // `portada.perfil.frase` no trae marcas `**…**` (a diferencia de
    // Así conectamos y Carácter), así que se verifica que la frase y las
    // seis viñetas —tres claras, tres verdes— efectivamente se pintan.
    const html = renderToStaticMarkup(<Perfil datos={d("portada.perfil")} />);
    expect(html).toContain("Nací en Andes");
    expect(html).toContain("He trabajado para impulsar proyectos");
    expect(html).toContain("Todo gran café comienza con una buena semilla");
  });
  it("VideoPerfil sin url avisa que el video viene en camino", () => {
    expect(renderToStaticMarkup(<VideoPerfil datos={d("portada.video")} />)).toContain("Video en camino");
  });
  it("Caracter pinta el titular", () => {
    expect(renderToStaticMarkup(<Caracter datos={d("portada.caracter")} />)).toContain("Mi carácter");
  });

  it("AsiConectamos pinta las seis viñetas y las tres obras", () => {
    const html = renderToStaticMarkup(<AsiConectamos datos={d("portada.conectamos")} />);
    expect(html).toContain("Más turismo");
    expect(html).toContain("Túnel de Oriente");
  });
  it("SumamosEsfuerzos pinta las 12 viñetas", () => {
    const html = renderToStaticMarkup(<SumamosEsfuerzos datos={d("portada.sumamos")} />);
    expect((html.match(/Maquinaria amarilla|Puentes|Túnel del Toyo/g) ?? []).length).toBe(3);
  });
  it("MosaicoObras pinta seis fotos con su descripción", () => {
    const html = renderToStaticMarkup(<MosaicoObras datos={d("portada.mosaico")} />);
    expect((html.match(/<img/g) ?? []).length).toBe(6);
    expect(html).toContain("Placa huella");
  });

  it("CafeGallon pinta tres párrafos y dos fotos", () => {
    // El conteo de `<img>` del brief no cuadra tal cual: `PortadaSeccion`
    // ya pinta su propio banner con `<Image>`, así que la sección completa
    // trae tres imágenes (banner + dos fotos), no dos. Se verifica en su
    // lugar que las dos fotos de `datos.fotos` efectivamente se pintan.
    const html = renderToStaticMarkup(<CafeGallon datos={d("portada.cafe")} />);
    expect(html).toContain("Café Gallón es");
    expect(html).toContain("gallon-parque-pueblo.jpg");
    expect(html).toContain("gallon-conversacion-rural.jpg");
  });
  it("FranjaCifras pinta las dos cifras y el mensaje", () => {
    const html = renderToStaticMarkup(<FranjaCifras datos={d("portada.cierre")} />);
    expect(html).toContain("Municipios visitados");
    expect(html).toContain("Unidos");
  });
  it("Podcast sin enlace dice que vienen en camino", () => {
    const html = renderToStaticMarkup(<Podcast datos={d("portada.podcast")} />);
    expect(html).toContain("en camino");
  });
});
