# Portada editable desde el panel — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el equipo edite desde `/admin` los textos y las fotos de las once franjas de la portada, con guardado inmediato, deshacer y volver al original, sin que la portada cambie un píxel el día del despliegue.

**Architecture:** Se amplía el sistema de ajustes existente (clave → esquema Zod + valor por defecto, caché con etiqueta, `guardarAjuste` con permisos por rol) con una clave-objeto por franja cuyo valor por defecto es el copy actual. Los componentes de la portada reciben ese objeto por props. El panel parte `PestanasAjustes.tsx` en un componente por pestaña y, dentro de «Portada», uno por franja sobre cuatro piezas compartidas. Una tabla `ajustes_historial` da deshacer.

**Tech Stack:** Next.js 14 (App Router, Server Actions), TypeScript, Zod, Drizzle + Neon Postgres, PGlite en pruebas, Vitest, Tailwind 3, Playwright (Python) para el verificador.

**Spec:** `docs/superpowers/specs/2026-09-10-portada-editable-design.md`

## Global Constraints

- Nada del layout, colores ni tipografía de la portada cambia: al desplegar con los valores por defecto, la portada es idéntica.
- Todo nombre nuevo de archivo, función, variable y campo va en español, como el resto del repositorio. Comentarios en español, explicando el porqué.
- Tailwind 3: `col-span` solo hasta 12; no inventar utilidades numéricas (ver `docs` y la memoria del proyecto).
- `text-wrap: normal` no existe; para anular `balance` se usa `wrap` (`.titular-sin-balance`).
- Toda escritura de ajustes pasa por `escribirAjuste`; toda acción de servidor pasa por `requerirSesion`/`requerirAdmin` y la lista blanca `CLAVES_DE_EDITOR`.
- La caché de ajustes no caduca: cualquier script que escriba ajustes se corre **antes** de desplegar y se despliega enseguida.
- Cada tarea termina con `npx tsc --noEmit` limpio y `npx vitest run` en verde, y con commit en la rama `feat/portada-editable`. Sin `Co-Authored-By`.
- Commits en español, en presente, contando el porqué.

---

## Mapa de archivos

**Nuevos**
- `src/lib/ajustes/foto.ts` — esquema `foto`, tipo `Foto`, `fotoRepo()`.
- `src/lib/ajustes/portada.ts` — once esquemas, `PORTADA_POR_DEFECTO`, `CLAVES_PORTADA`, tipos `PortadaHero`… `PortadaCifras`, `FRANJAS` (orden, etiqueta, ancla).
- `src/lib/ajustes/migracion-portada.ts` — `migrarPortada(db, aplicar)`.
- `src/lib/medios/semilla-portada.ts` — `MEDIOS_PORTADA`, `sembrarMediosPortada(db)`.
- `src/components/campana/texto.tsx` — `Lineas`, reexporta `resaltar`.
- `src/components/admin/ajustes/PestanasAjustes.tsx` (se mueve desde `src/components/admin/`), `PestanaEstadoSitio.tsx`, `PestanaSobreMi.tsx`, `PestanaMenu.tsx`, `PestanaContacto.tsx`, `PestanaPortada.tsx`, `CampoTexto.tsx`, `ListaVinetas.tsx`, `RanuraFoto.tsx`, `PieFranja.tsx`, `usarFranja.ts`, `franjas/Hero.tsx`, `franjas/Perfil.tsx`, `franjas/Video.tsx`, `franjas/Conectamos.tsx`, `franjas/Sumamos.tsx`, `franjas/Mosaico.tsx`, `franjas/Caracter.tsx`, `franjas/Cafe.tsx`, `franjas/Blog.tsx`, `franjas/Podcast.tsx`, `franjas/Equipo.tsx`, `franjas/Cifras.tsx`.
- `scripts/migrar-portada.mts`, `scripts/sembrar-medios-portada.mts`.
- `src/db/migraciones/0004_*.sql` (generada por drizzle-kit).
- Pruebas: `tests/ajustes/portada.test.ts`, `tests/ajustes/historial.test.ts`, `tests/ajustes/migracion-portada.test.ts`, `tests/campana/texto.test.tsx`, `tests/campana/franjas.test.tsx`.

**Modificados**
- `src/lib/ajustes/claves.ts`, `src/lib/ajustes/index.ts`, `src/lib/ajustes/acciones.ts`, `src/lib/ajustes/cacheadas.ts` (solo si hace falta el tipo).
- `src/db/esquema.ts`.
- `src/lib/medios/reglas.ts`.
- `next.config.mjs`.
- Los doce componentes de `src/components/campana/` de la portada, `src/app/(sitio)/page.tsx`, `src/app/(sitio)/quien-es-gallon/page.tsx`.
- `src/app/admin/ajustes/page.tsx`.
- `tests/ajustes/permisos.test.ts`, `tests/ajustes/ajustes.test.ts`, `tests/medios/reglas.test.ts`.
- `scripts/verificar-entrega.py`, `docs/guia-panel.md`, `docs/guia-panel.pdf`.

---

### Task 1: Esquemas de la portada y valores por defecto

**Files:**
- Create: `src/lib/ajustes/foto.ts`, `src/lib/ajustes/portada.ts`
- Test: `tests/ajustes/portada.test.ts`

**Interfaces:**
- Produces: `foto` (ZodObject), `type Foto = { medioId: string | null; url: string; alt: string; ancho: number | null; alto: number | null }`, `fotoRepo(url, alt, ancho?, alto?)`.
- Produces: `CLAVES_PORTADA` con las once entradas `{ esquema, porDefecto }` bajo las claves `portada.hero` … `portada.cifras`; tipos `PortadaHero`, `PortadaPerfil`, `PortadaVideo`, `PortadaConectamos`, `PortadaSumamos`, `PortadaMosaico`, `PortadaCaracter`, `PortadaCafe`, `PortadaBlog`, `PortadaPodcast`, `PortadaEquipo`, `PortadaCifras`; `FRANJAS: { clave, etiqueta, ancla }[]` en orden de portada.

- [ ] **Step 1: Escribir la prueba que falla**

```ts
// tests/ajustes/portada.test.ts
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
  });

  it("FRANJAS va en el orden de la portada y cubre las once claves", () => {
    expect(FRANJAS.map((f) => f.clave)).toEqual([
      "portada.hero", "portada.perfil", "portada.video", "portada.conectamos", "portada.sumamos",
      "portada.mosaico", "portada.caracter", "portada.cafe", "portada.blog", "portada.podcast",
      "portada.equipo", "portada.cifras",
    ]);
  });
});
```

