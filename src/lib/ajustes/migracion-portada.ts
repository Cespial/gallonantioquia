import { eq } from "drizzle-orm";
import { ajustes } from "@/db/esquema";
import { escribirAjuste } from "./index";
import { CLAVES_PORTADA, type ClavePortada } from "./portada";

/**
 * Qué campo legado alimenta qué franja nueva y bajo qué nombre. `campo` es la
 * llave dentro del objeto de la franja que ese valor reemplaza. Se lee con
 * SQL directo sobre `ajustes` —no a través de `CLAVES`— porque tras la
 * Task 12 esas claves legadas dejan de estar ahí; esta migración sigue
 * necesitando encontrarlas en la tabla cruda.
 */
const MAPEOS = [
  { legado: "campana.subtituloHero", clave: "portada.hero", campo: "subtitulo" },
  { legado: "campana.frasePerfil", clave: "portada.perfil", campo: "frase" },
  { legado: "campana.mensajeCierre", clave: "portada.cierre", campo: "mensaje" },
  { legado: "campana.videoPerfil", clave: "portada.video", campo: "url" },
  { legado: "campana.podcast", clave: "portada.podcast", campo: "url" },
  { legado: "portada.cifras", clave: "portada.cierre", campo: "cifras" },
] as const satisfies readonly { legado: string; clave: ClavePortada; campo: string }[];

export type AccionMigracion = "copiado" | "ya existe" | "sin legado" | "legado inválido";
export type ResultadoMigracion = { clave: string; desde: string; accion: AccionMigracion };

async function leerAjusteCrudo(conexion: any, clave: string): Promise<unknown | undefined> {
  const [fila] = await conexion.select().from(ajustes).where(eq(ajustes.clave, clave));
  return fila?.valor;
}

/**
 * Copia el copy y las fotos que el equipo ya editó en las claves legadas
 * (`campana.*`, `portada.cifras`) hacia las franjas nuevas de `portada.*`.
 * Idempotente: una franja que ya tiene fila propia no se toca, así que
 * correrla varias veces —o después de que alguien edite desde el panel— es
 * seguro.
 *
 * `portada.cierre` recibe dos legados (`mensaje` y `cifras`): se funden en un
 * solo objeto antes de escribir una vez, para no pisarse ni dejar la franja a
 * medias con una segunda escritura.
 *
 * Con `aplicar = false` (simulacro) calcula y devuelve el mismo reporte sin
 * escribir nada.
 */
export async function migrarPortada(conexion: any, aplicar: boolean): Promise<ResultadoMigracion[]> {
  const resultados: ResultadoMigracion[] = [];

  // Agrupadas por franja destino, en el orden en que aparece cada una por
  // primera vez en MAPEOS.
  const porFranja = new Map<ClavePortada, (typeof MAPEOS)[number][]>();
  for (const mapeo of MAPEOS) {
    const grupo = porFranja.get(mapeo.clave) ?? [];
    grupo.push(mapeo);
    porFranja.set(mapeo.clave, grupo);
  }

  // `Array.from`: iterar un Map directamente con `for...of` exige un target
  // ES2015+ o `downlevelIteration`, y este proyecto no fija ninguno de los dos.
  for (const [clave, mapeos] of Array.from(porFranja.entries())) {
    const yaExiste = (await leerAjusteCrudo(conexion, clave)) !== undefined;
    if (yaExiste) {
      for (const m of mapeos) {
        resultados.push({ clave: `${m.clave}.${m.campo}`, desde: m.legado, accion: "ya existe" });
      }
      continue;
    }

    const definicion = CLAVES_PORTADA[clave];
    // Zod expone `.shape` en todo objeto de CLAVES_PORTADA: son z.object(...).
    const forma = (definicion.esquema as { shape: Record<string, { safeParse: (v: unknown) => any }> }).shape;

    const camposCopiados: Record<string, unknown> = {};
    for (const m of mapeos) {
      const valorLegado = await leerAjusteCrudo(conexion, m.legado);
      if (valorLegado === undefined) {
        resultados.push({ clave: `${m.clave}.${m.campo}`, desde: m.legado, accion: "sin legado" });
        continue;
      }

      const revision = forma[m.campo].safeParse(valorLegado);
      if (!revision.success) {
        resultados.push({ clave: `${m.clave}.${m.campo}`, desde: m.legado, accion: "legado inválido" });
        continue;
      }

      camposCopiados[m.campo] = revision.data;
      resultados.push({ clave: `${m.clave}.${m.campo}`, desde: m.legado, accion: "copiado" });
    }

    const hayAlgoQueEscribir = Object.keys(camposCopiados).length > 0;
    if (aplicar && hayAlgoQueEscribir) {
      const valor = { ...definicion.porDefecto, ...camposCopiados };
      await escribirAjuste(conexion, clave, valor as never);
    }
  }

  return resultados;
}
