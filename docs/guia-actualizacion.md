# Guia de Actualizacion de Contenido

**Para:** Diego y Walter
**Sitio:** gallonantioquia.vercel.app
**Ultima actualizacion:** Abril 2026

---

## Antes de empezar

El sitio funciona con archivos de texto (TypeScript). Para actualizar contenido solo necesitan:

1. Abrir el archivo indicado en un editor de texto (Visual Studio Code recomendado)
2. Copiar el bloque de ejemplo, pegarlo y cambiar los datos
3. Guardar, hacer commit y push a GitHub

Vercel se encarga del resto: detecta el cambio y publica automaticamente.

---

## 1. Agregar una nueva columna

**Archivo:** `src/data/columnas.ts`

Abran el archivo y busquen la linea que dice:

```ts
export const columnas: ColumnaArticle[] = [
```

Justo debajo de esa linea (antes de la primera `{` que ya existe), peguen un bloque nuevo. El bloque mas reciente siempre va de primero.

### Formato de ejemplo

```ts
  {
    slug: "mi-nueva-columna",
    title: "El titulo de la columna",
    excerpt:
      "Un resumen corto de la columna, maximo 2 lineas. Esto aparece en las tarjetas del listado.",
    date: "2026-05-15",
    readTime: "5 min",
    image: "/images/gallon-retrato-obra-hd.jpg",
    sourceUrl: "https://alponiente.com/mi-nueva-columna/",
    body: [
      "Primer parrafo completo de la columna. Cada parrafo va entre comillas y separado por comas.",
      "Segundo parrafo de la columna. Pueden agregar tantos parrafos como necesiten.",
      "Tercer parrafo. Recuerden que el ultimo parrafo NO lleva coma al final.",
    ],
  },
```

### Explicacion de cada campo

| Campo       | Que es                                                                 | Ejemplo                                      |
|-------------|------------------------------------------------------------------------|----------------------------------------------|
| `slug`      | Identificador unico para la URL (sin espacios, sin tildes, con guiones) | `"mi-nueva-columna"`                         |
| `title`     | Titulo completo de la columna                                          | `"El titulo de la columna"`                  |
| `excerpt`   | Resumen corto (1-2 oraciones)                                          | `"Un resumen corto..."`                      |
| `date`      | Fecha en formato ANIO-MES-DIA                                          | `"2026-05-15"`                               |
| `readTime`  | Tiempo estimado de lectura                                             | `"5 min"`                                    |
| `image`     | Ruta de la imagen (ver seccion 4)                                      | `"/images/nombre-foto.jpg"`                  |
| `sourceUrl` | Link a la columna original en Al Poniente (o vacio `""`)               | `"https://alponiente.com/mi-columna/"`       |
| `body`      | Lista de parrafos entre corchetes `[...]`                              | Ver ejemplo arriba                           |

### Cuidado con estas cosas

- Cada parrafo va entre comillas dobles `"..."`
- Entre parrafos va una coma `,`
- El **ultimo** parrafo NO lleva coma
- Si un parrafo tiene comillas internas, usen `\"` en su lugar. Ejemplo: `"Dijo: \"hay otro camino\""`
- El `slug` debe ser unico (no repetir uno que ya exista)

---

## 2. Agregar una entrada de Huellas en el Camino (bitacora)

**Archivo:** `src/data/content.ts`

Busquen la linea que dice:

```ts
export const blogPosts: BlogPost[] = [
```

Agreguen un bloque nuevo al inicio del array (justo despues del `[`):

### Formato de ejemplo

```ts
  {
    slug: "mi-nueva-reflexion",
    title: "El titulo de la reflexion",
    tag: "Liderazgo",
    excerpt:
      "Un resumen corto de la reflexion. Esto aparece en la tarjeta del listado.",
    date: "2026-05-15",
    readTime: "5 min",
    image: "/images/gallon-retrato-montanas-wide.jpg",
  },
```

### Tags disponibles

Usen uno de estos tags (deben coincidir exactamente):

- `"Liderazgo"`
- `"Servicio Publico"` (con tilde: `"Servicio Público"`)
- `"Territorio"`
- `"Decisiones"`
- `"Aprendizajes"`

Si necesitan agregar un tag nuevo, tambien deben agregarlo al array `blogTags` en el mismo archivo:

```ts
export const blogTags: string[] = [
  "Todos",
  "Liderazgo",
  "Servicio Público",
  "Territorio",
  "Decisiones",
  "Aprendizajes",
  "Mi Nuevo Tag",  // <-- agregar aca
];
```

### Si quieren que aparezca como reflexion destacada en la pagina principal

Busquen `export const featuredReflection: BlogPost = {` y reemplacen todo el bloque con los datos de la nueva entrada. Debe tener los mismos campos que el blogPost.

