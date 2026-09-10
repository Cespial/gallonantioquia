"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { db } from "@/db";
import { requerirSesion } from "@/lib/auth/sesion";
import { CLAVES } from "./claves";
import {
  escribirAjuste,
  deshacerAjuste as deshacerAjusteEnDb,
  restaurarAjuste as restaurarAjusteEnDb,
  editorPuedeEscribir,
  type ClaveAjuste,
  type ValorDe,
} from "./index";
import { ETIQUETA_AJUSTES } from "./cacheadas";

export type Resultado = { ok: true } | { ok: false; error: string };

export async function guardarAjuste<K extends ClaveAjuste>(
  clave: K,
  valor: ValorDe<K>
): Promise<Resultado> {
  // Una clave que no está en CLAVES no es un ajuste: llega de un cliente
  // desactualizado o de un POST a mano. Se corta antes de tocar la base,
  // donde `CLAVES[clave]` reventaría al leer su esquema.
  if (!(clave in CLAVES)) {
    return { ok: false, error: "Ese ajuste no existe." };
  }

  const actor = await requerirSesion();

  // El editor solo alcanza las claves de campaña y contacto. La pantalla ya le
  // esconde el resto, pero esconder un formulario no impide mandar el POST.
  if (actor.rol !== "admin" && !editorPuedeEscribir(clave)) {
    return { ok: false, error: "Ese ajuste solo lo cambia un administrador." };
  }

  try {
    await escribirAjuste(db, clave, valor, actor.id);
  } catch {
    return { ok: false, error: "Ese valor no tiene la forma que espera este ajuste." };
  }

  revalidateTag(ETIQUETA_AJUSTES);
  // Los ajustes alimentan el encabezado y el pie, que viven en el layout: sin
  // esto, el cambio solo se vería al entrar a una página nueva.
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Deshace el último cambio de una clave. Misma regla de rol que `guardarAjuste`. */
export async function deshacerUltimoCambio(clave: ClaveAjuste): Promise<Resultado> {
  // Misma guardia que en `guardarAjuste`: una clave desconocida no es un ajuste.
  if (!(clave in CLAVES)) {
    return { ok: false, error: "Ese ajuste no existe." };
  }

  const actor = await requerirSesion();

  if (actor.rol !== "admin" && !editorPuedeEscribir(clave)) {
    return { ok: false, error: "Ese ajuste solo lo cambia un administrador." };
  }

  const huboCambio = await deshacerAjusteEnDb(db, clave);
  if (!huboCambio) {
    return { ok: false, error: "No hay nada que deshacer." };
  }

  revalidateTag(ETIQUETA_AJUSTES);
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Vuelve una clave a su valor por defecto. Misma regla de rol que `guardarAjuste`. */
export async function volverAlOriginal(clave: ClaveAjuste): Promise<Resultado> {
  // Misma guardia que en `guardarAjuste`: una clave desconocida no es un ajuste.
  if (!(clave in CLAVES)) {
    return { ok: false, error: "Ese ajuste no existe." };
  }

  const actor = await requerirSesion();

  if (actor.rol !== "admin" && !editorPuedeEscribir(clave)) {
    return { ok: false, error: "Ese ajuste solo lo cambia un administrador." };
  }

  await restaurarAjusteEnDb(db, clave, actor.id);

  revalidateTag(ETIQUETA_AJUSTES);
  revalidatePath("/", "layout");
  return { ok: true };
}
