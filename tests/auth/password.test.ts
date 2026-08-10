import { describe, it, expect } from "vitest";
import { hashearPassword, verificarPassword, HASH_SENUELO } from "@/lib/auth/password";

describe("contraseñas", () => {
  it("el hash no se parece a la contraseña", async () => {
    const hash = await hashearPassword("clave-de-campana-2026");
    expect(hash).not.toContain("clave-de-campana-2026");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("verifica la contraseña correcta", async () => {
    const hash = await hashearPassword("clave-de-campana-2026");
    expect(await verificarPassword("clave-de-campana-2026", hash)).toBe(true);
  });

  it("rechaza la contraseña incorrecta", async () => {
    const hash = await hashearPassword("clave-de-campana-2026");
    expect(await verificarPassword("otra-clave", hash)).toBe(false);
  });

  it("dos hashes de la misma contraseña son distintos", async () => {
    const a = await hashearPassword("igual");
    const b = await hashearPassword("igual");
    expect(a).not.toBe(b);
  });
});

describe("hash señuelo", () => {
  /**
   * El señuelo solo sirve si bcrypt lo acepta como hash y hace el trabajo
   * completo al compararlo. Una cadena arbitraria se rechazaría de inmediato y
   * devolvería el resultado en microsegundos, reabriendo el oráculo de tiempo
   * que delata qué correos existen. Se verifica el formato y no el reloj,
   * porque una prueba cronometrada sería inestable en integración continua.
   */
  it("tiene el formato de un hash bcrypt real, con el mismo coste", () => {
    expect(HASH_SENUELO).toMatch(/^\$2[aby]\$12\$[./A-Za-z0-9]{53}$/);
  });

  it("ninguna contraseña coincide con él", async () => {
    expect(await verificarPassword("clave-de-campana-2026", HASH_SENUELO)).toBe(false);
    expect(await verificarPassword("", HASH_SENUELO)).toBe(false);
  });
});
