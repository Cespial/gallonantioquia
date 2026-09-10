import { Fragment } from "react";
import { resaltar } from "./resaltar";
export { resaltar };

/**
 * En los titulares de la portada, un salto de línea escrito en el panel es un
 * <br> solo en escritorio: en móvil el texto fluye. Es como se afinaban los
 * cortes cuando el copy vivía en el código.
 */
export function Lineas({ texto }: { texto: string }) {
  const partes = texto.split("\n");
  return (
    <>
      {partes.map((parte, i) => (
        <Fragment key={i}>
          {i > 0 && <br className="hidden lg:inline" />}
          {parte}
        </Fragment>
      ))}
    </>
  );
}

/**
 * La frase dorada de Perfil, Así Conectamos y Carácter: negrita en los tramos
 * `**marcados**` y, entre líneas escritas con un salto en el panel, el mismo
 * <br> que solo corta en escritorio. Antes cada franja repetía esta mezcla a
 * mano; ahora el copy vive en el panel y sigue viéndose igual.
 */
export function FraseDorada({ texto }: { texto: string }) {
  const partes = texto.split("\n");
  return (
    <>
      {partes.map((parte, i) => (
        <Fragment key={i}>
          {i > 0 && <br className="hidden sm:block" />}
          {resaltar(parte)}
        </Fragment>
      ))}
    </>
  );
}
