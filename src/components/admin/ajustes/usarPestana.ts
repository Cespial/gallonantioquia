"use client";

import { useState, useTransition } from "react";
import type { TodosLosAjustes, ClaveAjuste, ValorDe } from "@/lib/ajustes";
import { guardarAjuste } from "@/lib/ajustes/acciones";

/**
 * El estado que tenía `PestanasAjustes` cuando era un solo archivo, ahora una
 * copia por pestaña: cada una arranca del mismo mapa de ajustes y guarda
 * únicamente sus claves, para no pisar lo que otro haya editado en otra
 * pestaña o en otra pantalla.
 */
export function usarPestana(ajustes: TodosLosAjustes) {
  const [valores, setValores] = useState(ajustes);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  function fijar<K extends ClaveAjuste>(clave: K, valor: ValorDe<K>) {
    setValores((previo) => ({ ...previo, [clave]: valor }));
  }

  /** Cada pestaña guarda solo sus claves, para no pisar lo que otro editó. */
  function guardar(claves: ClaveAjuste[]) {
    setMensaje("");
    setError("");

    iniciar(async () => {
      for (const clave of claves) {
        const r = await guardarAjuste(clave, valores[clave] as never);
        if (!r.ok) {
          setError(r.error);
          return;
        }
      }
      setMensaje("Guardado. El sitio ya muestra el cambio.");
    });
  }

  return { valores, fijar, guardar, mensaje, error, pendiente };
}
