import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resuelve el alias `@/` de tsconfig.json dentro de las pruebas. Vite lo
  // soporta de forma nativa; el plugin vite-tsconfig-paths ya no hace falta.
  resolve: { tsconfigPaths: true },
  // El tsconfig del proyecto deja `jsx: "preserve"` porque de eso se encarga
  // Next al compilar la app; sin plugin de React, Vite hereda ese "preserve"
  // y dispara "invalid JS syntax" al toparse con JSX crudo en una prueba
  // .tsx. Esta versión de Vite transforma con oxc, no esbuild —de ahí que
  // la opción viva bajo `oxc`, no `esbuild`—, así que las pruebas piden aquí
  // su propio runtime automático de JSX.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    globals: true,
    testTimeout: 30_000,
  },
});