- [ ] **Step 2: Correrla y verla fallar**

Run: `npx vitest run tests/ajustes/portada.test.ts`
Expected: FAIL — `Cannot find module '@/lib/ajustes/portada'`.

- [ ] **Step 3: Implementar `foto.ts`**

```ts
// src/lib/ajustes/foto.ts
import { z } from "zod";

/**
 * Una ranura de foto guarda la instantánea completa: el id para saber que el
 * medio está en uso (contarUsos lo busca en los ajustes), y url, descripción y
 * medidas para pintar sin consultar. Por defecto `medioId` es nulo y la url
 * es la ruta heredada del repositorio.
 */
export const foto = z.object({
  medioId: z.string().uuid().nullable(),
  url: z.string().min(1),
  alt: z.string(),
  ancho: z.number().int().positive().nullable(),
  alto: z.number().int().positive().nullable(),
});

export type Foto = z.infer<typeof foto>;

export function fotoRepo(url: string, alt: string, ancho: number | null = null, alto: number | null = null): Foto {
  return { medioId: null, url, alt, ancho, alto };
}
```

- [ ] **Step 4: Implementar `portada.ts` con el copy actual como valor por defecto**

Copiar **literalmente** desde los componentes (no reescribir ni «mejorar» el texto). Fuente de cada campo:

| Clave | Campo | Fuente |
|---|---|---|
| hero | `palabra` | `Hero.tsx`: el `<span>` «Antioquia» |
| hero | `subtitulo` | valor por defecto de `campana.subtituloHero` en `claves.ts` |
| hero | `fondo` | `fotoRepo("/images/campana/panorama-cordillera.webp", "", null, null)` |
| hero | `retrato` | `fotoRepo("/images/campana/gallon-pulgar.webp", "Horacio Gallón, candidato a la Gobernación de Antioquia", 1200, 1239)` |
| perfil | `antetitulo`, `nombre` | `Perfil.tsx`: «Soy Horacio», «Gallón» |
| perfil | `frase` | por defecto de `campana.frasePerfil` |
| perfil | `semblanzaClara`, `semblanzaVerde` | `SEMBLANZA_CLARA`, `SEMBLANZA_VERDE` |
| perfil | `abrazo` | `fotoRepo("/images/campana/gallon-abrazo.webp", "Horacio Gallón abraza a una mujer mayor durante un recorrido por Antioquia", 1018, 854)` |
| video | `antetitulo` … `parrafo2` | `VideoPerfil.tsx`: «En sus propias palabras», el `<h2>`, los dos `<p>`; `parrafo2` termina en «pronto lo cuenta él mismo, aquí.» |
| video | `url` | `""` |
| conectamos | `linea1..3` | «Así», «Conectamos», «Antioquia» |
| conectamos | `frase` | `"Las **mejores cosechas** nacen\ncuando se **trabaja en equipo**."` (el `<br>` de escritorio pasa a `\n`) |
| conectamos | `parrafo`, `significaTitulo`, `significa`, `logramosTitulo`, `logramosBajada`, `recuperadas` | `AsiConectamos.tsx`: el `<p>` largo, «Esto significa para los antioqueños:», `SIGNIFICA`, «Logramos que las obras se hicieran.», la bajada con `\n` donde había `<br>`, `RECUPERADAS` |
| sumamos | `titular1`, `bajada1`, `obras`, `titular2`, `bajada2`, `emergencias` | `SumamosEsfuerzos.tsx`, con `\n` donde había `<br className="hidden lg:inline" />` |
| sumamos | `retrato` | `fotoRepo("/images/campana/gallon-senala.webp", "Horacio Gallón señala el valle de Aburrá desde un mirador", 1400, 1232)` |
| mosaico | `fotos` | los seis `{src, alt}` de `OBRAS` en `MosaicoObras.tsx`, en ese orden |
| caracter | `titular`, `frase` | `Caracter.tsx`: el `<h2>` y `"**Antioquia** será nuestra\n**mejor cosecha**"` |
| cafe | `parrafos` | los tres `<p>` de `CafeGallon.tsx`; el tercero con su tramo final en `**…**` |
| cafe | `fotos` | `FOTOS` de `CafeGallon.tsx` (url, alt, ancho, alto) |
| blog | `parrafo` | el `<p>` de `BlogGallon.tsx` |
| podcast | `parrafo`, `url` | el `<p>` de `Podcast.tsx`, `""` |
| equipo | `foto` | `fotoRepo("/images/campana/equipo-cafe.webp", "Horacio Gallón acompañado de cuatro dirigentes antioqueños, tomando café en una finca", 1280, 975)` |
| cifras | `cifras` | `[{ valor: 125, sufijo: "", etiqueta: "Municipios visitados" }, { valor: 10000, sufijo: "+", etiqueta: "Ciudadanos visitados" }]` (lo que hoy hay en la base) |
| cifras | `mensaje` | por defecto de `campana.mensajeCierre` |
| cifras | `fondo` | igual que `hero.fondo` |

