import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { ajustes } from "@/db/esquema";
import {
  CLAVES,
  conPorDefecto,
  consultarAjuste,
  escribirAjuste,
  type TodosLosAjustes,
} from "@/lib/ajustes";

describe("ajustes", () => {
  it("devuelve el valor por defecto cuando la clave no existe", async () => {
    const { db, cerrar } = await crearDbPrueba();
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(
      CLAVES["sitio.enConstruccion"].porDefecto
    );
    await cerrar();
  });

  it("devuelve el valor guardado", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.enConstruccion", false);
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(false);
    await cerrar();
  });

  it("sobrescribe en vez de duplicar", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.enConstruccion", false);
    await escribirAjuste(db, "sitio.enConstruccion", true);

    const filas = await db.select().from(ajustes);
    expect(filas).toHaveLength(1);
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(true);
    await cerrar();
  });

  it("rechaza un valor que no cumple el esquema de la clave", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await expect(escribirAjuste(db, "sitio.enConstruccion", "sí" as never)).rejects.toThrow();
    await cerrar();
  });

  it("cae al valor por defecto si lo guardado quedó corrupto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    // Escritura directa, saltándose la validación, como si viniera de una
    // versión anterior del esquema.
    await db.insert(ajustes).values({ clave: "sobre.trayectoria", valor: { roto: true } });

    expect(await consultarAjuste(db, "sobre.trayectoria")).toEqual(
      CLAVES["sobre.trayectoria"].porDefecto
    );
    await cerrar();
  });

  it("trae los datos de contacto de la campaña con valores por defecto", async () => {
    const { db, cerrar } = await crearDbPrueba();

    expect(await consultarAjuste(db, "contacto.email")).toBe(CLAVES["contacto.email"].porDefecto);
    expect(await consultarAjuste(db, "contacto.whatsapp")).toBe(
      CLAVES["contacto.whatsapp"].porDefecto
    );
    await cerrar();
  });

  it("guarda el subtítulo del hero y el mensaje de cierre", async () => {
    const { db, cerrar } = await crearDbPrueba();

    // Ese copy ya no es una clave suelta: cada uno es un campo dentro de la
    // franja donde se ve, y la franja se guarda entera.
    const hero = { ...CLAVES["portada.hero"].porDefecto, subtitulo: "Una Antioquia conectada." };
    const cierre = { ...CLAVES["portada.cierre"].porDefecto, mensaje: "Unidos construiremos." };
    await escribirAjuste(db, "portada.hero", hero as never);
    await escribirAjuste(db, "portada.cierre", cierre as never);

    expect((await consultarAjuste(db, "portada.hero")).subtitulo).toBe("Una Antioquia conectada.");
    expect((await consultarAjuste(db, "portada.cierre")).mensaje).toBe("Unidos construiremos.");
    await cerrar();
  });

  it("el municipio del formulario es una lista de nombres", async () => {
    const { db, cerrar } = await crearDbPrueba();

    await escribirAjuste(db, "campana.municipios", ["Támesis", "Andes", "Jardín"]);
    expect(await consultarAjuste(db, "campana.municipios")).toEqual([
      "Támesis",
      "Andes",
      "Jardín",
    ]);
    await expect(escribirAjuste(db, "campana.municipios", [42] as never)).rejects.toThrow();
    await cerrar();
  });

  it("valida la forma de las cifras de portada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const cierre = CLAVES["portada.cierre"].porDefecto;

    await escribirAjuste(db, "portada.cierre", {
      ...cierre,
      cifras: [{ valor: 35, sufijo: "+", etiqueta: "años al servicio de Antioquia" }],
    } as never);
    await expect(
      escribirAjuste(db, "portada.cierre", {
        ...cierre,
        cifras: [{ valor: "treinta y cinco" }],
      } as never)
    ).rejects.toThrow();
    await cerrar();
  });
});

describe("conPorDefecto", () => {
  it("rellena las claves que la caché no traía", () => {
    // El caso real: `leerAjustes` guarda el objeto entero con `unstable_cache`
    // y sin caducidad. Una entrada escrita antes de que existiera
    // `contacto.email` no la trae, y sin relleno llegaría `undefined` a un
    // componente que la declara `string`: 500 en la portada.
    const cacheViejo = { "sitio.enConstruccion": false } as Partial<TodosLosAjustes>;
    const completo = conPorDefecto(cacheViejo);

    expect(completo["sitio.enConstruccion"]).toBe(false);
    expect(completo["contacto.email"]).toBe(CLAVES["contacto.email"].porDefecto);
    expect(completo["portada.hero"]).toEqual(CLAVES["portada.hero"].porDefecto);
    expect(Object.keys(completo).sort()).toEqual(Object.keys(CLAVES).sort());
  });

  it("no pisa un valor guardado que sea falsy", () => {
    const completo = conPorDefecto({ "contacto.email": "" });
    expect(completo["contacto.email"]).toBe("");
  });
});
