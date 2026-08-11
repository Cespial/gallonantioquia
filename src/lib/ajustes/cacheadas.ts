import { unstable_cache } from "next/cache";
import { db } from "@/db";
import {
  consultarAjuste,
  consultarAjustes,
  type ClaveAjuste,
  type TodosLosAjustes,
  type ValorDe,
} from "./index";

export const ETIQUETA_AJUSTES = "ajustes";

export function leerAjuste<K extends ClaveAjuste>(clave: K): Promise<ValorDe<K>> {
  return unstable_cache(() => consultarAjuste(db, clave), ["ajuste", clave], {
    tags: [ETIQUETA_AJUSTES],
  })();
}

export function leerAjustes(): Promise<TodosLosAjustes> {
  return unstable_cache(() => consultarAjustes(db), ["ajustes"], {
    tags: [ETIQUETA_AJUSTES],
  })();
}
