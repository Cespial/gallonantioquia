"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { db } from "@/db";
import { requerirAdmin } from "@/lib/auth/sesion";
import { escribirAjuste, type ClaveAjuste, type ValorDe } from "./index";
import { ETIQUETA_AJUSTES } from "./cacheadas";

export type Resultado = { ok: true } | { ok: false; error: string };

export async function guardarAjuste<K extends ClaveAjuste>(
  clave: K,
  valor: ValorDe<K>
): Promise<Resultado> {
  await requerirAdmin();

  try {
    await escribirAjuste(db, clave, valor);
  } catch {
    return { ok: false, error: "Ese valor no tiene la forma que espera este ajuste." };
  }

  revalidateTag(ETIQUETA_AJUSTES);
  // Los ajustes alimentan el encabezado y el pie, que viven en el layout: sin
  // esto, el cambio solo se vería al entrar a una página nueva.
  revalidatePath("/", "layout");
  return { ok: true };
}
