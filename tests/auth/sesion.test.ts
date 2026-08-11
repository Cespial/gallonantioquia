import { describe, it, expect, vi, beforeEach } from "vitest";

const obtenerSesion = vi.fn();
vi.mock("@/lib/auth/config", () => ({ auth: () => obtenerSesion() }));

import { requerirSesion, requerirAdmin } from "@/lib/auth/sesion";

const EDITOR = { user: { id: "u1", email: "d@c.co", nombre: "Diego", rol: "editor" } };
const ADMIN = { user: { id: "u2", email: "c@c.co", nombre: "Cristian", rol: "admin" } };

beforeEach(() => obtenerSesion.mockReset());

describe("guardas de sesión", () => {
  it("requerirSesion devuelve el usuario cuando hay sesión", async () => {
    obtenerSesion.mockResolvedValue(EDITOR);
    await expect(requerirSesion()).resolves.toMatchObject({ id: "u1", rol: "editor" });
  });

  it("requerirSesion falla sin sesión", async () => {
    obtenerSesion.mockResolvedValue(null);
    await expect(requerirSesion()).rejects.toThrow("NO_AUTENTICADO");
  });

  it("requerirAdmin acepta a un admin", async () => {
    obtenerSesion.mockResolvedValue(ADMIN);
    await expect(requerirAdmin()).resolves.toMatchObject({ rol: "admin" });
  });

  it("requerirAdmin rechaza a un editor", async () => {
    obtenerSesion.mockResolvedValue(EDITOR);
    await expect(requerirAdmin()).rejects.toThrow("SIN_PERMISO");
  });

  it("requerirAdmin rechaza cuando no hay sesión", async () => {
    obtenerSesion.mockResolvedValue(null);
    await expect(requerirAdmin()).rejects.toThrow("NO_AUTENTICADO");
  });
});
