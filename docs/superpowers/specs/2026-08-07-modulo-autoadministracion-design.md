# Módulo de autoadministración — Diseño

**Proyecto:** gallonantioquia.vercel.app
**Fecha:** 7 de agosto de 2026
**Estado:** aprobado, pendiente de plan de implementación

---

## 1. Problema

Hoy todo el contenido del sitio está escrito dentro del código, en `src/data/columnas.ts`,
`src/data/columnas-bodies.ts` y `src/data/content.ts`. Publicar una columna exige editar
arreglos de TypeScript, respetar comas y comillas, y hacer `git push`. El documento
`docs/guia-actualizacion.md` le explica ese procedimiento al equipo de campaña.

El procedimiento no se sostiene. El sitio no recibe contenido nuevo desde el 15 de junio de
2026 y la página principal sigue en modo "En construcción". Un equipo de campaña necesita
publicar el mismo día, no abrir un editor de código.

Este diseño reemplaza ese flujo por un panel de administración propio en `/admin`.

## 2. Objetivos

1. Que el equipo de campaña cree, edite, publique, despublique y borre contenido de las seis
   secciones sin tocar código ni esperar un despliegue.
2. Que suba fotos desde el navegador y las reutilice, sin copiar archivos a `public/images/`.
3. Que controle la configuración del sitio: modo construcción, textos e imagen del hero,
   sección "Sobre mí", redes sociales, menú, destacados y franja de fotos.
4. Que el propio equipo dé de alta y de baja a sus usuarios, sin depender de un tercero.

## 3. Fuera de alcance

Excluido a propósito, para que el módulo no crezca sin control:

- Captura de suscriptores del newsletter y del formulario `/participa`.
- Flujo de aprobación editorial (redactor propone, jefe aprueba).
- Historial de versiones de un contenido.
- Publicación programada a fecha futura.
- Comentarios, multi-idioma, analítica propia.

**Deuda conocida que este spec no resuelve:** `src/components/content/NewsletterForm.tsx`
valida el correo, muestra "¡Gracias! Te mantendremos informado" y descarta el dato. No
persiste en ningún lado ni lo envía a ningún servicio. Todo correo dejado desde junio se
perdió. Queda registrado como pendiente separado: o se captura de verdad, o se retira esa
promesa del texto.

## 4. Arquitectura

Se mantiene el stack actual (Next.js 14.2 App Router, React 18, Tailwind 3) y se agregan
cinco piezas:

| Pieza | Elección | Razón |
|---|---|---|
| Base de datos | Neon Postgres | Serverless, integración nativa con Vercel, plan gratuito suficiente |
| Acceso a datos | Drizzle ORM | TypeScript-first, migraciones versionadas, sin peso en runtime |
| Almacenamiento de imágenes | Vercel Blob | Subida directa desde el navegador, servidas por CDN |
| Sesión | Auth.js v5 + bcrypt | Login propio, sin servicio externo ni costo recurrente |
| Editor de texto | Tiptap | Texto enriquecido que produce HTML; el editor no ve Markdown |

No se actualiza la versión de Next.js. El módulo se construye sobre 14.2.

### 4.1 Publicación instantánea

El sitio público sigue siendo Server Components. Las consultas a Postgres se envuelven en
`unstable_cache` con una etiqueta por tipo de contenido (`contenido:columna`,
`contenido:bitacora`, …) más una etiqueta global `ajustes`.

Al guardar o publicar desde el panel, la Server Action correspondiente ejecuta
`revalidateTag` sobre la etiqueta afectada. La página se regenera en segundos, sin rebuild de
Vercel y sin intervención de nadie.

Consecuencia deseada: el visitante recibe HTML cacheado. **No hay una consulta a la base de
datos por visita**, así que el plan gratuito de Neon no se agota con el tráfico de campaña.

## 5. Modelo de datos

Cuatro tablas.

```sql
usuarios
  id             uuid pk
  email          text unique not null
  nombre         text not null
  password_hash  text not null
  rol            text not null            -- 'admin' | 'editor'
  activo         boolean not null default true
  creado_en      timestamptz not null default now()
  ultimo_acceso  timestamptz

contenidos
  id             uuid pk
  tipo           text not null            -- ver 5.1
  slug           text not null
  titulo         text not null
  resumen        text
  cuerpo_html    text
  imagen_id      uuid references medios(id)
  fecha          date not null
  categoria      text                     -- taxonomía por tipo, ver 5.2
  estado         text not null default 'borrador'   -- 'borrador' | 'publicado'
  destacado      boolean not null default false
  orden          integer not null default 0
  extra          jsonb not null default '{}'
  autor_id       uuid references usuarios(id)
  creado_en      timestamptz not null default now()
  actualizado_en timestamptz not null default now()
  eliminado_en   timestamptz              -- borrado suave

  -- índice único parcial: el slug es único por tipo entre lo no borrado,
  -- de modo que borrar y recrear con el mismo slug sea posible
  create unique index on contenidos (tipo, slug) where eliminado_en is null;

medios
  id             uuid pk
  url            text not null            -- Blob remoto o ruta local /images/…
  nombre         text not null
  alt            text
  ancho          integer
  alto           integer
  peso_bytes     integer
  subido_por     uuid references usuarios(id)
  creado_en      timestamptz not null default now()

ajustes
  clave          text pk
  valor          jsonb not null
  actualizado_en timestamptz not null default now()
```

