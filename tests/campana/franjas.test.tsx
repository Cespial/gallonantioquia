import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("next/image", () => ({ default: (p: any) => <img src={p.src} alt={p.alt ?? ""} /> }));
vi.mock("next/link", () => ({ default: (p: any) => <a href={p.href}>{p.children}</a> }));
import { CLAVES_PORTADA } from "@/lib/ajustes/portada";
import Hero from "@/components/campana/Hero";
import Perfil from "@/components/campana/Perfil";
import VideoPerfil from "@/components/campana/VideoPerfil";
import Caracter from "@/components/campana/Caracter";

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
});
