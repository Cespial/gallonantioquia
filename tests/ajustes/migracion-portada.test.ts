import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { ajustes } from "@/db/esquema";
import { migrarPortada } from "@/lib/ajustes/migracion-portada";
import { CLAVES_PORTADA } from "@/lib/ajustes/portada";

// Las filas legadas se insertan a pelo sobre `ajustes` —no con `escribirAjuste`
// ni pasando por `CLAVES`— porque tras la Task 12 esas claves dejan de existir
// ahí: la migración (y esta prueba) solo puede contar con la tabla cruda.
async function sembrarLegado(db: Awaited<ReturnType<typeof crearDbPrueba>>["db"], clave: string, valor: unknown) {
  await db.insert(ajustes).values({ clave, valor });
}

async function leerFila(db: Awaited<ReturnType<typeof crearDbPrueba>>["db"], clave: string) {
  const [fila] = await db.select().from(ajustes).where(eq(ajustes.clave, clave));
  return fila;
}

describe("migrarPortada", () => {
  it("copia cuando hay legado y no hay franja nueva", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await sembrarLegado(db, "campana.frasePerfil", "Una frase legada de campaña.");

    const resultado = await migrarPortada(db, true);

    const entrada = resultado.find((r) => r.desde === "campana.frasePerfil");
    expect(entrada?.accion).toBe("copiado");

    const fila = await leerFila(db, "portada.perfil");
    expect(fila?.valor).toMatchObject({ frase: "Una frase legada de campaña." });
    await cerrar();
  });

  it("no toca la franja cuando la nueva ya existe", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const yaPuesto = { ...CLAVES_PORTADA["portada.perfil"].porDefecto, frase: "Ya la había editado el equipo." };
    await sembrarLegado(db, "portada.perfil", yaPuesto);
    await sembrarLegado(db, "campana.frasePerfil", "Esto no debería pisar nada.");

    const resultado = await migrarPortada(db, true);

    const entrada = resultado.find((r) => r.desde === "campana.frasePerfil");
    expect(entrada?.accion).toBe("ya existe");

    const fila = await leerFila(db, "portada.perfil");
    expect((fila?.valor as { frase: string }).frase).toBe("Ya la había editado el equipo.");
    await cerrar();
  });

  it("reporta «sin legado» cuando no hay fila legada y no crea la franja", async () => {
    const { db, cerrar } = await crearDbPrueba();

    const resultado = await migrarPortada(db, true);

    const entrada = resultado.find((r) => r.desde === "campana.videoPerfil");
    expect(entrada?.accion).toBe("sin legado");
    expect(await leerFila(db, "portada.video")).toBeUndefined();
    await cerrar();
  });

  it("la segunda corrida devuelve solo «ya existe»", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await sembrarLegado(db, "campana.subtituloHero", "Subtítulo legado.");

    await migrarPortada(db, true);
    const segunda = await migrarPortada(db, true);

    for (const r of segunda) {
      if (r.desde === "campana.subtituloHero") expect(r.accion).toBe("ya existe");
    }
    await cerrar();
  });

  it("en simulacro (aplicar=false) reporta pero no escribe", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await sembrarLegado(db, "campana.podcast", "https://podcast.example/gallon");

    const resultado = await migrarPortada(db, false);

    const entrada = resultado.find((r) => r.desde === "campana.podcast");
    expect(entrada?.accion).toBe("copiado");
    expect(await leerFila(db, "portada.podcast")).toBeUndefined();
    await cerrar();
  });

  it("funde mensaje y cifras legados en un único portada.cierre", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await sembrarLegado(db, "campana.mensajeCierre", "Mensaje legado de cierre.");
    await sembrarLegado(db, "portada.cifras", [{ valor: 50, sufijo: "+", etiqueta: "Municipios" }]);

    const resultado = await migrarPortada(db, true);

    const mensaje = resultado.find((r) => r.desde === "campana.mensajeCierre");
    const cifras = resultado.find((r) => r.desde === "portada.cifras");
    expect(mensaje?.accion).toBe("copiado");
    expect(cifras?.accion).toBe("copiado");

    const fila = await leerFila(db, "portada.cierre");
    const valor = fila?.valor as { mensaje: string; cifras: unknown[]; fondo: unknown };
    expect(valor.mensaje).toBe("Mensaje legado de cierre.");
    expect(valor.cifras).toEqual([{ valor: 50, sufijo: "+", etiqueta: "Municipios" }]);
    // El fondo no tiene legado que lo alimente: queda el de siempre.
    expect(valor.fondo).toEqual(CLAVES_PORTADA["portada.cierre"].porDefecto.fondo);
    await cerrar();
  });

  it("reporta «legado inválido» y no lo copia cuando el legado no pasa el esquema nuevo", async () => {
    const { db, cerrar } = await crearDbPrueba();
    // `portada.cierre.cifras` exige al menos una cifra: el arreglo vacío que
    // trae el legado sin editar no pasa el esquema nuevo.
    await sembrarLegado(db, "portada.cifras", []);
    await sembrarLegado(db, "campana.mensajeCierre", "Este sí es válido.");

    const resultado = await migrarPortada(db, true);

    const cifras = resultado.find((r) => r.desde === "portada.cifras");
    expect(cifras?.accion).toBe("legado inválido");

    const fila = await leerFila(db, "portada.cierre");
    const valor = fila?.valor as { mensaje: string; cifras: unknown[] };
    expect(valor.mensaje).toBe("Este sí es válido.");
    // La cifras inválida no se copia: queda la de por defecto.
    expect(valor.cifras).toEqual(CLAVES_PORTADA["portada.cierre"].porDefecto.cifras);
    await cerrar();
  });
});