---

## 3. Cambiar la imagen del hero (pagina principal)

**Archivo:** `src/app/page.tsx`

Busquen esta linea (esta cerca de la linea 89):

```tsx
src="/images/gallon-retrato-obra-hd.jpg"
```

Cambien `gallon-retrato-obra-hd.jpg` por el nombre del nuevo archivo. Por ejemplo:

```tsx
src="/images/mi-nueva-foto-hero.jpg"
```

**Nota:** La foto del hero aparece dos veces en `page.tsx` (una en el hero principal arriba y otra en la seccion "Mi historia" mas abajo). Si quieren cambiar ambas, busquen las dos apariciones de `gallon-retrato-obra-hd.jpg`.

**Recomendaciones para la foto del hero:**

- Formato JPG
- Resolucion minima: 1920x1080 pixeles
- Orientacion horizontal (paisaje) o vertical tipo retrato
- Peso maximo recomendado: 500 KB (comprimir con tinypng.com si es muy pesada)

---

## 4. Subir nuevas fotos

### Paso 1: Copiar la foto

Copien el archivo JPG a la carpeta:

```
public/images/
```

**Importante:**

- Nombres sin espacios, sin tildes, sin caracteres raros
- Solo minusculas y guiones
- Ejemplo bueno: `gallon-evento-mayo-2026.jpg`
- Ejemplo malo: `Foto Gallón Evento (2).JPG`

### Paso 2: Referenciar la foto

En cualquier archivo de datos, usen la ruta asi:

```ts
image: "/images/gallon-evento-mayo-2026.jpg",
```

La ruta siempre empieza con `/images/` seguido del nombre exacto del archivo.

### Fotos que ya estan disponibles

Estas fotos ya estan en el sitio y pueden reutilizarlas:

- `/images/gallon-retrato-obra-hd.jpg`
- `/images/gallon-retrato-montanas-wide.jpg`
- `/images/gallon-retrato-montanas-portrait.jpg`
- `/images/gallon-discurso.jpg`
- `/images/gallon-entrevista-medellin.jpg`
- `/images/gallon-conversacion-rural.jpg`
- `/images/gallon-caminando-obra.jpg`
- `/images/gallon-evento-banderas.jpg`
- `/images/gallon-vias-seguridad.jpg`
- `/images/gallon-tunel-moso.jpg`
- `/images/gallon-tunel-mar.jpg`
- `/images/gallon-retrato-casco.jpg`
- `/images/gallon-familia-intima.jpg`
- `/images/gallon-familia-grande.jpg`
- `/images/gallon-reunion-biblioteca.jpg`
- `/images/gallon-pareja-futbol.jpg`
- `/images/hero-montanas-panoramico.jpg`
- `/images/hero-gallon-montanas.jpg`
- `/images/fondo-mapa-antioquia.jpg`
- `/images/fondo-cafetal.jpg`

---

## 5. Hacer deploy (publicar los cambios)

Despues de guardar los archivos modificados, abran la terminal en la carpeta del proyecto y ejecuten estos comandos:

```bash
# Ver que archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Crear el commit con un mensaje descriptivo
git commit -m "contenido: agregar nueva columna sobre [tema]"

# Subir a GitHub (esto dispara el deploy automatico)
git push
```

### Como saber si el deploy funciono

1. Vayan a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Busquen el proyecto **gallonantioquia**
3. Deben ver un deploy reciente con estado verde ("Ready")
4. Hagan clic para ver la preview, y si todo se ve bien, ya esta en produccion

### Si algo sale mal

- Si el `git push` falla, puede ser que alguien mas hizo cambios. Ejecuten `git pull` primero y luego `git push`
- Si el deploy de Vercel falla (estado rojo), revisen el log de errores. Generalmente es un error de sintaxis en el archivo (una coma que falta, unas comillas sin cerrar, etc.)

---

## 6. Contacto de soporte

Si tienen dudas o algo no funciona, Cristian esta disponible para ayudarles:

- Pueden escribirle por WhatsApp o por el canal que manejen
- Si es un error de deploy, manden un screenshot del error en Vercel
- Si no estan seguros de como hacer un cambio, pregunten antes de publicar

---

## Resumen rapido

| Que quiero hacer                    | Archivo a editar            |
|-------------------------------------|-----------------------------|
| Agregar columna nueva               | `src/data/columnas.ts`      |
| Agregar entrada de bitacora         | `src/data/content.ts`       |
| Cambiar foto del hero               | `src/app/page.tsx`          |
| Subir fotos nuevas                  | Copiar a `public/images/`   |
| Publicar cambios                    | `git add . && git commit && git push` |