```ts
// src/lib/ajustes/portada.ts
import { z } from "zod";
import { foto, fotoRepo } from "./foto";

const texto = (max: number) => z.string().max(max);
const lista = (max: number) => z.array(z.string().min(1).max(220)).min(1).max(max);
const cifra = z.object({ valor: z.number(), sufijo: z.string(), etiqueta: z.string() });

const hero = z.object({ palabra: texto(30), subtitulo: texto(220), fondo: foto, retrato: foto });
const perfil = z.object({
  antetitulo: texto(40), nombre: texto(30), frase: texto(160),
  semblanzaClara: lista(4), semblanzaVerde: lista(4), abrazo: foto,
});
const video = z.object({ antetitulo: texto(60), titular: texto(120), parrafo1: texto(400), parrafo2: texto(400), url: z.string() });
const conectamos = z.object({
  linea1: texto(30), linea2: texto(30), linea3: texto(30), frase: texto(160), parrafo: texto(500),
  significaTitulo: texto(80), significa: lista(8), logramosTitulo: texto(80), logramosBajada: texto(200), recuperadas: lista(6),
});
const sumamos = z.object({
  titular1: texto(120), bajada1: texto(200), obras: lista(8),
  titular2: texto(120), bajada2: texto(200), emergencias: lista(10), retrato: foto,
});
const mosaico = z.object({ fotos: z.array(foto).length(6) });
const caracter = z.object({ titular: texto(200), frase: texto(120) });
const cafe = z.object({ parrafos: z.array(texto(500)).min(1).max(4), fotos: z.array(foto).length(2) });
const blog = z.object({ parrafo: texto(500) });
const podcast = z.object({ parrafo: texto(500), url: z.string() });
const equipo = z.object({ foto });
const cifras = z.object({ cifras: z.array(cifra).min(1).max(3), mensaje: texto(160), fondo: foto });

export type PortadaHero = z.infer<typeof hero>;
export type PortadaPerfil = z.infer<typeof perfil>;
export type PortadaVideo = z.infer<typeof video>;
export type PortadaConectamos = z.infer<typeof conectamos>;
export type PortadaSumamos = z.infer<typeof sumamos>;
export type PortadaMosaico = z.infer<typeof mosaico>;
export type PortadaCaracter = z.infer<typeof caracter>;
export type PortadaCafe = z.infer<typeof cafe>;
export type PortadaBlog = z.infer<typeof blog>;
export type PortadaPodcast = z.infer<typeof podcast>;
export type PortadaEquipo = z.infer<typeof equipo>;
export type PortadaCifras = z.infer<typeof cifras>;

const PANORAMA = fotoRepo("/images/campana/panorama-cordillera.webp", "");

/** El copy y las fotos de hoy, literales: con esto la portada no cambia al desplegar. */
export const CLAVES_PORTADA = {
  "portada.hero": { esquema: hero, porDefecto: { /* … según la tabla … */ } satisfies PortadaHero },
  // … las once, cada una `satisfies` su tipo …
} as const;

/** Orden de la portada, nombre para el equipo y ancla a la que salta «Ver la portada». */
export const FRANJAS = [
  { clave: "portada.hero", etiqueta: "Hero: A paso firme", ancla: "#inicio" },
  { clave: "portada.perfil", etiqueta: "Soy Horacio Gallón", ancla: "#soy-gallon" },
  { clave: "portada.video", etiqueta: "Video: en sus propias palabras", ancla: "#conoce-a-gallon" },
  { clave: "portada.conectamos", etiqueta: "Así conectamos Antioquia", ancla: "#a-paso-firme" },
  { clave: "portada.sumamos", etiqueta: "Sumamos esfuerzos", ancla: "#por-antioquia" },
  { clave: "portada.mosaico", etiqueta: "Mosaico de obras", ancla: "#por-antioquia" },
  { clave: "portada.caracter", etiqueta: "Mi carácter", ancla: "#cafe-gallon" },
  { clave: "portada.cafe", etiqueta: "Café Gallón", ancla: "#cafe-gallon" },
  { clave: "portada.blog", etiqueta: "Blog Gallón", ancla: "#blog" },
  { clave: "portada.podcast", etiqueta: "Podcast", ancla: "#podcast" },
  { clave: "portada.equipo", etiqueta: "Foto de equipo", ancla: "#podcast" },
  { clave: "portada.cifras", etiqueta: "Cifras y cierre", ancla: "#podcast" },
] as const;
export type ClavePortada = (typeof FRANJAS)[number]["clave"];
```

(El `/* … */` de arriba es solo para no repetir 200 líneas en el plan: en el archivo van los valores completos, literales, sin un solo marcador.)

- [ ] **Step 5: Correr la prueba y verla pasar**

Run: `npx vitest run tests/ajustes/portada.test.ts` → PASS (4 pruebas).

- [ ] **Step 6: Commit**

```bash
git add src/lib/ajustes/foto.ts src/lib/ajustes/portada.ts tests/ajustes/portada.test.ts
git commit -m "feat(ajustes): una clave por franja de la portada, con el copy de hoy como valor por defecto"
```

---

### Task 2: Enganchar las claves nuevas en `CLAVES` y en la lista del editor (sin quitar nada todavía)

**Files:**
- Modify: `src/lib/ajustes/claves.ts`
- Test: `tests/ajustes/permisos.test.ts`, `tests/ajustes/ajustes.test.ts`

**Interfaces:**
- Consumes: `CLAVES_PORTADA` de Task 1.
- Produces: `CLAVES` incluye las once `portada.*`; `CLAVES_DE_EDITOR` incluye las once; `TodosLosAjustes["portada.hero"]` etc. tipados.

- [ ] **Step 1: Prueba que falla** — añadir a `tests/ajustes/permisos.test.ts`:

```ts
it("el editor puede escribir cualquier franja de la portada", () => {
  for (const f of FRANJAS) expect(editorPuedeEscribir(f.clave)).toBe(true);
});
it("el editor sigue sin poder apagar el sitio", () => {
  expect(editorPuedeEscribir("sitio.enConstruccion")).toBe(false);
});
```

- [ ] **Step 2: Verla fallar** — `npx vitest run tests/ajustes/permisos.test.ts` → FAIL.

- [ ] **Step 3: Implementar** — en `claves.ts`: `import { CLAVES_PORTADA, FRANJAS } from "./portada";`, `...CLAVES_PORTADA` dentro del objeto `CLAVES` (tras el bloque `campana.*`), y `...FRANJAS.map((f) => f.clave)` dentro de `CLAVES_DE_EDITOR`. Las claves absorbidas y legadas se quitan en Task 12, no aquí.

- [ ] **Step 4: Verde** — `npx vitest run tests/ajustes` y `npx tsc --noEmit`.

- [ ] **Step 5: Commit** — `git commit -m "feat(ajustes): las once franjas de la portada entran en CLAVES y en lo que un editor puede escribir"`.

---

### Task 3: Helper de texto para la portada

**Files:**
- Create: `src/components/campana/texto.tsx`
- Test: `tests/campana/texto.test.tsx`

**Interfaces:**
- Produces: `Lineas({ texto }: { texto: string })` → fragmentos separados por `<br className="hidden lg:inline" />`; reexporta `resaltar` desde `./resaltar`.

- [ ] **Step 1: Prueba**

```tsx
// tests/campana/texto.test.tsx
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Lineas, resaltar } from "@/components/campana/texto";

describe("texto de la portada", () => {
  it("un salto en el campo es un <br> solo de escritorio", () => {
    const html = renderToStaticMarkup(<Lineas texto={"Sumamos esfuerzos\ncon propósito."} />);
    expect(html).toContain('<br class="hidden lg:inline"/>');
    expect(html).toContain("Sumamos esfuerzos");
  });
  it("sin salto no mete <br>", () => {
    expect(renderToStaticMarkup(<Lineas texto="Una línea" />)).not.toContain("<br");
  });
  it("resaltar marca la negrita", () => {
    expect(renderToStaticMarkup(<>{resaltar("Las **mejores cosechas** nacen")}</>)).toContain("<strong");
  });
});
```

