import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { usuarios } from "@/db/esquema";
import { crearUsuario, autenticar, MAX_INTENTOS } from "@/lib/auth/usuarios";

const CLAVE = "clave-de-campana-2026";

async function conUsuario() {
  const ctx = await crearDbPrueba();
  const usuario = await crearUsuario(ctx.db, {
    email: "diego@campana.co",
    nombre: "Diego",
    password: CLAVE,
  });
  return { ...ctx, usuario };
}

describe("autenticación", () => {
  it("nunca guarda la contraseña en claro", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, usuario.id));
    expect(fila.passwordHash).not.toContain(CLAVE);
    await cerrar();
  });

  it("normaliza el correo a minúsculas", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await crearUsuario(db, { email: "Walter@Campana.CO", nombre: "Walter", password: CLAVE });
    const r = await autenticar(db, "walter@campana.co", CLAVE);
    expect(r.ok).toBe(true);
    await cerrar();
  });

  it("acepta credenciales correctas y registra el acceso", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    const r = await autenticar(db, "diego@campana.co", CLAVE);

    expect(r.ok).toBe(true);
    const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, usuario.id));
    expect(fila.ultimoAcceso).not.toBeNull();
    expect(fila.intentosFallidos).toBe(0);
    await cerrar();
  });

  it("rechaza la contraseña incorrecta y cuenta el intento", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    const r = await autenticar(db, "diego@campana.co", "equivocada");

    expect(r).toEqual({ ok: false, motivo: "credenciales" });
    const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, usuario.id));
    expect(fila.intentosFallidos).toBe(1);
    await cerrar();
  });

  it("responde igual ante un correo que no existe, sin revelar nada", async () => {
    const { db, cerrar } = await conUsuario();
    const r = await autenticar(db, "nadie@campana.co", CLAVE);
    expect(r).toEqual({ ok: false, motivo: "credenciales" });
    await cerrar();
  });

  it("bloquea la cuenta tras cinco intentos fallidos", async () => {
    const { db, cerrar } = await conUsuario();
    for (let i = 0; i < MAX_INTENTOS; i++) {
      await autenticar(db, "diego@campana.co", "equivocada");
    }

    const r = await autenticar(db, "diego@campana.co", CLAVE);
    expect(r).toEqual({ ok: false, motivo: "bloqueado" });
    await cerrar();
  });

  it("deja entrar de nuevo cuando el bloqueo expira", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    for (let i = 0; i < MAX_INTENTOS; i++) {
      await autenticar(db, "diego@campana.co", "equivocada");
    }
    await db
      .update(usuarios)
      .set({ bloqueadoHasta: new Date(Date.now() - 1000) })
      .where(eq(usuarios.id, usuario.id));

    const r = await autenticar(db, "diego@campana.co", CLAVE);
    expect(r.ok).toBe(true);
    await cerrar();
  });

  it("rechaza a un usuario desactivado aunque la clave sea correcta", async () => {
    const { db, usuario, cerrar } = await conUsuario();
    await db.update(usuarios).set({ activo: false }).where(eq(usuarios.id, usuario.id));

    const r = await autenticar(db, "diego@campana.co", CLAVE);
    expect(r).toEqual({ ok: false, motivo: "inactivo" });
    await cerrar();
  });

  it("exige contraseña de al menos diez caracteres", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await expect(
      crearUsuario(db, { email: "corto@campana.co", nombre: "X", password: "corta" })
    ).rejects.toThrow();
    await cerrar();
  });
});
