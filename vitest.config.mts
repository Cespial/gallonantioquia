import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resuelve el alias `@/` de tsconfig.json dentro de las pruebas. Vite lo
  // soporta de forma nativa; el plugin vite-tsconfig-paths ya no hace falta.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true,
    testTimeout: 30_000,
  },
});
