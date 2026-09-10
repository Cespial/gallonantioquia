"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ValorDe } from "@/lib/ajustes";
import { CLAVES_PORTADA, type ClavePortada } from "@/lib/ajustes/portada";
import { guardarAjuste, deshacerUltimoCambio, volverAlOriginal } from "@/lib/ajustes/acciones";

/**
 * La forma de un problema de Zod, declarada aquí a mano para no atarse a los
 * tipos internos de la librería: solo se necesitan la ruta y el tope.
 */
type IssueDeZod = {
  code: string;
  path: PropertyKey[];
  minimum?: unknown;
  maximum?: unknown;
  /** Zod 4 lo llama `origin`; las versiones anteriores, `type`. */
  origin?: string;
  type?: string;
};

type RevisionDeZod = { success: true } | { success: false; error: { issues: IssueDeZod[] } };

/** `["semblanzaVerde", 2]` → `semblanzaVerde[2]`, para señalar el campo exacto. */
function rutaLegible(path: PropertyKey[]): string {
  return path.reduce<string>((acumulado, tramo) => {
    if (typeof tramo === "number") return `${acumulado}[${tramo}]`;
    return acumulado ? `${acumulado}.${String(tramo)}` : String(tramo);
  }, "");
}

/**
 * El servidor rechaza en bloque con «Ese valor no tiene la forma que espera
 * este ajuste», que no dice cuál de los quince campos de la franja está mal.
 * Esto traduce el primer problema a algo accionable.
 */
function mensajeDeIssue(issue: IssueDeZod): string {
  const ruta = rutaLegible(issue.path) || "la franja";
  const origen = issue.origin ?? issue.type;

  if (issue.code === "too_small") {
    const minimo = Number(issue.minimum);
    if (origen === "array") return `${ruta}: necesita al menos ${minimo}.`;
    if (minimo >= 1) return `${ruta}: no puede quedar vacío.`;
  }

  if (issue.code === "too_big") {
    const maximo = Number(issue.maximum);
    if (origen === "array") return `${ruta}: admite como máximo ${maximo}.`;
    return `${ruta}: supera los ${maximo} caracteres.`;
  }

  return `${ruta}: no tiene la forma esperada.`;
}

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

  /** Lo último que se mandó al servidor, para reconocerlo cuando vuelva. */
  const enviado = useRef<string | null>(null);

  // Tras `router.refresh()` el servidor vuelve a renderizar la página y el
  // valor fresco llega por `inicial`. Sin esto, deshacer escribía en la base
  // pero el formulario seguía mostrando lo de antes.
  useEffect(() => {
    // Mientras la petición viaja se sigue tecleando: pisar el formulario aquí
    // borraría en silencio lo que se escribió esperando el guardado.
    if (pendiente) return;
    // Si lo que vuelve es exactamente lo que acabamos de mandar, no hay nada
    // que traer, y respetar lo local conserva las teclas posteriores.
    if (enviado.current !== null && enviado.current === JSON.stringify(inicial)) return;
    fijar(inicial);
  }, [inicial, pendiente]);

  // Se re-sincroniza con la identidad de `inicial`, no con el número: cada
  // `router.refresh()` estrena las props. Guardar por primera vez una franja
  // que no tenía fila no archiva nada —`escribirAjuste` solo archiva si había
  // valor previo—, así que el +1 optimista de abajo puede quedar de más, y
  // esta línea es la que lo corrige aunque la cuenta del servidor siga en 0.
  useEffect(() => {
    setHistorial(hayHistorial);
  }, [inicial, hayHistorial]);

  function guardar() {
    setMensaje("");
    setError("");

    // Antes de salir a la red: el esquema de la franja sabe qué está mal y
    // dónde. Una viñeta recién agregada y vacía, o un párrafo pasado de largo,
    // merecen decir qué campo es y no el rechazo genérico del servidor.
    const esquema = CLAVES_PORTADA[clave].esquema as unknown as {
      safeParse: (v: unknown) => RevisionDeZod;
    };
    const revision = esquema.safeParse(valor);
    if (!revision.success) {
      setError(mensajeDeIssue(revision.error.issues[0]));
      return;
    }

    const loQueVa = JSON.stringify(valor);
    iniciar(async () => {
      const r = await guardarAjuste(clave, valor);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      enviado.current = loQueVa;
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
      // Lo que llegue del servidor manda: es justo el valor que se recuperó.
      enviado.current = null;
      setMensaje("Deshecho. La portada volvió al valor anterior.");
      setHistorial((n) => Math.max(0, n - 1));
      router.refresh();
    });
  }

  function restaurar() {
    setMensaje("");
    setError("");

    const original = CLAVES_PORTADA[clave].porDefecto as ValorDe<K>;
    iniciar(async () => {
      const r = await volverAlOriginal(clave);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      // El valor por defecto es la portada tal como se lanzó; se pinta ya
      // mismo para no dejar el formulario mostrando lo que se acaba de tirar.
      fijar(original);
      enviado.current = JSON.stringify(original);
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
