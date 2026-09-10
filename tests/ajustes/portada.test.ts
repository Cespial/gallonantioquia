import { describe, it, expect } from "vitest";
import { CLAVES_PORTADA, FRANJAS } from "@/lib/ajustes/portada";

describe("esquemas de la portada", () => {
  it("cada valor por defecto pasa su propio esquema", () => {
    for (const [clave, def] of Object.entries(CLAVES_PORTADA)) {
      const r = def.esquema.safeParse(def.porDefecto);
      expect(r.success, `${clave}: ${!r.success ? r.error.message : ""}`).toBe(true);
    }
  });

  it("los valores por defecto traen el copy de hoy", () => {
    expect(CLAVES_PORTADA["portada.hero"].porDefecto.palabra).toBe("Antioquia");
    expect(CLAVES_PORTADA["portada.sumamos"].porDefecto.obras).toHaveLength(5);
    expect(CLAVES_PORTADA["portada.sumamos"].porDefecto.emergencias).toHaveLength(7);
    expect(CLAVES_PORTADA["portada.mosaico"].porDefecto.fotos).toHaveLength(6);
    expect(CLAVES_PORTADA["portada.cafe"].porDefecto.fotos[0].url).toBe("/images/gallon-parque-pueblo.jpg");
  });

  it("los topes rechazan lo que rompería la composición", () => {
    const sumamos = CLAVES_PORTADA["portada.sumamos"];
    expect(sumamos.esquema.safeParse({ ...sumamos.porDefecto, obras: [] }).success).toBe(false);
    const mosaico = CLAVES_PORTADA["portada.mosaico"];
    expect(mosaico.esquema.safeParse({ fotos: mosaico.porDefecto.fotos.slice(0, 5) }).success).toBe(false);
    const hero = CLAVES_PORTADA["portada.hero"];
    expect(hero.esquema.safeParse({ ...hero.porDefecto, subtitulo: "x".repeat(221) }).success).toBe(false);
    // Los enlaces también tienen tope: un pegado accidental no entra entero.
    const video = CLAVES_PORTADA["portada.video"];
    expect(video.esquema.safeParse({ ...video.porDefecto, url: "u".repeat(500) }).success).toBe(true);
    expect(video.esquema.safeParse({ ...video.porDefecto, url: "u".repeat(501) }).success).toBe(false);
    const pod = CLAVES_PORTADA["portada.podcast"];
    expect(pod.esquema.safeParse({ ...pod.porDefecto, url: "u".repeat(501) }).success).toBe(false);
  });

  it("FRANJAS va en el orden de la portada y cubre las doce claves", () => {
    expect(FRANJAS.map((f) => f.clave)).toEqual([
      "portada.hero", "portada.perfil", "portada.video", "portada.conectamos", "portada.sumamos",
      "portada.mosaico", "portada.caracter", "portada.cafe", "portada.blog", "portada.podcast",
      "portada.equipo", "portada.cierre",
    ]);
  });
});
