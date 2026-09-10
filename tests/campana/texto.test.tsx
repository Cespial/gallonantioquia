import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Lineas, resaltar, FraseDorada } from "@/components/campana/texto";
import TituloPagina from "@/components/campana/TituloPagina";

describe("texto de la portada", () => {
  it("un salto en el campo es un <br> solo de escritorio, con su espacio detrás", () => {
    const html = renderToStaticMarkup(<Lineas texto={"Sumamos esfuerzos\ncon propósito."} />);
    expect(html).toContain('<br class="hidden lg:inline"/> ');
    expect(html).toContain("Sumamos esfuerzos");
  });

  it("con el <br> oculto —por debajo de lg— las dos partes siguen separadas", () => {
    // Ese `<br>` es `display:none` en móvil: si no hubiera un espacio detrás,
    // el texto se leería «esfuerzoscon». Se quita el tag del HTML para mirar
    // lo que de verdad ve quien navega desde el teléfono.
    const html = renderToStaticMarkup(<Lineas texto={"Sumamos esfuerzos\ncon propósito."} />);
    expect(html.replace(/<br [^>]*\/>/g, "")).toContain("esfuerzos con");
  });

  it("sin salto no mete <br>", () => {
    expect(renderToStaticMarkup(<Lineas texto="Una línea" />)).not.toContain("<br");
  });

  it("resaltar marca la negrita", () => {
    expect(renderToStaticMarkup(<>{resaltar("Las **mejores cosechas** nacen")}</>)).toContain(
      "<strong"
    );
  });

  it("resaltar acepta una clase propia para el <strong>", () => {
    expect(renderToStaticMarkup(<>{resaltar("a **b**", "x")}</>)).toContain('class="x"');
  });

  it("FraseDorada combina negrita y el salto de escritorio de la frase dorada", () => {
    const html = renderToStaticMarkup(
      <FraseDorada
        texto={"Las **mejores cosechas** nacen\ncuando se **trabaja en equipo**."}
      />
    );
    expect(html).toContain("<strong");
    expect(html).toContain('<br class="hidden sm:block"/> ');
    // Igual que en `Lineas`: sin el <br> —por debajo de sm— las dos líneas no
    // pueden quedar pegadas.
    expect(html.replace(/<br [^>]*\/>/g, "")).toContain("nacen cuando");
  });
});

describe("TituloPagina", () => {
  it("la descripción respeta las marcas de negrita del panel", () => {
    // /quien-es-gallon le pasa `ajustes["portada.perfil"].frase`, que se
    // escribe con `**negrita**`: sin `resaltar` los asteriscos se verían.
    const html = renderToStaticMarkup(
      <TituloPagina arriba="Quién es" abajo="Horacio Gallón" descripcion="a **b**" />
    );
    expect(html).toContain("<strong");
    expect(html).not.toContain("**");
  });
});