- [ ] **Step 2: Fallar** — `npx vitest run tests/campana/texto.test.tsx` (si vitest no procesa TSX, añadir `esbuild: { jsx: "automatic" }` o `react()` en `vitest.config.ts`; comprobar primero cómo está configurado).

- [ ] **Step 3: Implementar**

```tsx
// src/components/campana/texto.tsx
import { Fragment } from "react";
export { resaltar } from "./resaltar";

/**
 * En los titulares de la portada, un salto de línea escrito en el panel es un
 * <br> solo en escritorio: en móvil el texto fluye. Es como se afinaban los
 * cortes cuando el copy vivía en el código.
 */
export function Lineas({ texto }: { texto: string }) {
  const partes = texto.split("\n");
  return (
    <>
      {partes.map((parte, i) => (
        <Fragment key={i}>
          {i > 0 && <br className="hidden lg:inline" />}
          {parte}
        </Fragment>
      ))}
    </>
  );
}
```

- [ ] **Step 4: Verde.** **Step 5: Commit** — `git commit -m "feat(portada): Lineas pinta los saltos del panel como <br> de escritorio"`.

---

### Task 4: Las franjas Hero, Perfil, Video y Carácter reciben su objeto

**Files:**
- Modify: `src/components/campana/Hero.tsx`, `Perfil.tsx`, `VideoPerfil.tsx`, `Caracter.tsx`, `src/app/(sitio)/page.tsx`, `src/app/(sitio)/quien-es-gallon/page.tsx`
- Test: `tests/campana/franjas.test.tsx`

**Interfaces:**
- Consumes: tipos `PortadaHero`, `PortadaPerfil`, `PortadaVideo`, `PortadaCaracter`; `Lineas`, `resaltar`.
- Produces: `Hero({ datos }: { datos: PortadaHero })`, `Perfil({ datos }: { datos: PortadaPerfil })`, `VideoPerfil({ datos }: { datos: PortadaVideo })`, `Caracter({ datos }: { datos: PortadaCaracter })`.

Patrón (igual en las cuatro): el componente deja de importar constantes de texto y de leer props sueltas; recibe `datos` y pinta `datos.campo`. Donde había `<br className="hidden lg:inline" />` dentro de un texto, ahora `<Lineas texto={datos.campo} />`. Donde había `resaltar(frase)`, `resaltar(datos.frase)`. Las fotos: `src={datos.retrato.url}`, `alt={datos.retrato.alt}`, y si el `<Image>` llevaba `width/height`, `width={datos.retrato.ancho ?? 1200} height={datos.retrato.alto ?? 1239}` con los números que tenía antes como respaldo. Nada de `className` cambia.

- [ ] **Step 1: Prueba de humo** (render estático con `next/image` y `next/link` simulados)

```tsx
// tests/campana/franjas.test.tsx
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("next/image", () => ({ default: (p: any) => <img src={p.src} alt={p.alt ?? ""} /> }));
vi.mock("next/link", () => ({ default: (p: any) => <a href={p.href}>{p.children}</a> }));
import { CLAVES_PORTADA } from "@/lib/ajustes/portada";
import Hero from "@/components/campana/Hero";
import Perfil from "@/components/campana/Perfil";
import VideoPerfil from "@/components/campana/VideoPerfil";
import Caracter from "@/components/campana/Caracter";

const d = <K extends keyof typeof CLAVES_PORTADA>(k: K) => CLAVES_PORTADA[k].porDefecto as any;

describe("franjas con sus valores por defecto", () => {
  it("Hero pinta la palabra, el subtítulo y el retrato", () => {
    const html = renderToStaticMarkup(<Hero datos={d("portada.hero")} />);
    expect(html).toContain("Antioquia");
    expect(html).toContain("gallon-pulgar.webp");
  });
  it("Perfil pinta las seis viñetas y la frase con negrita", () => {
    const html = renderToStaticMarkup(<Perfil datos={d("portada.perfil")} />);
    expect(html).toContain("Nací en Andes");
    expect(html).toContain("<strong");
  });
  it("VideoPerfil sin url avisa que el video viene en camino", () => {
    expect(renderToStaticMarkup(<VideoPerfil datos={d("portada.video")} />)).toContain("Video en camino");
  });
  it("Caracter pinta el titular", () => {
    expect(renderToStaticMarkup(<Caracter datos={d("portada.caracter")} />)).toContain("Mi carácter");
  });
});
```

- [ ] **Step 2: Fallar** (props no existen). **Step 3: Refactorizar los cuatro componentes** según el patrón; en `page.tsx`: `<Hero datos={ajustes["portada.hero"]} />`, `<Perfil datos={ajustes["portada.perfil"]} />`, `<VideoPerfil datos={ajustes["portada.video"]} />`, `<Caracter datos={ajustes["portada.caracter"]} />`; en `quien-es-gallon/page.tsx`: `descripcion={ajustes["portada.perfil"].frase}`.

- [ ] **Step 4: Verde** (`vitest` + `tsc`). **Step 5: Commit** — `git commit -m "feat(portada): Hero, Perfil, Video y Carácter leen su franja de los ajustes"`.

---

### Task 5: Las franjas Así conectamos, Sumamos esfuerzos y Mosaico reciben su objeto

**Files:** `src/components/campana/AsiConectamos.tsx`, `SumamosEsfuerzos.tsx`, `MosaicoObras.tsx`, `src/app/(sitio)/page.tsx`; test en `tests/campana/franjas.test.tsx`.

**Interfaces:** `AsiConectamos({ datos }: { datos: PortadaConectamos })`, `SumamosEsfuerzos({ datos }: { datos: PortadaSumamos })`, `MosaicoObras({ datos }: { datos: PortadaMosaico })`.

Mismo patrón que Task 4. Detalles propios:
- `AsiConectamos`: las tres líneas del titular son tres `<span className="block …">` con `datos.linea1/2/3`; `SIGNIFICA.map` → `datos.significa.map`; `RECUPERADAS.map` → `datos.recuperadas.map`; la bajada «Recuperamos proyectos…» con `<Lineas texto={datos.logramosBajada} />`; la frase con `resaltar(datos.frase)` y el `<br className="hidden sm:block" />` desaparece porque el `\n` ya lo trae `Lineas` (usar `<Lineas>` sobre el resultado no es posible con `resaltar`; solución: `datos.frase.split("\n")` y entre partes `<br className="hidden sm:block" />`, cada parte con `resaltar`). Escribir un helper local `FraseDorada({ texto })` en `texto.tsx` que haga exactamente eso y usarlo aquí, en Perfil y en Carácter.
- `SumamosEsfuerzos`: `OBRAS_ESTRATEGICAS` → `datos.obras`, `EMERGENCIAS` → `datos.emergencias`, titulares y bajadas con `<Lineas>`, el retrato con `datos.retrato.url/alt/ancho/alto` (respaldo 1400×1232) en las dos `<Image>` (móvil y escritorio).
- `MosaicoObras`: `OBRAS` se queda solo con `clase` y `vw` por hueco; `src`/`alt` salen de `datos.fotos[i]`.

