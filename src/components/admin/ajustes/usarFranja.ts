"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ValorDe } from "@/lib/ajustes";
import { CLAVES_PORTADA, type ClavePortada } from "@/lib/ajustes/portada";
import { guardarAjuste, deshacerUltimoCambio, volverAlOriginal } from "@/lib/ajustes/acciones";

/**
 * El estado de una franja de la portada: el valor que se edita y las tres
 * acciones que puede pedir el equipo.
 *
 * Cada franja es una sola clave de ajustes, así que se guarda entera de un
 * golpe: nadie puede pisar media franja de otro.
 */
export function usarFranja<K extends ClavePortada>(
  clave: K,
  inicial: ValorDe<K>,
  hayHistorial: number
) {
  const router = useRouter();
  const [valor, fijar] = useState<ValorDe<K>>(inicial);
  const [historial, setHistorial] = useState(hayHistorial);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  // Tras `router.refresh()` el servidor vuelve a renderizar la página con el
  // valor fresco y llega por `inicial`. Sin esto, deshacer escribía en la base
  // pero el formulario seguía mostrando lo de antes: había que recargar a mano
  // para ver lo que uno acababa de recuperar.
  useEffect(() => {
    fijar(inicial);
  }, [inicial]);

  useEffect(() => {
    setHistorial(hayHistorial);
  }, [hayHistorial]);

  function guardar() {
    setMensaje("");
    setError("");

    iniciar(async () => {
      const r = await guardarAjuste(clave, valor);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setMensaje("Guardado. El sitio ya muestra el cambio.");
      // Guardar archiva el valor anterior: ya hay algo que deshacer aunque el
      // servidor todavía no haya vuelto con la cuenta nueva.
      setHistorial((n) => n + 1);
      router.refresh();
    });
  }

  function deshacer() {
    setMensaje("");
    setError("");

    iniciar(async () => {
      const r = await deshacerUltimoCambio(clave);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setMensaje("Deshecho. La portada volvió al valor anterior.");
      setHistorial((n) => Math.max(0, n - 1));
      router.refresh();
    });
  }

  function restaurar() {
    setMensaje("");
    setError("");

    iniciar(async () => {
      const r = await volverAlOriginal(clave);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      // El valor por defecto es la portada tal como se lanzó; se pinta ya
      // mismo para no dejar el formulario mostrando lo que se acaba de tirar.
      fijar(CLAVES_PORTADA[clave].porDefecto as ValorDe<K>);
      setMensaje("La franja volvió al diseño de lanzamiento.");
      setHistorial((n) => n + 1);
      router.refresh();
    });
  }

  return {
    valor,
    fijar,
    guardar,
    deshacer,
    restaurar,
    pendiente,
    mensaje,
    error,
    hayHistorial: historial,
  };
}