### 5.1 Una tabla, seis secciones

`contenidos` sirve a las seis secciones mediante el discriminador `tipo`:

| `tipo` | Sección | Ruta pública |
|---|---|---|
| `columna` | Huellas en Antioquia | `/columnas` |
| `bitacora` | Bitácora | `/bitacora` |
| `historia` | Territorio Vivo | `/territorio-vivo` |
| `idea` | Antioquia Piensa | `/antioquia-piensa` |
| `voz` | Voces (columnas invitadas) | `/voces` |
| `episodio` | Un Café | `/un-cafe` |

Los campos propios de cada tipo viven en `extra` (jsonb):

| `tipo` | Campos en `extra` |
|---|---|
| `columna` | `sourceUrl`, `readTime` |
| `bitacora` | `readTime` |
| `historia` | `readTime`, `format` (`texto`\|`video`\|`audio`\|`fotografia`) |
| `idea` | `number` (`"01"`…) |
| `voz` | `authorName`, `authorRole`, `authorCategory`, `authorImage`, `pullQuote` |
| `episodio` | `number`, `guest`, `guestRole`, `format[]` |

**Por qué una sola tabla.** Las seis secciones comparten el 80 % de sus campos y todas
necesitan exactamente la misma operación: listar, buscar, filtrar por estado, crear, editar,
publicar, despublicar, borrar. Con el discriminador construyo **una pantalla de CRUD
parametrizada por tipo**, no seis casi idénticas. Agregar una sección futura pasa a ser una
entrada en un archivo de configuración, no una tabla, una migración y una pantalla nuevas.

El costo de la decisión es que los campos de `extra` no tienen validación en la base de
datos. Se compensa con un esquema Zod por tipo, validado en la Server Action antes de
escribir. La configuración de cada tipo —etiqueta en español, campos de `extra`, taxonomía,
ruta pública— vive en un solo archivo, `src/lib/admin/tipos.ts`, que es la fuente de verdad
tanto para el formulario del panel como para la validación.

### 5.2 Taxonomías

`categoria` guarda la taxonomía y su significado depende del tipo:

- `columna`: año de publicación (`2026`, `2022`, `2021`).
- `bitacora`: tag (`Liderazgo`, `Servicio Público`, `Territorio`, `Decisiones`, `Aprendizajes`).
- `historia`: categoría (`Comunidades`, `Líderes Locales`, `Campo y Empresa`, `Crónicas de Viaje`, `Conectividad`).
- `idea`, `voz`, `episodio`: sin taxonomía.

Los valores disponibles por tipo se declaran en `src/lib/admin/tipos.ts`. El panel ofrece la
lista y permite agregar un valor nuevo sobre la marcha.

### 5.3 Borrado suave

`eliminado_en` marca lo borrado en vez de eliminar la fila. El panel expone una papelera con
opción de restaurar. Todas las consultas del sitio público y de los listados del panel filtran
`eliminado_en is null`. Es barato y evita que un error irreversible de un usuario no técnico
cueste una columna.

## 6. El panel

```
/admin/login              público
/admin                    resumen: publicado por sección, borradores pendientes, últimos cambios
/admin/columnas           las seis secciones usan la misma pantalla parametrizada
/admin/bitacora
/admin/historias
/admin/ideas
/admin/voces
/admin/un-cafe
/admin/medios             biblioteca de imágenes
/admin/ajustes            configuración del sitio
/admin/papelera           contenido borrado, con restaurar
/admin/usuarios           solo rol admin
```

### 6.1 Pantalla de sección

**Listado:** tabla con título, estado, fecha y autor. Buscador por título. Filtro por estado
(todos / publicados / borradores) y por taxonomía cuando el tipo la tenga. Botón "Nueva".

El orden de presentación depende del tipo. `idea` y `episodio` están numerados y se ordenan
por el campo `orden`, reordenable arrastrando en el listado. Los demás tipos se ordenan por
`fecha` descendente y no exponen arrastre.

**Editor:** título, slug (autogenerado desde el título, editable), resumen, foto de portada
(elegida de la biblioteca o subida en el momento), cuerpo en texto enriquecido, fecha,
taxonomía, marca de destacado, y los campos de `extra` que corresponda al tipo.