Pruebas añadidas al mismo archivo:

```tsx
it("AsiConectamos pinta las seis viñetas y las tres obras", () => {
  const html = renderToStaticMarkup(<AsiConectamos datos={d("portada.conectamos")} />);
  expect(html).toContain("Más turismo");
  expect(html).toContain("Túnel de Oriente");
});
it("SumamosEsfuerzos pinta las 12 viñetas", () => {
  const html = renderToStaticMarkup(<SumamosEsfuerzos datos={d("portada.sumamos")} />);
  expect((html.match(/Maquinaria amarilla|Puentes|Túnel del Toyo/g) ?? []).length).toBe(3);
});
it("MosaicoObras pinta seis fotos con su descripción", () => {
  const html = renderToStaticMarkup(<MosaicoObras datos={d("portada.mosaico")} />);
  expect((html.match(/<img/g) ?? []).length).toBe(6);
  expect(html).toContain("Placa huella");
});
```

Commit: `git commit -m "feat(portada): Así conectamos, Sumamos esfuerzos y el mosaico leen su franja de los ajustes"`.

---

### Task 6: Café, Blog, Podcast, Equipo y Cifras reciben su objeto

**Files:** `src/components/campana/CafeGallon.tsx`, `BlogGallon.tsx`, `Podcast.tsx`, `FotoEquipo.tsx`, `FranjaCifras.tsx`, `src/app/(sitio)/page.tsx`; test en `tests/campana/franjas.test.tsx`.

**Interfaces:** `CafeGallon({ datos })`, `BlogGallon({ datos, entradas })`, `Podcast({ datos })`, `FotoEquipo({ datos })`, `FranjaCifras({ datos })` con los tipos `PortadaCafe`, `PortadaBlog`, `PortadaPodcast`, `PortadaEquipo`, `PortadaCifras`.

Detalles: `CafeGallon` pinta `datos.parrafos.map((p) => <p>{resaltar(p)}</p>)` con las clases del `<p>` actual, y `FOTOS` pasa a `datos.fotos` conservando `encuadre` por índice (`[undefined, "object-[60%_center]"]`) y las clases por posición. `FranjaCifras` deja de recibir `cifras` y `mensaje` sueltos: `datos.cifras.slice(0, 2)`… espera: el esquema permite hasta 3 y hoy la franja pinta `slice(0, 2)` con dos pictogramas; se mantiene `slice(0, 2)` y el tercer pictograma no existe, así que el esquema de `cifras` en Task 1 se limita a `.max(2)` (corregir Task 1 en el mismo commit de esta tarea si aún no se hizo). `FotoEquipo` usa `datos.foto.url/alt`. `page.tsx` pasa cada objeto.

Pruebas:

```tsx
it("CafeGallon pinta tres párrafos y dos fotos", () => { /* contiene "Café Gallón es" y 2 <img> */ });
it("FranjaCifras pinta las dos cifras y el mensaje", () => { /* contiene "Municipios visitados" y "Unidos" */ });
it("Podcast sin enlace dice que vienen en camino", () => { /* contiene "en camino" */ });
```
(Escribir las tres con `renderToStaticMarkup` como las anteriores, con las aserciones indicadas en los comentarios.)

Commit: `git commit -m "feat(portada): Café, Blog, Podcast, Equipo y Cifras leen su franja de los ajustes"`.

---

### Task 7: Historial de ajustes: tabla, escritura, deshacer y restaurar

**Files:**
- Modify: `src/db/esquema.ts`, `src/lib/ajustes/index.ts`
- Create: `src/db/migraciones/0004_*.sql` (con `npm run db:generar`)
- Test: `tests/ajustes/historial.test.ts`

**Interfaces:**
- Produces: tabla `ajustesHistorial`; `escribirAjuste(conexion, clave, valor, actorId?: string | null)` registra el anterior y poda a 20; `deshacerAjuste(conexion, clave): Promise<boolean>` (false si no había historial); `restaurarAjuste(conexion, clave, actorId?)`; `contarHistorial(conexion): Promise<Record<string, number>>`.

- [ ] **Step 1: Prueba**

```ts
// tests/ajustes/historial.test.ts
import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { escribirAjuste, consultarAjuste, deshacerAjuste, restaurarAjuste, contarHistorial } from "@/lib/ajustes";
import { ajustesHistorial } from "@/db/esquema";
import { CLAVES } from "@/lib/ajustes/claves";

describe("historial de ajustes", () => {
  it("escribir guarda el valor anterior; la primera escritura no tiene anterior", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "uno");
    expect((await contarHistorial(db))["sitio.mensajeConstruccion"] ?? 0).toBe(0);
    await escribirAjuste(db, "sitio.mensajeConstruccion", "dos");
    expect((await contarHistorial(db))["sitio.mensajeConstruccion"]).toBe(1);
    await cerrar();
  });
  it("deshacer es una pila: vuelve al anterior sin registrar, y avisa cuando ya no hay", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "uno");
    await escribirAjuste(db, "sitio.mensajeConstruccion", "dos");
    await escribirAjuste(db, "sitio.mensajeConstruccion", "tres");
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(true);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("dos");
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(true);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("uno");
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(false);
    await cerrar();
  });
  it("restaurar escribe el valor por defecto y se puede deshacer", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "cambiado");
    await restaurarAjuste(db, "sitio.mensajeConstruccion");
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe(CLAVES["sitio.mensajeConstruccion"].porDefecto);
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(true);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("cambiado");
    await cerrar();
  });
  it("conserva solo los 20 últimos por clave", async () => {
    const { db, cerrar } = await crearDbPrueba();
    for (let i = 0; i < 25; i++) await escribirAjuste(db, "sitio.mensajeConstruccion", `v${i}`);
    expect((await db.select().from(ajustesHistorial)).length).toBe(20);
    await cerrar();
  });
});
```

- [ ] **Step 2: Fallar.** **Step 3: Implementar**

