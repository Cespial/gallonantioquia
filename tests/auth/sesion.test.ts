import { describe, it, expect, vi, beforeEach } from "vitest";

const obtenerSesion = vi.fn();
vi.mock("@/lib/auth/config", () => ({ auth: () => obtenerSesion() }));

// La guarda consulta si la cuenta todavía usa la clave que le pusieron. Vive en
// su propio módulo justo para poder cambiarla aquí sin levantar una base.
const clavePendiente = vi.fn<(id: string) => Promise<boolean>>();
vi.mock("@/lib/auth/clave-pendiente", () => ({
  tieneClavePendiente: (id: string) => clavePendiente(id),
}));

import { requerirSesion, requerirAdmin } from "@/lib/auth/sesion";

const EDITOR = { user: { id: "u1", email: "d@c.co", nombre: "Diego", rol: "editor" } };
const ADMIN = { user: { id: "u2", email: "c@c.co", nombre: "Cristian", rol: "admin" } };

beforeEach(() => {
  obtenerSesion.mockReset();
  clavePendiente.mockReset();
  clavePendiente.mockResolvedValue(false);
});

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

  it("con la clave sin estrenar no pasa ninguna acción", async () => {
    // El bloqueo va en la puerta común y no en la pantalla: esconder el
    // formulario no impide mandar el POST a mano.
    obtenerSesion.mockResolvedValue(EDITOR);
    clavePendiente.mockResolvedValue(true);
    await expect(requerirSesion()).rejects.toThrow("CLAVE_PENDIENTE");
    await expect(requerirAdmin()).rejects.toThrow("CLAVE_PENDIENTE");
  });

  it("salvo el propio cambio de contraseña, que es quien lo levanta", async () => {
    obtenerSesion.mockResolvedValue(EDITOR);
    clavePendiente.mockResolvedValue(true);
    await expect(
      requerirSesion({ permitirClavePendiente: true })
    ).resolves.toMatchObject({ id: "u1" });
  });
});
