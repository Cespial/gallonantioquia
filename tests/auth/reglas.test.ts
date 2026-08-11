import { describe, it, expect } from "vitest";
import { puedeDesactivar } from "@/lib/auth/reglas";

const admin = { id: "a1", rol: "admin" as const, activo: true };
const otroAdmin = { id: "a2", rol: "admin" as const, activo: true };
const editor = { id: "e1", rol: "editor" as const, activo: true };

describe("reglas de desactivación", () => {
  it("un admin no puede desactivarse a sí mismo", () => {
    const r = puedeDesactivar(admin, "a1", 2);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("a ti");
  });

  it("no se puede desactivar al último admin activo", () => {
    const r = puedeDesactivar(otroAdmin, "a1", 1);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("último administrador");
  });

  it("se puede desactivar a otro admin si queda alguno más", () => {
    expect(puedeDesactivar(otroAdmin, "a1", 2).ok).toBe(true);
  });

  it("se puede desactivar a un editor siempre", () => {
    expect(puedeDesactivar(editor, "a1", 1).ok).toBe(true);
  });
});
