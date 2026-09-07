import { describe, it, expect } from "vitest";
import { CLAVES, CLAVES_DE_EDITOR, editorPuedeEscribir } from "@/lib/ajustes";

describe("qué puede tocar un editor", () => {
  it("alcanza campaña y contacto", () => {
    for (const clave of ["campana.videoPerfil", "contacto.whatsapp", "navegacion.redes"]) {
      expect(editorPuedeEscribir(clave), clave).toBe(true);
    }
  });

  it("no alcanza el menú, el modo construcción ni la biografía", () => {
    // Si mañana alguien mete una de estas en la lista, esta prueba lo grita.
    for (const clave of [
      "navegacion.menu",
      "sitio.enConstruccion",
      "sobre.texto",
      "portada.cifras",
    ]) {
      expect(editorPuedeEscribir(clave), clave).toBe(false);
    }
  });

  it("toda clave abierta al editor existe de verdad", () => {
    for (const clave of CLAVES_DE_EDITOR) expect(clave in CLAVES).toBe(true);
  });

  it("una clave nueva nace cerrada", () => {
    // La lista es en blanco: lo que no está, no se puede.
    const abiertas = new Set<string>(CLAVES_DE_EDITOR);
    const cerradas = Object.keys(CLAVES).filter((c) => !abiertas.has(c));
    expect(cerradas.length).toBeGreaterThan(0);
    for (const clave of cerradas) expect(editorPuedeEscribir(clave), clave).toBe(false);
  });
});

describe("navegacion.redes tolera filas viejas", () => {
  it("una fila con solo tres redes conserva las tres", () => {
    // ⚠️ La fila guardada en producción se escribió antes de que existieran
    // facebook y tiktok. Con el objeto estricto, el safeParse fallaba entero y
    // el pie se quedaba sin un solo icono aunque hubiera enlaces guardados.
    const r = CLAVES["navegacion.redes"].esquema.safeParse({
      x: "https://x.com/gallon",
      instagram: "https://instagram.com/gallon",
      youtube: "",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.x).toBe("https://x.com/gallon");
      expect(r.data.instagram).toBe("https://instagram.com/gallon");
      expect(r.data.facebook).toBe("");
      expect(r.data.tiktok).toBe("");
    }
  });
});