Dos acciones: **Guardar borrador** y **Publicar**. Sobre un contenido ya publicado, la segunda
se convierte en **Despublicar**. Ninguna acción exige entender qué es un commit.

El editor de texto enriquecido ofrece: negrita, cursiva, encabezados de nivel 2 y 3, cita,
lista y enlace. Nada más. Produce HTML que se guarda en `cuerpo_html` y se sanitiza al
escribir, no al leer.

### 6.2 Biblioteca de medios

Cuadrícula de imágenes con buscador por nombre. Subida por arrastre. Antes de enviar a Blob,
el navegador redimensiona la imagen a un máximo de 2000 px por su lado mayor y la convierte a
WebP con calidad 82; así una foto de cámara de 8 MB llega a Blob pesando cientos de kilobytes
y el equipo no necesita pasar por tinypng. Se conserva el nombre original para poder buscarla.

Cada imagen tiene texto alternativo editable, obligatorio para poder usarse como portada.
La biblioteca muestra dónde se está usando cada imagen y advierte antes de borrar una en uso.

### 6.3 Ajustes

Agrupados en pestañas:

**Estado del sitio**
- Modo construcción: encendido/apagado y texto del mensaje.

**Portada**
- Título, subtítulo e imagen del hero.
- Cifras de impacto: lista editable de `{valor, sufijo, etiqueta}`. Migra los seis
  `impactStats` actuales. Una de ellas dice "29+ columnas publicadas en Al Poniente" y hoy hay
  32; la cifra queda editable para que la campaña la corrija y la mantenga.
- Reflexión destacada: selector sobre las bitácoras publicadas. Reemplaza a
  `featuredReflection`. La bitácora que trae la migración queda en borrador, así que la
  portada oculta el bloque hasta que la campaña publique alguna. El selector guarda el `id`
  del contenido y el bloque solo se muestra si ese contenido sigue publicado y sin borrar.
- Franja de fotos: selección ordenada desde la biblioteca de medios.
- Qué secciones aparecen en la retícula de la portada.

**Sobre mí**
- Texto de la sección.
- Trayectoria: lista editable de `{año, título, descripción}`. Migra los diez
  `timelineEvents` actuales.

**Navegación y redes**
- Menú principal: etiqueta, destino y visibilidad por ítem.
- Enlaces de X, Instagram y YouTube.

Cada pestaña escribe una clave en `ajustes`. Guardar dispara `revalidateTag('ajustes')`.

### 6.4 Usuarios

Solo visible para rol `admin`. Lista con nombre, correo, rol, estado y último acceso.
Permite invitar (crear con contraseña temporal de un solo uso), cambiar rol, desactivar y
reactivar. Un admin no puede desactivarse a sí mismo ni quitarse el rol, y el sistema impide
dejar cero admins activos.

**Permisos:**

| Acción | Editor | Admin |
|---|:---:|:---:|
| Crear, editar y publicar contenido | Sí | Sí |
| Borrar y restaurar contenido | Sí | Sí |
| Subir y editar medios | Sí | Sí |
| Borrar medios | No | Sí |
| Cambiar ajustes del sitio | No | Sí |
| Gestionar usuarios | No | Sí |

## 7. Migración del contenido existente

Script `scripts/migrar-contenido.ts`, idempotente, de una sola corrida.

**Qué migra y con qué estado:**

| Origen | `tipo` | Cantidad | Estado |
|---|---|---:|---|
| `columnas.ts` + `columnas-bodies.ts` | `columna` | 32 | **publicado** |
| `content.ts` → `blogPosts` | `bitacora` | 5 | borrador |
| `content.ts` → `stories` | `historia` | 6 | borrador |
| `content.ts` → `ideas` | `idea` | 6 | borrador |
| `content.ts` → `guestColumns` | `voz` | 4 | borrador |
| `content.ts` → `episodes` | `episodio` | 4 | borrador |
| `content.ts` → `impactStats` | ajuste `portada.cifras` | 6 | — |
| `content.ts` → `timelineEvents` | ajuste `sobre.trayectoria` | 10 | — |
| `content.ts` → `navItems` | ajuste `navegacion.menu` | 3 | — |
| `content.ts` → `featuredReflection` | ajuste `portada.reflexionDestacada` | 1 | — |

Las 32 columnas son textos publicados de verdad en Al Poniente y conservan su `sourceUrl`.
El resto es contenido de muestra creado durante el diseño del sitio: entra como borrador,
invisible al público, para que la campaña decida qué reescribir. Los episodios de Un Café
nombran invitados (María Eugenia Ospina, Carolina Restrepo, Jorge Alberto Mesa) que no
corresponden a conversaciones verificadas; permanecen en borrador hasta que la campaña lo
confirme.

