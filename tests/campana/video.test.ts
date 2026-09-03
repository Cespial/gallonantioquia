import { describe, it, expect } from "vitest";
import { urlIncrustable } from "@/lib/campana/video";

const INCRUSTADO = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";

describe("urlIncrustable", () => {
  it("traduce las formas que la gente copia del navegador", () => {
    for (const url of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
      "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      "https://www.youtube.com/live/dQw4w9WgXcQ",
      // El `src` de un código de inserción ya hecho.
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ]) {
      expect(urlIncrustable(url), url).toBe(INCRUSTADO);
    }
  });

  it("tolera los espacios de un pegado descuidado", () => {
    expect(urlIncrustable("  https://youtu.be/dQw4w9WgXcQ  ")).toBe(INCRUSTADO);
  });

  it("reconoce Vimeo", () => {
    expect(urlIncrustable("https://vimeo.com/76979871")).toBe(
      "https://player.vimeo.com/video/76979871"
    );
  });

  it("devuelve null en vez de un iframe roto", () => {
    // Vacío, texto suelto, un enlace de otro sitio y un canal sin video: en
    // todos, la portada muestra la pieza de campaña en vez de un marco muerto.
    for (const url of [
      "",
      "   ",
      "pega aquí el enlace",
      "https://ejemplo.com/video.mp4",
      "https://www.youtube.com/@gallonantioquia",
    ]) {
      expect(urlIncrustable(url), JSON.stringify(url)).toBeNull();
    }
  });
});
