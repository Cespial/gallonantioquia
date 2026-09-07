import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import {
  crearUsuario,
  autenticar,
  cambiarPasswordPropia,
  restablecerPassword,
} from "@/lib/auth/usuarios";
import { revisarPasswordNueva, LARGO_MINIMO_PASSWORD } from "@/lib/auth/reglas";

const CUENTA = { email: "prensa@gallon.co", nombre: "Prensa", password: "temporal-2026" };

describe("revisarPasswordNueva", () => {
  it("exige el largo mínimo", () => {
    const r = revisarPasswordNueva("corta", "corta", "temporal-2026");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain(String(LARGO_MINIMO_PASSWORD));
  });

  it("exige que la repetición coincida", () => {
    // Un dedazo sin confirmar deja a la persona fuera de su propia cuenta.
    expect(revisarPasswordNueva("clave-larga-1", "clave-larga-2", "temporal-2026").ok).toBe(
      false
    );
  });

  it("no deja volver a poner la misma", () => {
    expect(revisarPasswordNueva("temporal-2026", "temporal-2026", "temporal-2026").ok).toBe(
      false
    );
  });

  it("acepta una contraseña nueva en regla", () => {
    expect(revisarPasswordNueva("clave-nueva-2026", "clave-nueva-2026", "temporal-2026").ok).toBe(
      true
    );
  });
});

describe("cambio de contraseña", () => {
  it("toda cuenta nueva nace obligada a estrenarla", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const u = await crearUsuario(db, CUENTA);
    expect(u.debeCambiarPassword).toBe(true);
    await cerrar();
  });

  it("sin la contraseña actual no se cambia", async () => {
    // Un computador dejado abierto en la sede no puede bastar para quedarse
    // con la cuenta.
    const { db, cerrar } = await crearDbPrueba();
    const u = await crearUsuario(db, CUENTA);
    const r = await cambiarPasswordPropia(db, u.id, "la-que-no-es", "clave-nueva-2026");
    expect(r.ok).toBe(false);
    expect((await autenticar(db, CUENTA.email, CUENTA.password)).ok).toBe(true);
    await cerrar();
  });

  it("con la actual correcta cambia y levanta la obligación", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const u = await crearUsuario(db, CUENTA);

    const r = await cambiarPasswordPropia(db, u.id, CUENTA.password, "clave-nueva-2026");
    expect(r.ok).toBe(true);

    expect((await autenticar(db, CUENTA.email, CUENTA.password)).ok).toBe(false);
    const entra = await autenticar(db, CUENTA.email, "clave-nueva-2026");
    expect(entra.ok).toBe(true);
    if (entra.ok) expect(entra.usuario.debeCambiarPassword).toBe(false);
    await cerrar();
  });

  it("el restablecimiento del administrador vuelve a obligar el cambio", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const u = await crearUsuario(db, CUENTA);
    await cambiarPasswordPropia(db, u.id, CUENTA.password, "clave-nueva-2026");

    await restablecerPassword(db, u.id, "otra-temporal-2026");
    const entra = await autenticar(db, CUENTA.email, "otra-temporal-2026");
    expect(entra.ok).toBe(true);
    if (entra.ok) expect(entra.usuario.debeCambiarPassword).toBe(true);
    await cerrar();
  });

  it("cambiar la contraseña suelta el bloqueo por intentos fallidos", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const u = await crearUsuario(db, CUENTA);
    for (let i = 0; i < 5; i++) await autenticar(db, CUENTA.email, "mala");
    expect((await autenticar(db, CUENTA.email, CUENTA.password)).ok).toBe(false);

    await cambiarPasswordPropia(db, u.id, CUENTA.password, "clave-nueva-2026");
    expect((await autenticar(db, CUENTA.email, "clave-nueva-2026")).ok).toBe(true);
    await cerrar();
  });
});
