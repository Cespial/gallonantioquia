/**
 * Traduce lo que alguien pegue en el panel a la URL que acepta un `<iframe>`.
 *
 * En el panel se pega el enlace que se copia del navegador, que nunca sirve
 * como `src`: `youtube.com/watch?v=…` devuelve la página entera y el navegador
 * la rechaza por `X-Frame-Options`. Aquí se aceptan las formas que la gente
 * copia de verdad —watch, youtu.be, shorts, live y embed— y también la URL de
 * incrustar ya hecha, por si pegan el `src` de un código de inserción.
 *
 * Devuelve `null` cuando no reconoce el enlace: quien llame decide qué mostrar
 * en su lugar, y así un enlace mal pegado nunca deja un iframe roto al aire.
 */
export function urlIncrustable(url: string): string | null {
  const limpia = url.trim();
  if (!limpia) return null;

  let u: URL;
  try {
    u = new URL(limpia);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const id =
      u.searchParams.get("v") ??
      u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)?.[1] ??
      null;
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.match(/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}
