# Portada editable desde el panel — diseño

**Fecha:** 10 de septiembre de 2026 · **Estado:** aprobado por el usuario (secciones 1 y 2 en chat; sección 3 con aprobación general para cerrar la entrega esta madrugada).

## Objetivo

Que el equipo de campaña cambie, desde `/admin`, **los textos y las fotos de cada franja de la portada** sin tocar código, con la composición, los colores y la tipografía fijos por diseño. Guardar sale al aire de inmediato; cada franja se puede **deshacer** y **volver al original**.

## Alcance

**Dentro:** las once franjas de la portada (`/`): hero, Soy Gallón, video, Así conectamos, Sumamos esfuerzos, mosaico de obras, carácter, Café Gallón, blog (su párrafo de entrada), podcast, foto de equipo y franja de cifras. Textos, listas de viñetas y ranuras de foto. Editores y administradores.

**Fuera:** reordenar u ocultar franjas; colores y tipografía; páginas interiores y sus cabeceras; el logo, el lockup «A paso firme por Antioquia», las tres ilustraciones (semilla, mata de café, canasta), el adorno de la colina, el mapa y las tres portadas gráficas con texto dibujado (Soy Gallón, Café, Blog, Podcast). Un editor en vivo sobre la portada queda como fase posterior sobre esta misma base.

## Modelo de datos

Se amplía el sistema de ajustes existente (`src/lib/ajustes/claves.ts`: clave → esquema Zod + valor por defecto, caché con etiqueta `ajustes`, `guardarAjuste` con permisos por rol). **Una clave por franja, once en total.** El valor por defecto de cada una es, literalmente, el copy y las fotos que hoy están escritos en los componentes: al desplegar, la portada se ve idéntica y no hace falta sembrar nada.

Tipos auxiliares:

```ts
foto  = { medioId: uuid | null, url: string, alt: string, ancho: int | null, alto: int | null }
texto(max) = string con largo tope
lista(max) = string[] con 1..max elementos, cada uno 1..220 caracteres
```

| Clave | Campos |
|---|---|
| `portada.hero` | `palabra` texto(30) «Antioquia» · `subtitulo` texto(220) · `fondo` foto · `retrato` foto |
| `portada.perfil` | `antetitulo` texto(40) · `nombre` texto(30) · `frase` texto(160, admite `**negrita**`) · `semblanzaClara` lista(4) · `semblanzaVerde` lista(4) · `abrazo` foto |
| `portada.video` | `antetitulo` texto(60) · `titular` texto(120) · `parrafo1` texto(400) · `parrafo2` texto(400) · `url` string |
| `portada.conectamos` | `linea1`,`linea2`,`linea3` texto(30) · `frase` texto(160, negrita) · `parrafo` texto(500) · `significaTitulo` texto(80) · `significa` lista(8) · `logramosTitulo` texto(80) · `logramosBajada` texto(200) · `recuperadas` lista(6) |
| `portada.sumamos` | `titular1` texto(120) · `bajada1` texto(200) · `obras` lista(8) · `titular2` texto(120) · `bajada2` texto(200) · `emergencias` lista(10) · `retrato` foto |
| `portada.mosaico` | `fotos` exactamente 6 fotos, una por hueco |
| `portada.caracter` | `titular` texto(200) · `frase` texto(120, negrita) |
| `portada.cafe` | `parrafos` 1..4 × texto(500, negrita) · `fotos` exactamente 2 |
| `portada.blog` | `parrafo` texto(500) |
| `portada.podcast` | `parrafo` texto(500) · `url` string |
| `portada.equipo` | `foto` foto |
| `portada.cifras` | `cifras` 1..3 × {valor, sufijo, etiqueta} · `mensaje` texto(160) · `fondo` foto |

Reglas de texto: `**negrita**` se pinta con `resaltar()` donde la tabla lo dice; en titulares y bajadas, **un salto de línea en el campo es un `<br>` solo en escritorio** (`hidden lg:inline`), que es como hoy se afinan los cortes. Los topes se hacen cumplir en el servidor por el esquema; la pantalla solo avisa.

**Claves que se absorben** (se quitan de `CLAVES`; sus filas quedan en la base e ignoradas): `campana.subtituloHero` → `portada.hero.subtitulo`; `campana.frasePerfil` → `portada.perfil.frase` (también la lee `/quien-es-gallon`); `campana.mensajeCierre` → `portada.cifras.mensaje`; `campana.videoPerfil` → `portada.video.url`; `campana.podcast` → `portada.podcast.url`; `portada.cifras` (lista) → `portada.cifras.cifras`. También se retiran las claves de la versión editorial anterior que solo usaba la pestaña Portada vieja: `portada.tituloHero`, `portada.subtituloHero`, `portada.imagenHero`, `portada.reflexionDestacada`, `portada.franjaFotos`, `portada.seccionesVisibles`. Se quedan `sitio.*`, `sobre.*`, `navegacion.*`, `contacto.*` y `campana.municipios`.

`scripts/migrar-portada.mts` (idempotente, simulacro por defecto, `--aplicar` para escribir) copia cada valor legado guardado dentro de su franja nueva **solo si la clave nueva aún no tiene fila**, y se corre **antes** de desplegar, por la regla de la caché sin caducidad. La lógica vive en `src/lib/ajustes/migracion-portada.ts` para probarla en PGlite.

## Fotos

Cada ranura guarda la instantánea `{ medioId, url, alt, ancho, alto }`: el id para saber que la foto está en uso, el resto para pintar sin consultar. Por defecto `medioId` nulo y la ruta del repositorio (`/images/…`).