Esquema:
```ts
export const ajustesHistorial = pgTable("ajustes_historial", {
  id: uuid("id").primaryKey().defaultRandom(),
  clave: text("clave").notNull(),
  // El valor que se reemplazó, no el nuevo: deshacer lo devuelve tal cual.
  valor: jsonb("valor").notNull(),
  actorId: uuid("actor_id").references(() => usuarios.id, { onDelete: "set null" }),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ porClave: index("ajustes_historial_clave").on(t.clave, t.creadoEn) }));
```
Generar la migración con `npm run db:generar` (drizzle-kit escribe `0004_*.sql` y actualiza el journal). Comprobar que el SQL solo crea la tabla y el índice.

`index.ts`: leer primero `consultarAjuste` con la clave (usar la consulta cruda de la fila, no el `porDefecto`, para saber si había fila); si había, `insert(ajustesHistorial)`; luego el upsert de siempre; luego podar: `delete … where clave = $1 and id not in (select id … order by creado_en desc limit 20)`. `deshacerAjuste`: seleccionar la fila más reciente de historial para la clave; si no hay, `false`; si hay, upsert su `valor` como actual **sin** registrar y `delete` esa fila; `true`. `restaurarAjuste` = `escribirAjuste(db, clave, CLAVES[clave].porDefecto, actorId)`. `contarHistorial`: `select clave, count(*) group by clave` → objeto.

- [ ] **Step 4: Verde.** **Step 5: Commit** — `git commit -m "feat(ajustes): historial con deshacer en pila y volver al original"`.

---

### Task 8: Acciones de servidor deshacer/restaurar y el actor en guardar

**Files:** `src/lib/ajustes/acciones.ts`; test `tests/ajustes/permisos.test.ts` (solo la regla pura ya cubre el rol; las acciones se prueban en el verificador).

**Interfaces:** `guardarAjuste(clave, valor)` pasa `actor.id` a `escribirAjuste`; `deshacerAjuste(clave): Promise<Resultado & { quedan?: number }>`; `restaurarAjuste(clave): Promise<Resultado>`. Ambas: `requerirSesion`, misma regla de rol que `guardarAjuste`, `revalidateTag(ETIQUETA_AJUSTES)` y `revalidatePath("/")`.

Commit: `git commit -m "feat(ajustes): acciones de deshacer y volver al original con la misma regla de rol"`.

---

### Task 9: Fotos: usos en ajustes, siembra de las 18 fotos y dominios de imagen

**Files:** `src/lib/medios/reglas.ts`, `src/lib/medios/semilla-portada.ts`, `scripts/sembrar-medios-portada.mts`, `next.config.mjs`; tests `tests/medios/reglas.test.ts`.

**Interfaces:** `contarUsos(db, medioId)` suma contenidos vivos + ajustes cuyo `valor::text` contiene `"medioId":"<id>"`; `MEDIOS_PORTADA: { url, nombre, alt, ancho, alto }[]` (18 entradas); `sembrarMediosPortada(db): Promise<number>` (cuántas insertó, `onConflictDoNothing` por url).

- [ ] Prueba nueva en `tests/medios/reglas.test.ts`:
```ts
it("cuenta una foto referenciada desde un ajuste de la portada", async () => {
  const { db, cerrar } = await crearDbPrueba();
  const [medio] = await db.insert(medios).values({ url: "/images/z.jpg", nombre: "z.jpg", alt: "z" }).returning();
  const hero = { ...CLAVES_PORTADA["portada.hero"].porDefecto, retrato: { medioId: medio.id, url: "/images/z.jpg", alt: "z", ancho: 10, alto: 10 } };
  await escribirAjuste(db, "portada.hero", hero);
  expect(await contarUsos(db, medio.id)).toBe(1);
  await cerrar();
});
it("la siembra es idempotente", async () => {
  const { db, cerrar } = await crearDbPrueba();
  expect(await sembrarMediosPortada(db)).toBe(18);
  expect(await sembrarMediosPortada(db)).toBe(0);
  await cerrar();
});
```
- [ ] Implementar: en `contarUsos`, sumar `select count(*) from ajustes where valor::text like '%"medioId":"' || $id || '"%'` (con `sql` de drizzle). `MEDIOS_PORTADA` con las 16 de `public/images/campana` que usa la portada (panorama, pulgar, abrazo, señala, seis obras, equipo-cafe; **no** las ilustraciones, el logo, el lockup ni las portadas gráficas, que no se eligen) más las dos de Café Gallón — en total 18 según la lista del spec; `ancho/alto` leídos con `sharp` no: se escriben a mano desde `identify`/PIL antes (las medidas ya se conocen: 1200×1239, 1018×854, 1400×1232, 1280×975, 1920×1440, 1280×1176, obras 1000×318 etc.; comprobarlas con `python3 -c "from PIL import Image; …"` y pegarlas). Script CLI: `npx tsx --env-file=.env.local scripts/sembrar-medios-portada.mts [--aplicar]`. `next.config.mjs`: `images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] }`.

Commit: `git commit -m "feat(medios): las fotos de la portada cuentan como uso, se siembran en la biblioteca y next/image admite el Blob"`.

---

### Task 10: Migración de las claves legadas a las franjas

**Files:** `src/lib/ajustes/migracion-portada.ts`, `scripts/migrar-portada.mts`; test `tests/ajustes/migracion-portada.test.ts`.

**Interfaces:** `migrarPortada(db, aplicar: boolean): Promise<{ clave: string; desde: string; accion: "copiado" | "ya existe" | "sin legado" }[]>`.

Reglas: para cada par (`campana.subtituloHero` → `portada.hero.subtitulo`, `campana.frasePerfil` → `portada.perfil.frase`, `campana.mensajeCierre` → `portada.cifras.mensaje`, `campana.videoPerfil` → `portada.video.url`, `campana.podcast` → `portada.podcast.url`, `portada.cifras` (array) → `portada.cifras.cifras`): si la fila nueva ya existe → «ya existe»; si no hay fila legada → «sin legado»; si no, construir la franja = `porDefecto` con ese campo reemplazado y (si `aplicar`) `escribirAjuste`. Leer filas legadas con SQL directo sobre `ajustes` (ya no estarán en `CLAVES` tras Task 12), validando con el esquema de la franja.

Pruebas: copia cuando hay legado y no hay nueva; no toca cuando la nueva existe; segunda corrida devuelve solo «ya existe».

Commit: `git commit -m "feat(ajustes): migración idempotente de las claves legadas a las franjas"`.

---

### Task 11: Piezas compartidas del panel y partición de las pestañas actuales

