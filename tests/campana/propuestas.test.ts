import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { mensajes } from "@/db/esquema";
import { esquemaPropuesta, guardarPropuesta } from "@/lib/campana/propuestas";

const VALIDA = {
  nombre: "Ana Restrepo",
  email: "ana@correo.co",
  telefono: "3001234567",
  municipio: "Támesis",
  mensaje: "Propongo mejorar la vía entre la cabecera y la vereda La Mesa.",
};

describe("validación de la propuesta ciudadana", () => {
  it("acepta un envío completo", () => {
    expect(esquemaPropuesta.safeParse(VALIDA).success).toBe(true);
  });

  it("el teléfono y el municipio son opcionales", () => {
    const r = esquemaPropuesta.safeParse({ ...VALIDA, telefono: "", municipio: "" });
    expect(r.success).toBe(true);
  });

  it("exige un correo con forma de correo", () => {
    expect(esquemaPropuesta.safeParse({ ...VALIDA, email: "no-es-correo" }).success).toBe(false);
  });

  it("exige nombre y mensaje", () => {
    expect(esquemaPropuesta.safeParse({ ...VALIDA, nombre: "  " }).success).toBe(false);
    expect(esquemaPropuesta.safeParse({ ...VALIDA, mensaje: "" }).success).toBe(false);
  });

  it("rechaza un mensaje desmedido, que solo sirve para llenar la base", () => {
    expect(esquemaPropuesta.safeParse({ ...VALIDA, mensaje: "a".repeat(5001) }).success).toBe(
      false
    );
  });
});

describe("guardado de la propuesta", () => {
  it("guarda el envío y lo deja sin leer", async () => {
    const { db, cerrar } = await crearDbPrueba();

    const r = await guardarPropuesta(db, VALIDA);
    expect(r.ok).toBe(true);

    const [fila] = await db.select().from(mensajes);
    expect(fila.nombre).toBe("Ana Restrepo");
    expect(fila.leido).toBe(false);
    await cerrar();
  });

  it("normaliza el correo y recorta los espacios sobrantes", async () => {
    const { db, cerrar } = await crearDbPrueba();

    await guardarPropuesta(db, { ...VALIDA, email: "  ANA@Correo.CO ", nombre: " Ana  " });

    const [fila] = await db.select().from(mensajes);
    expect(fila.email).toBe("ana@correo.co");
    expect(fila.nombre).toBe("Ana");
    await cerrar();
  });

  it("devuelve los errores por campo sin escribir nada", async () => {
    const { db, cerrar } = await crearDbPrueba();

    const r = await guardarPropuesta(db, { ...VALIDA, email: "roto" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores).toHaveProperty("email");

    expect(await db.select().from(mensajes)).toHaveLength(0);
    await cerrar();
  });
});
