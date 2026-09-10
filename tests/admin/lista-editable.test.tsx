import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ListaVinetas from "@/components/admin/ajustes/ListaVinetas";

/**
 * `ListaEditable` generaba el `id` de cada fila como `lista-${nombre}-${indice}`,
 * sin distinguir de qué instancia venía: dos `ListaVinetas` apiladas en la misma
 * franja (Perfil, Así conectamos, Sumamos esfuerzos) repetían el mismo `id` —HTML
 * inválido y el `htmlFor` de la segunda lista enfocaba la fila de la primera.
 * Esta prueba reproduce ese apilamiento y verifica que ya no hay `id` repetidos.
 */
describe("ListaEditable: ids de fila entre listas apiladas", () => {
  it("dos ListaVinetas en el mismo árbol no repiten ningún id", () => {
    const html = renderToStaticMarkup(
      <>
        <ListaVinetas
          valores={["Uno", "Dos", "Tres"]}
          max={4}
          etiquetaAgregar="Agregar párrafo"
          alCambiar={() => {}}
        />
        <ListaVinetas
          valores={["Cuatro", "Cinco", "Seis"]}
          max={4}
          etiquetaAgregar="Agregar viñeta"
          alCambiar={() => {}}
        />
      </>
    );

    const ids = Array.from(html.matchAll(/id="([^"]+)"/g)).map((m) => m[1]);
    const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);

    expect(ids.length).toBeGreaterThan(0);
    expect(repetidos).toEqual([]);
  });
});
