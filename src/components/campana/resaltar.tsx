import { Fragment } from "react";

/**
 * Convierte los tramos marcados con `**dobles asteriscos**` en `<strong>`.
 *
 * Existe para que frases del mockup como «Todo **gran futuro** comienza
 * sembrando una **buena semilla**» sigan siendo editables desde el panel sin
 * perder el contraste de peso del diseño. Si el texto no trae marcas, se
 * devuelve tal cual: quien escriba en el panel sin conocer la convención no
 * rompe nada.
 */
export function resaltar(texto: string) {
  return texto.split(/\*\*(.+?)\*\*/g).map((tramo, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold">
        {tramo}
      </strong>
    ) : (
      <Fragment key={i}>{tramo}</Fragment>
    )
  );
}
