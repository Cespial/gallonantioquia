import { Fragment } from "react";
import { resaltar } from "./resaltar";
export { resaltar };

/**
 * En los titulares de la portada, un salto de línea escrito en el panel es un
 * <br> solo en escritorio: en móvil el texto fluye. Es como se afinaban los
 * cortes cuando el copy vivía en el código.
 *
 * ⚠️ El espacio detrás del `<br>` no es cosmético. Por debajo de `lg` ese
 * `<br>` es `display:none`, así que sin el `{" "}` las dos partes quedarían
 * pegadas («articulamosvoluntades»). El copy que vivía en el código lo
 * escribía a mano —`<br className="hidden lg:inline" />{" "}`— y aquí se
 * conserva igual.
 */
export function Lineas({ texto }: { texto: string }) {
  const partes = texto.split("\n");
  return (
    <>
      {partes.map((parte, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <br className="hidden lg:inline" />{" "}
            </>
          )}
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
 *
 * Mismo espacio detrás del `<br>` que en `Lineas`, y por lo mismo: por debajo
 * de `sm` el salto no existe y las dos líneas quedarían pegadas.
 */
export function FraseDorada({ texto }: { texto: string }) {
  const partes = texto.split("\n");
  return (
    <>
      {partes.map((parte, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <br className="hidden sm:block" />{" "}
            </>
          )}
          {resaltar(parte)}
        </Fragment>
      ))}
    </>
  );
}
