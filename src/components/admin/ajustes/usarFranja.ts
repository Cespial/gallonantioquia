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

  /**
   * Lo que sabemos que tiene el servidor, no lo que mandamos.
   *
   * La diferencia importa: el formulario solo debe rendirse ante un valor del
   * servidor que sea *nuevo* para nosotros —el que devuelve Deshacer, o el que
   * dejó otro editor—. Si el ref guardara «lo enviado», el primer Guardar de
   * una franja recién montada, o el primer Guardar después de un Deshacer, no
   * tendrían con qué comparar y el valor que vuelve pisaría lo que se siga
   * tecleando. Guardando lo que el servidor tiene, siempre hay con qué
   * comparar, desde el primer render.
   *
   * Comparar con `JSON.stringify` es fiable aquí porque los dos lados salen del
   * mismo esquema Zod y en el mismo orden: `consultarAjuste` devuelve lo que
   * parseó el esquema de la franja, el estado local nace de ese mismo `inicial`
   * y `RanuraFoto` arma cada `Foto` en el orden del esquema (medioId, url, alt,
   * ancho, alto). Sin ese orden compartido, dos objetos iguales darían cadenas
   * distintas.
   */
  const ultimoServidor = useRef(JSON.stringify(inicial));

  // Tras `router.refresh()` el servidor vuelve a renderizar la página y el
  // valor fresco llega por `inicial`. Sin esto, deshacer escribía en la base
  // pero el formulario seguía mostrando lo de antes.
  useEffect(() => {
    const llegado = JSON.stringify(inicial);
    // Lo mismo que ya conocíamos: no hay nada que traer, y respetar el estado
    // local conserva lo que se haya tecleado mientras viajaba una petición.
    if (llegado === ultimoServidor.current) return;
    ultimoServidor.current = llegado;
    fijar(inicial);
  }, [inicial]);

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

    // El valor exacto que sale, no el estado: entre el envío y la respuesta se
    // sigue tecleando, y el ref tiene que describir lo que quedó en la base.
    const valorEnviado = valor;
    iniciar(async () => {
      const r = await guardarAjuste(clave, valorEnviado);
      // Si falla no se toca ni el ref ni el estado: lo escrito se queda donde
      // está y el siguiente refresco no tiene por qué pisarlo.
      if (!r.ok) {
        setError(r.error);
        return;
      }
      // Ese es el valor que el servidor tiene ahora, así que el `inicial` que
      // llegue con el refresco ya no será noticia y no pisará el formulario.
      ultimoServidor.current = JSON.stringify(valorEnviado);
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
      // El ref no se toca a propósito: el refresco trae el valor recuperado,
      // que difiere del que conocíamos, y por eso el efecto sí lo aplica.
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
      ultimoServidor.current = JSON.stringify(original);
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
