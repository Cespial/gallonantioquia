# Despliegue del módulo de administración

Notas técnicas. Para el uso diario del panel, ver `guia-panel.md`.

---

## Servicios

| Servicio | Qué es | Dónde |
|---|---|---|
| Neon Postgres | Base de datos del contenido | Integración de Vercel, recurso `neon-gray-clock` |
| Vercel Blob | Almacén de las fotos que se suben | Store `gallonantioquia-fotos` (`store_7cucYxu3fm395q8p`) |

Ambos están conectados al proyecto `cespials-projects/gallonantioquia` y en la
capa gratuita.

## Variables de entorno

Las cinco están cargadas en Production, Preview y Development:

| Variable | Origen |
|---|---|
| `DATABASE_URL` | Neon, cadena *pooled*. La usa la aplicación |
| `DATABASE_URL_UNPOOLED` | Neon, cadena directa. La usa `drizzle-kit` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob |
| `AUTH_SECRET` | `openssl rand -base64 33`. Firma la sesión |
| `AUTH_URL` | **Solo en local.** En Vercel, Auth.js la deduce de `VERCEL_URL`; fijarla rompería las vistas previas |

Neon inyecta además una decena de variables `PG*` y `POSTGRES_*` que el
proyecto no usa. No estorban.

Para trabajar en local:

```bash
vercel env pull .env.local
```

Ese comando **sobrescribe el archivo entero**, así que borra `AUTH_SECRET` y
`AUTH_URL`, que no están en Vercel con ese propósito. Hay que volver a
añadirlas a mano al final del archivo.

Los scripts de base de datos no leen `.env.local` por su cuenta:

```bash
set -a && . ./.env.local && set +a
```

## Esquema

```bash
npm run db:generar   # tras cambiar src/db/esquema.ts
npm run db:aplicar   # aplica las migraciones pendientes
```

`drizzle.config.ts` usa `DATABASE_URL_UNPOOLED`.

## Migración del contenido

**Ya se ejecutó, el 10 de agosto de 2026, y era de una sola vez.** Pasó a la
base los 57 contenidos que vivían en `src/data/`: 32 columnas publicadas y 25
borradores, más 23 imágenes y 8 ajustes. El script y los datos de origen se
retiraron del repositorio después de verificar el resultado en producción.

Si alguna vez hiciera falta repetirla, hay que recuperar de la historia de git
`src/data/`, `src/lib/admin/migracion.ts` y `scripts/migrar-contenido.ts`
(commit `d960c4b`, el que los borró).

Ese script **no puede usar el cliente de `@/db`**: va sobre el driver
`neon-http`, que no soporta transacciones, y la migración corre entera dentro
de una. Usaba `Pool` de `@neondatabase/serverless` con
`drizzle-orm/neon-serverless` sobre el WebSocket nativo de Node 22.

## Crear un administrador

```bash
npm run crear-admin -- correo@dominio.co "Nombre" "contraseña de 10+ caracteres"
```

El panel **no permite cambiar la propia contraseña**: un administrador puede
crear cuentas y desactivarlas, pero para rotar una clave hay que volver a este
script o crear una cuenta nueva. Es la limitación más visible del módulo hoy.

## Desplegar

```bash
npm test && npm run typecheck
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

Se compila en la máquina local y se sube el resultado: un fallo de empaquetado
aparece en segundos, sin esperar el ciclo de la nube.

Verificar después, en este orden:

1. `/` muestra la pantalla de construcción (mientras siga encendida).
2. `/columnas` lista las 32 columnas y una de ellas abre.
3. `/admin` redirige a `/admin/login`.
4. Se entra con la cuenta de administrador.
5. Se publica algo de prueba y aparece en el sitio en menos de un minuto, sin desplegar de nuevo.
6. `/robots.txt` contiene `Disallow: /admin`.

El paso 5 está automatizado en `scripts/verificar-panel.py`: conduce un
navegador real contra producción, publica una entrada, comprueba que sale al
aire y la devuelve a borrador.

## Si un despliegue falla

```bash
npx vercel ls --prod          # lista los despliegues de producción
npx vercel rollback <url>     # vuelve al anterior
```

Las vistas previas están detrás del SSO de Vercel, así que no se pueden
verificar con `curl` sin un token de bypass. O se revisan desde el navegador
con la sesión de Vercel, o se verifica directamente en producción.

## Dos trampas que ya costaron tiempo

**El middleware va en `src/middleware.ts`, no en la raíz del repositorio.**
Con `app` dentro de `src/`, Next.js compila sin una sola advertencia, deja
`.next/server/middleware-manifest.json` vacío y `/admin` queda abierto. Al
tocarlo, confirmar en ese manifiesto que el matcher está.

**Nada de calcular fechas durante el render.** El encabezado formateaba
`new Date()` en el render: el servidor lo hacía en su huso y el navegador en el
del visitante, el texto no coincidía y React abortaba la hidratación de la
página entera. El síntoma no es un error visible sino que **ningún botón
responde** —incluidos los del panel, que heredaban ese encabezado—. Por eso el
sitio público vive ahora bajo `src/app/(sitio)/` y el panel fuera de él: un
fallo de hidratación en uno ya no alcanza al otro.