Los cuerpos de las columnas están hoy como arreglo de párrafos (`body: string[]`). Se
convierten a HTML envolviendo cada párrafo en `<p>`.

**Imágenes:** las de `public/images/` **no se re-suben a Blob**. Se registran en `medios` con
`url` apuntando a su ruta actual (`/images/…`). Siguen sirviéndose desde el repositorio y
aparecen en la biblioteca como cualquier otra. Las nuevas sí van a Blob.

**Después de migrar y verificar:** se eliminan `src/data/columnas.ts`,
`src/data/columnas-bodies.ts` y `src/data/content.ts`, y `docs/guia-actualizacion.md` se
reemplaza por una guía de uso del panel con capturas.

## 8. Seguridad

- Middleware protege todo `/admin/*` salvo `/admin/login`; sin sesión válida, redirige.
- Las rutas de administración quedan excluidas de `src/app/robots.ts` y de `src/app/sitemap.ts`.
- Contraseñas con bcrypt, coste 12. Nunca se registran en logs ni se devuelven al cliente.
- Sesión JWT en cookie `httpOnly`, `secure`, `sameSite=lax`, vigencia 8 horas.
- Límite de intentos de login: 5 por correo cada 15 minutos, con espera creciente.
- Toda Server Action verifica sesión y rol en el servidor. La ocultación de botones en la
  interfaz es cortesía visual, nunca el control de acceso.
- Toda entrada se valida con Zod antes de tocar la base de datos.
- El HTML del editor se sanitiza en el servidor al guardar, con lista blanca de etiquetas.
- Subida de medios: tipos permitidos JPEG, PNG, WebP y AVIF; tamaño máximo 10 MB; el tipo real
  se verifica por contenido, no por extensión ni por el `Content-Type` declarado.

## 9. Pruebas

Se escriben antes que la implementación, por unidad funcional.

- **Autenticación:** login correcto e incorrecto, cuenta desactivada, expiración de sesión,
  límite de intentos, redirección del middleware.
- **Permisos:** un editor recibe rechazo del servidor al invocar acciones de admin
  (ajustes, usuarios, borrado de medios) aunque llame la acción directamente.
- **CRUD:** crear, editar, publicar, despublicar, borrado suave, restaurar. Unicidad de slug
  por tipo. Validación por tipo de los campos de `extra`.
- **Revalidación:** publicar dispara `revalidateTag` de la etiqueta correcta.
- **Medios:** rechazo por tipo real y por tamaño, aviso de imagen en uso.
- **Migración:** sobre los datos reales del repositorio, verifica los conteos de la tabla de
  la sección 7, que las 32 columnas quedan publicadas con su `sourceUrl`, que todo lo demás
  queda en borrador, y que correr el script dos veces no duplica filas.
- **Sanitización:** un `<script>` en el cuerpo no sobrevive al guardado.

## 10. Fases

1. **Infraestructura.** Neon, Drizzle, esquema, `src/lib/admin/tipos.ts`, script de migración
   y sus pruebas. Al cerrar: el contenido está en la base y verificado.
2. **Acceso.** Auth.js, middleware, pantalla de login, gestión de usuarios y permisos.
3. **Contenido.** Pantalla de CRUD parametrizada, editor de texto enriquecido, papelera.
4. **Medios.** Biblioteca, subida a Blob, texto alternativo, control de uso.
5. **Ajustes y corte.** Pestañas de configuración, y el sitio público pasa a leer de la base
   de datos con caché por etiquetas. Se eliminan los `src/data/*.ts`.
6. **Entrega.** Guía de uso en español con capturas, cuentas creadas, acompañamiento inicial.

## 11. Riesgos

| Riesgo | Mitigación |
|---|---|
| El sitio público queda dependiendo de que Neon responda | Caché por etiquetas: el visitante recibe HTML estático. Una caída de Neon afecta al panel, no a las visitas. |
| `extra` en jsonb sin validación en base de datos | Esquema Zod por tipo en `src/lib/admin/tipos.ts`, validado en cada escritura. |
| Un usuario no técnico borra contenido por error | Borrado suave con papelera y restauración. |
| Se rompe la migración a mitad de camino | Script idempotente y en transacción; los `src/data/*.ts` solo se eliminan en la fase 5, ya verificado. |
| El equipo no adopta el panel | La guía se entrega con capturas y sobre el panel real, no antes; fase 6 incluye acompañamiento. |

## 12. Costo

Neon (plan gratuito, 0,5 GB) y Vercel Blob (plan gratuito, 1 GB) cubren de sobra este
volumen: 57 contenidos y unas 20 imágenes de 6,3 MB en total. Costo recurrente esperado: cero.
