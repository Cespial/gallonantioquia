import { describe, it, expect } from "vitest";
import { calcularDimensiones, MAXIMO_LADO } from "@/lib/medios/procesar-imagen";

describe("calcularDimensiones", () => {
  it("no agranda una imagen que ya es pequeña", () => {
    expect(calcularDimensiones(800, 600, MAXIMO_LADO)).toEqual({ ancho: 800, alto: 600 });
  });

  it("reduce una foto apaisada por su ancho", () => {
    expect(calcularDimensiones(4000, 3000, 2000)).toEqual({ ancho: 2000, alto: 1500 });
  });

  it("reduce una foto vertical por su alto", () => {
    expect(calcularDimensiones(3000, 4000, 2000)).toEqual({ ancho: 1500, alto: 2000 });
  });

  it("conserva la proporción en una imagen cuadrada", () => {
    expect(calcularDimensiones(3000, 3000, 2000)).toEqual({ ancho: 2000, alto: 2000 });
  });

  it("redondea a enteros, nunca a cero", () => {
    const r = calcularDimensiones(4001, 3, 2000);
    expect(Number.isInteger(r.ancho)).toBe(true);
    expect(Number.isInteger(r.alto)).toBe(true);
    expect(r.alto).toBeGreaterThanOrEqual(1);
  });

  it("el máximo por defecto es 2000", () => {
    expect(MAXIMO_LADO).toBe(2000);
  });
});
