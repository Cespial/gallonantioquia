import sanitizeHtml from "sanitize-html";

/**
 * Limpia el HTML que produce el editor. Se aplica AL GUARDAR, de modo que
 * en la base de datos nunca haya marcado peligroso y el sitio público pueda
 * renderizar el contenido sin volver a procesarlo.
 */
export function sanitizarHtml(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "u", "s", "h2", "h3", "blockquote", "ul", "ol", "li", "a", "br"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      }),
    },
  });
}