- `scripts/sembrar-medios-portada.mts` mete en `medios` las 18 fotos actuales de la portada (16 de `public/images/campana` + las dos de Café Gallón) con su descripción, ancho y alto, `onConflictDoNothing` por url. Así aparecen en la biblioteca y se pueden volver a elegir.
- `contarUsos(db, medioId)` pasa a sumar también los ajustes cuyo `valor::text` contiene `"medioId":"<id>"`. Hoy una foto usada en la portada se puede borrar y dejar el hueco.
- `next.config`: `images.remotePatterns` con `*.public.blob.vercel-storage.com`; sin eso `next/image` rechaza una foto subida por el equipo.
- Las tres ranuras de recorte (hero, abrazo, señala) siguen editables; el campo dice «persona recortada sobre fondo transparente, ≈1200 × 1240». Las demás ranuras muestran su proporción de referencia.

## Historial

Tabla nueva `ajustes_historial` (migración 0004): `id`, `clave`, `valor` jsonb (el valor **anterior**), `actor_id` → usuarios (set null), `creado_en`. `escribirAjuste(db, clave, valor, actorId?)` inserta el valor que reemplaza antes de sobrescribir y conserva los **20** últimos por clave.

- `deshacerAjuste(clave)`: toma la entrada más reciente, la escribe como valor actual **sin** registrar historial y la borra. Es una pila: deshacer varias veces retrocede.
- `restaurarAjuste(clave)`: escribe `porDefecto` registrando historial (se puede deshacer).

## Componentes de la portada

`src/app/(sitio)/page.tsx` sigue leyendo `leerAjustes()` y pasa a cada franja su objeto. Cada componente cambia texto fijo por props; nada de layout cambia. Helper nuevo `src/components/campana/texto.tsx`: `<Lineas texto>` (saltos de escritorio) y reexporta `resaltar`. Las fotos usan `foto.url`, `foto.alt` y, donde el componente daba `width/height`, `foto.ancho/alto` con los valores por defecto de hoy como respaldo.

`/quien-es-gallon` lee la frase de `portada.perfil.frase`.

## El panel

`src/components/admin/PestanasAjustes.tsx` (500 líneas) se parte en `src/components/admin/ajustes/`:

- `PestanasAjustes.tsx`: solo las pestañas y qué rol ve cuál.
- `PestanaEstadoSitio.tsx`, `PestanaSobreMi.tsx`, `PestanaMenu.tsx`, `PestanaContacto.tsx`: lo de hoy, movido sin cambios de comportamiento. La pestaña «Campaña» desaparece (su contenido vive en Video y Podcast); la pestaña «Portada» vieja se reemplaza.
- `PestanaPortada.tsx`: columna con las once franjas en el orden de la portada (nombre en lenguaje del equipo + miniatura) y, al elegir una, su formulario.
- `franjas/<Franja>.tsx`: un archivo por franja. Piezas compartidas: `CampoTexto.tsx` (una o varias líneas, contador de caracteres restantes), `ListaVinetas.tsx` (sobre `ListaEditable`: agregar, quitar, subir, bajar), `RanuraFoto.tsx` (`SelectorImagen` + miniatura + texto de referencia) y `PieFranja.tsx` (Guardar · Deshacer · Volver al original con confirmación en línea · «Ver la portada» al ancla).

Cada franja guarda **solo su clave**. Tras Guardar, Deshacer o Volver al original, el formulario recibe el valor que quedó en la base (`router.refresh()`), y «Deshacer» se apaga cuando `historial` para esa clave es 0. `src/app/admin/ajustes/page.tsx` carga además la lista de `medios` y el conteo de historial por clave.

**Roles:** las once claves `portada.*` entran en `CLAVES_DE_EDITOR`; salen de ella las `campana.*` absorbidas. `guardarAjuste`, `deshacerAjuste` y `restaurarAjuste` comprueban rol con la misma regla. Siguen siendo de administrador «Estado del sitio», «Sobre mí» y «Menú del sitio».

## Pruebas

- `tests/ajustes/portada.test.ts`: cada valor por defecto pasa su esquema; los topes rechazan (lista vacía, texto largo, mosaico con 5 fotos).
- `tests/ajustes/historial.test.ts` (PGlite): escribir registra el anterior; deshacer es pila y no registra; restaurar registra; poda a 20.
- `tests/ajustes/migracion-portada.test.ts` (PGlite): copia legado → nuevo solo si la nueva no existe; idempotente.
- `tests/medios/reglas.test.ts`: `contarUsos` cuenta una foto referenciada en un ajuste.
- `tests/ajustes/permisos.test.ts`: el editor escribe `portada.*` y no `sitio.*`.
- `tests/campana/texto.test.tsx`: `Lineas` parte por salto y `resaltar` marca la negrita (render estático).
- `scripts/verificar-entrega.py`, paso 7: editar el subtítulo del hero, verlo en `/`, Deshacer, ver el original.

## Despliegue

1. Rama `feat/portada-editable`, commits por unidad, push de la rama.
2. Con todo verde en local (vitest + verificador contra `localhost:3000`, que usa la misma base): `npm run db:aplicar` (0004, aditiva), `sembrar-medios-portada.mts --aplicar`, `migrar-portada.mts --aplicar`.
3. Merge a `main` y push **enseguida** (la caché de ajustes se estrena con el despliegue). Verificador contra producción.
4. Guía: nueva sección «Editar la portada», fuera «reflexión destacada» y «Campaña»; PDF regenerado con QA.

## Riesgos aceptados

- Un texto largo o una foto mal recortada pueden afear una franja; los topes, el texto de referencia y «Volver al original» son la red.
- La caché de ajustes sin caducidad: el orden migrar → desplegar es obligatorio.
- El verificador local escribe en la base de producción; termina siempre deshaciendo lo que cambió y producción no lee las claves nuevas hasta el despliegue.
