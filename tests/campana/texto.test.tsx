import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Lineas, resaltar, FraseDorada } from "@/components/campana/texto";

describe("texto de la portada", () => {
  it("un salto en el campo es un <br> solo de escritorio", () => {
    const html = renderToStaticMarkup(<Lineas texto={"Sumamos esfuerzos\ncon propósito."} />);
    expect(html).toContain('<br class="hidden lg:inline"/>');
    expect(html).toContain("Sumamos esfuerzos");
  });

  it("sin salto no mete <br>", () => {
    expect(renderToStaticMarkup(<Lineas texto="Una línea" />)).not.toContain("<br");
  });

  it("resaltar marca la negrita", () => {
    expect(renderToStaticMarkup(<>{resaltar("Las **mejores cosechas** nacen")}</>)).toContain(
      "<strong"
    );
  });

  it("FraseDorada combina negrita y el salto de escritorio de la frase dorada", () => {
    const html = renderToStaticMarkup(
      <FraseDorada
        texto={"Las **mejores cosechas** nacen\ncuando se **trabaja en equipo**."}
      />
    );
    expect(html).toContain("<strong");
    expect(html).toContain('<br class="hidden sm:block"/>');
  });
});
