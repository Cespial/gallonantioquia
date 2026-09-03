import { unstable_cache } from "next/cache";
import { db } from "@/db";
import {
  conPorDefecto,
  consultarAjuste,
  consultarAjustes,
  CLAVES,
  type ClaveAjuste,
  type TodosLosAjustes,
  type ValorDe,
} from "./index";

export const ETIQUETA_AJUSTES = "ajustes";

export async function leerAjuste<K extends ClaveAjuste>(clave: K): Promise<ValorDe<K>> {
  const valor = await unstable_cache(() => consultarAjuste(db, clave), ["ajuste", clave], {
    tags: [ETIQUETA_AJUSTES],
  })();
  // Ver `conPorDefecto`: la caché no caduca y puede ser anterior a la clave.
  return valor === undefined ? (CLAVES[clave].porDefecto as ValorDe<K>) : valor;
}

export async function leerAjustes(): Promise<TodosLosAjustes> {
  const guardados = await unstable_cache(() => consultarAjustes(db), ["ajustes"], {
    tags: [ETIQUETA_AJUSTES],
  })();
  // Una entrada de caché escrita antes de que existiera una clave nueva no la
  // trae. Sin este relleno, esa clave llega `undefined` y tumba la portada.
  return conPorDefecto(guardados);
}