**Files:**
- Create: `src/components/admin/ajustes/CampoTexto.tsx`, `ListaVinetas.tsx`, `RanuraFoto.tsx`, `PieFranja.tsx`, `usarFranja.ts`, `PestanasAjustes.tsx`, `PestanaEstadoSitio.tsx`, `PestanaSobreMi.tsx`, `PestanaMenu.tsx`, `PestanaContacto.tsx`
- Delete: `src/components/admin/PestanasAjustes.tsx` (tras mover)
- Modify: `src/app/admin/ajustes/page.tsx` (import nuevo; carga `medios` y `contarHistorial`)

**Interfaces:**
```tsx
CampoTexto({ id, etiqueta, valor, max, multilinea?, ayuda?, alCambiar }: { id: string; etiqueta: string; valor: string; max: number; multilinea?: boolean; ayuda?: string; alCambiar: (v: string) => void })
ListaVinetas({ valores, max, etiquetaAgregar, alCambiar }: { valores: string[]; max: number; etiquetaAgregar: string; alCambiar: (v: string[]) => void })
RanuraFoto({ etiqueta, valor, referencia, medios, esAdmin, alCambiar }: { etiqueta: string; valor: Foto; referencia: string; medios: Medio[]; esAdmin: boolean; alCambiar: (f: Foto) => void })
PieFranja({ clave, ancla, pendiente, hayHistorial, alGuardar, alDeshacer, alRestaurar, mensaje, error })
usarFranja<K extends ClavePortada>(clave: K, inicial: ValorDe<K>, hayHistorial: number) → { valor, fijar, guardar, deshacer, restaurar, pendiente, mensaje, error, hayHistorial }
```
`RanuraFoto` envuelve `SelectorImagen`: al elegir un `medio`, produce `{ medioId: medio.id, url: medio.url, alt: medio.alt ?? "", ancho: medio.ancho, alto: medio.alto }`; muestra miniatura, `alt` y el texto `referencia`. `usarFranja` llama a `guardarAjuste`/`deshacerAjuste`/`restaurarAjuste` y luego `router.refresh()`; tras deshacer, decrementa `hayHistorial` localmente.

Las cuatro pestañas existentes se mueven **sin cambiar comportamiento**: cortar/pegar el JSX de cada `activa === "…"` a su archivo, con `valores`/`fijar`/`guardar` locales por pestaña (mismo `useState` inicial con sus claves). `PestanasAjustes.tsx` conserva `PESTANAS_DE_EDITOR`, ahora `["Portada", "Contacto y redes"]`, y las de admin `["Estado del sitio", "Sobre mí", "Menú del sitio"]`. La pestaña «Campaña» y la «Portada» vieja **no se mueven**: desaparecen en esta tarea (sus claves salen en Task 12; hasta entonces tsc sigue verde porque nadie las referencia).

Verificación manual: `npm run dev`, entrar a `/admin/ajustes`, guardar «Contacto y redes» y «Estado del sitio» sin cambios → «Guardado…».

Commit: `git commit -m "refactor(admin): las pestañas de Ajustes se parten en un archivo por pestaña y nacen las piezas de franja"`.

---

### Task 12: Pestaña «Portada» con las franjas Hero, Perfil, Video y Carácter; salida de las claves legadas

**Files:** `src/components/admin/ajustes/PestanaPortada.tsx`, `franjas/Hero.tsx`, `franjas/Perfil.tsx`, `franjas/Video.tsx`, `franjas/Caracter.tsx`; `src/lib/ajustes/claves.ts` (quitar `campana.subtituloHero`, `frasePerfil`, `mensajeCierre`, `videoPerfil`, `podcast`, `portada.cifras` (array), `portada.tituloHero`, `subtituloHero`, `imagenHero`, `reflexionDestacada`, `franjaFotos`, `seccionesVisibles`; quitar las `campana.*` de `CLAVES_DE_EDITOR`); `tests/ajustes/ajustes.test.ts` y `permisos.test.ts` si citan claves quitadas.

`PestanaPortada`: `props { ajustes, medios, esAdmin, historial: Record<string, number> }`; estado `franjaActiva` (por defecto la primera); a la izquierda la lista de `FRANJAS` (botones con `aria-current`), a la derecha `switch (franjaActiva)` → el componente de franja. Cada `franjas/X.tsx` recibe `{ inicial, medios, esAdmin, hayHistorial }`, usa `usarFranja`, pinta sus `CampoTexto`/`ListaVinetas`/`RanuraFoto` y termina en `PieFranja`. Referencias de foto: hero.retrato y perfil.abrazo: «Persona recortada sobre fondo transparente (PNG o WebP con alfa), ≈1200 × 1240 px. Sin recorte, saldrá un rectángulo sobre el paisaje.»; hero.fondo: «Paisaje horizontal, ≥1920 × 1080; se oscurece con un velo verde.»

Ejemplo completo de una franja (las demás siguen esta forma):

```tsx
// src/components/admin/ajustes/franjas/Hero.tsx
"use client";
import type { Medio } from "@/types";
import type { PortadaHero } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

export default function FranjaHero({ inicial, medios, esAdmin, hayHistorial }: {
  inicial: PortadaHero; medios: Medio[]; esAdmin: boolean; hayHistorial: number;
}) {
  const f = usarFranja("portada.hero", inicial, hayHistorial);
  return (
    <section className="space-y-5">
      <CampoTexto id="hero-palabra" etiqueta="Palabra grande" valor={f.valor.palabra} max={30}
        alCambiar={(v) => f.fijar({ ...f.valor, palabra: v })} />
      <CampoTexto id="hero-subtitulo" etiqueta="Subtítulo" valor={f.valor.subtitulo} max={220} multilinea
        ayuda="Debajo de la palabra grande. Un salto de línea aquí es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, subtitulo: v })} />
      <RanuraFoto etiqueta="Retrato" valor={f.valor.retrato} medios={medios} esAdmin={esAdmin}
        referencia="Persona recortada sobre fondo transparente (PNG o WebP con alfa), ≈1200 × 1240 px. Sin recorte, saldrá un rectángulo sobre el paisaje."
        alCambiar={(foto) => f.fijar({ ...f.valor, retrato: foto })} />
      <RanuraFoto etiqueta="Paisaje de fondo" valor={f.valor.fondo} medios={medios} esAdmin={esAdmin}
        referencia="Horizontal, ≥1920 × 1080 px. La portada le pone un velo verde encima."
        alCambiar={(foto) => f.fijar({ ...f.valor, fondo: foto })} />
      <PieFranja clave="portada.hero" ancla="#inicio" pendiente={f.pendiente} hayHistorial={f.hayHistorial}
        alGuardar={f.guardar} alDeshacer={f.deshacer} alRestaurar={f.restaurar} mensaje={f.mensaje} error={f.error} />
    </section>
  );
}
```

