import { describe, it, expect } from "vitest";
import { LISTA_TIPOS, configPorRutaAdmin } from "@/lib/admin/tipos";

describe("rutas del panel", () => {
  it("cada tipo tiene una ruta de panel única", () => {
    const rutas = LISTA_TIPOS.map((t) => t.rutaAdmin);
    expect(new Set(rutas).size).toBe(rutas.length);
  });

  it("ninguna ruta de tipo choca con una sección fija del panel", () => {
    const fijas = ["medios", "ajustes", "usuarios", "papelera", "login", "nuevo"];
    for (const t of LISTA_TIPOS) {
      expect(fijas, `la ruta ${t.rutaAdmin} choca con una sección fija`).not.toContain(t.rutaAdmin);
    }
  });

  it("resuelve todas las rutas declaradas", () => {
    for (const t of LISTA_TIPOS) {
      expect(configPorRutaAdmin(t.rutaAdmin)?.tipo).toBe(t.tipo);
    }
  });
});
