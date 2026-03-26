# Gallón Antioquia

Plataforma editorial de pensamiento, territorio y liderazgo para Antioquia.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Tipografía:** Playfair Display, DM Sans, Source Serif 4 (Google Fonts)
- **Iconos:** Lucide React
- **Deploy:** Vercel

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
/src
  /app          → Páginas (App Router)
  /components   → Componentes reutilizables
  /data         → Datos placeholder
  /lib          → Utilidades
  /types        → Tipos TypeScript
```

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Home — Conversaciones para Antioquia |
| `/territorio-vivo` | Historias de Antioquia |
| `/bitacora` | Blog personal de Horacio Gallón |
| `/antioquia-piensa` | Ideas y proyectos |
| `/un-cafe` | Entrevistas y diálogos |
| `/voces` | Columnas invitadas |
| `/participa` | Formularios de participación |
| `/sobre` | Perfil de Horacio Gallón |

## Deploy

```bash
vercel
```