Verificación: `vitest` + `tsc` verdes; en `npm run dev`, cambiar el subtítulo del hero, Guardar, ver `/`, Deshacer, ver `/`.

Commit: `git commit -m "feat(admin): pestaña Portada con Hero, Soy Gallón, Video y Carácter; fuera las claves legadas"`.

---

### Task 13: Franjas Así conectamos, Sumamos esfuerzos y Mosaico en el panel

**Files:** `franjas/Conectamos.tsx`, `Sumamos.tsx`, `Mosaico.tsx`; `PestanaPortada.tsx` (switch).

Misma forma que el ejemplo de Task 12. `Mosaico`: seis `RanuraFoto` con referencia por hueco («Horizontal 3:2», «Panorámica 3:1», «Horizontal 3:2», «Horizontal 16:9», «Horizontal 2:1», «Vertical 3:4»), cada una fija `fotos[i]`. `Sumamos`: dos `ListaVinetas` con `max` 8 y 10 y el retrato con la misma referencia de recorte. `Conectamos`: tres `CampoTexto` cortos para las líneas del titular, dos `ListaVinetas` (8 y 6).

Commit: `git commit -m "feat(admin): franjas Así conectamos, Sumamos esfuerzos y Mosaico en la pestaña Portada"`.

---

### Task 14: Franjas Café, Blog, Podcast, Equipo y Cifras en el panel

**Files:** `franjas/Cafe.tsx`, `Blog.tsx`, `Podcast.tsx`, `Equipo.tsx`, `Cifras.tsx`; `PestanaPortada.tsx`.

`Cafe`: `parrafos` con `ListaVinetas` (max 4, cada uno multilínea → `ListaVinetas` acepta `multilinea` opcional) y dos `RanuraFoto` («Horizontal 4:3», «Vertical 3:4»). `Cifras`: `ListaEditable` de cifras (campos valor/sufijo/etiqueta, como la pestaña vieja, max 2), `CampoTexto` mensaje, `RanuraFoto` fondo. `Video`/`Podcast` ya tienen su `url` (`CampoTexto` con la ayuda que hoy vive en la pestaña Campaña).

Commit: `git commit -m "feat(admin): franjas Café, Blog, Podcast, Equipo y Cifras completan la pestaña Portada"`.

---

### Task 15: Verificador de entrega, paso 7

**Files:** `scripts/verificar-entrega.py`.

Añadir tras el paso 6 (con la sesión de admin `pg`):

```python
paso("7. Editar la portada desde el panel y deshacer")
pg.goto(f"{BASE}/admin/ajustes", wait_until="networkidle")
pg.locator('[role="tab"]:has-text("Portada"), button:has-text("Portada")').first.click(); pg.wait_for_timeout(600)
pg.get_by_role("button", name=re.compile("Hero")).first.click(); pg.wait_for_timeout(600)
original = pg.input_value("#hero-subtitulo")
pg.fill("#hero-subtitulo", MARCA); pg.locator('button:has-text("Guardar")').first.click(); pg.wait_for_timeout(5000)
publico.goto(f"{BASE}/", wait_until="networkidle")
ok(MARCA in publico.content(), "el subtítulo nuevo del hero ya sale en la portada")
pg.locator('button:has-text("Deshacer")').first.click(); pg.wait_for_timeout(5000)
publico.goto(f"{BASE}/", wait_until="networkidle")
ok(MARCA not in publico.content() and original[:30] in publico.content(), "Deshacer devolvió el subtítulo original a la portada")
```
`BASE` pasa a leerse de `os.environ.get("BASE", "https://gallonantioquia.vercel.app")` para poder correrlo contra `http://localhost:3000`.

Correr contra local: `BASE=http://localhost:3000 CORREO_ADMIN=… CLAVE_ADMIN=… python3 scripts/verificar-entrega.py` → «VERIFICADO».

Commit: `git commit -m "test: el verificador edita el hero desde el panel y deshace"`.

---

### Task 16: Guía y PDF

**Files:** `docs/guia-panel.md`, `docs/guia-panel.pdf`.

En §6 «Ajustes: lo que ustedes manejan»: sustituir el bloque «Campaña» por una subsección «Portada» que explique la lista de franjas, los campos, las listas (agregar/quitar/subir/bajar), las fotos y sus referencias (con la advertencia de los recortes), y los tres botones (Guardar / Deshacer / Volver al original). Video y podcast pasan a «franjas Video y Podcast». En §7 quitar el párrafo de «reflexión destacada». Regenerar el PDF con el mismo pipeline (pandoc → HTML → Chromium → `pdftoppm`) y revisar cada página.

Commit: `git commit -m "docs: la guía explica cómo editar la portada franja por franja"`.

---

### Task 17: Despliegue

1. `npx vitest run` y `npx tsc --noEmit` en verde en la rama; `git push`.
2. `npx drizzle-kit migrate` (= `npm run db:aplicar`) con `.env.local` → crea `ajustes_historial` en Neon.
3. `npx tsx --env-file=.env.local scripts/sembrar-medios-portada.mts --aplicar` → 18 filas.
4. `npx tsx --env-file=.env.local scripts/migrar-portada.mts --aplicar` → informe por clave.
5. `git checkout main && git merge --no-ff feat/portada-editable && git push origin main` **enseguida**.
6. Esperar el despliegue; `CORREO_ADMIN=… CLAVE_ADMIN=… python3 scripts/verificar-entrega.py` contra producción → «VERIFICADO».
7. Capturas de la portada a 1440 antes/después idénticas salvo por lo editado en la prueba (comparación con la captura previa del día).

---

## Self-review

- **Cobertura del spec:** modelo (T1–T2), texto (T3), componentes (T4–T6), historial (T7–T8), fotos y remotePatterns (T9), migración (T10), panel partido y piezas (T11), pestaña Portada completa (T12–T14), roles (T2 y T12), verificador (T15), guía (T16), despliegue (T17). `contarUsos` en T9. `/quien-es-gallon` en T4.
- **Consistencia:** `usarFranja` devuelve `{ valor, fijar, guardar, deshacer, restaurar, pendiente, mensaje, error, hayHistorial }` y así se usa en T12; `RanuraFoto.alCambiar` recibe `Foto`; `deshacerAjuste` del lib devuelve `boolean` y la acción de servidor devuelve `Resultado`.
- **Corrección al spec:** `portada.cifras.cifras` se limita a **2** (la franja solo tiene dos pictogramas); queda anotado en T6 y debe reflejarse en T1.
