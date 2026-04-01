# PLAN DE DESARROLLO — gallonantioquia.com
## De estado actual a producto final (según plataforma.pptx)

---

## ESTADO ACTUAL vs. VISIÓN OBJETIVO

### Lo que TENEMOS
- 8 páginas funcionales desplegadas en Vercel
- Identidad visual (verde-antioquia + dorado-tierra + arena)
- Tipografía de marca (Jacked, Thorce, Myriad Pro) + editorial (Playfair, Source Serif)
- 13 fotos reales + 9 imágenes AI (Midjourney/Gemini)
- SEO básico (favicon, OG, sitemap, schema.org)
- Home con estilo "brutalismo editorial"
- Todo el contenido es placeholder

### Lo que FALTA (según el mockup del PPTX)
1. **"Antioquia en Conversación"** — El home del mockup es una PORTADA DE REVISTA con grid de entry points, no un layout largo de scroll
2. **Barra de navegación rápida** — 5 columnas horizontales (Última Reflexión, Historia Destacada, Entrevista, Ideas para el Futuro, Voces)
3. **Grid de 6 secciones visuales** — Cards grandes con foto + título + subtítulo
4. **"Antioquia en Datos"** — Sección nueva que no existe: datos, mapas, análisis del departamento
5. **CMS** — No hay forma de actualizar contenido sin tocar código
6. **Newsletter funcional** — Los formularios solo hacen console.log
7. **Contenido real** — Cero posts, cero entrevistas, cero columnas reales
8. **Sesión fotográfica** — Las fotos de Midjourney son apoyo, pero necesitan fotos reales de Gallón en territorio (casual, mochila, sin casco)
9. **Podcast/Video** — No hay integración con plataforma de audio/video
10. **Analytics** — No hay tracking de ningún tipo
11. **Dominio** — Está en gallonantioquia.vercel.app, no en gallonantioquia.com

---

## BACKLOG — 6 SPRINTS

---

### SPRINT 0 — ALINEACIÓN DE HOME CON MOCKUP (3-4 días)
**Objetivo:** Que el home se parezca al mockup del PPTX

#### S0.1 — Rediseñar Home como portada de revista
- [ ] Cambiar título principal a "Antioquia en Conversación" con "Con Horacio Gallón"
- [ ] Hero: foto grande de Gallón en territorio (casual, con montañas) + quote manifiesto
- [ ] Agregar barra de navegación rápida (5 columnas): Última Reflexión | Historia Destacada | Entrevista | Ideas para el Futuro | Voces Invitadas
- [ ] Cada columna es un link con thumbnail pequeño y título

#### S0.2 — Grid de 6 secciones (el corazón del home)
- [ ] Diseñar grid 3x2 responsive con cards grandes
- [ ] Card 1: Territorio Vivo — Historias de Antioquia (foto gente en naturaleza)
- [ ] Card 2: Bitácora de Camino — Reflexiones de Horacio (foto Gallón con gente)
- [ ] Card 3: Antioquia Piensa — Ideas y Proyectos (mapa/visualización)
- [ ] Card 4: Conversaciones para Antioquia — Entrevistas (foto grupal)
- [ ] Card 5: Voces de Antioquia — Columnas Invitadas (foto rural)
- [ ] Card 6: Antioquia en Datos — Datos y Análisis (mapa de Antioquia)
- [ ] Cada card: imagen de fondo + overlay + título + subtítulo + hover effect

#### S0.3 — Sección inferior del home
- [ ] "Sobre Horacio" — foto de Gallón caminando + mini bio + link
- [ ] "Participa" — textura papel + "Envía tus Ideas y Propuestas" + link
- [ ] Newsletter CTA (mantener versión actual, está bien)

#### S0.4 — Crear página "Antioquia en Datos" (nueva)
- [ ] Ruta: /antioquia-en-datos
- [ ] Placeholder con estructura: cifras de impacto (las que tenemos) + espacio para mapas + visualizaciones
- [ ] Mover las cifras del home actual a esta página como sección principal
- [ ] Agregar al nav global

#### S0.5 — Ajustar navegación global
- [ ] Actualizar nav items: agregar "Antioquia en Datos"
- [ ] Revisar que el orden del nav coincida con el mockup

**Entregable:** Home que se parece al mockup del PPTX, nueva sección de datos.

---

### SPRINT 1 — CMS + CONTENIDO DINÁMICO (5-7 días)
**Objetivo:** Que Gallón o su equipo puedan publicar contenido sin tocar código

#### S1.1 — Evaluar e integrar CMS headless
- [ ] Opción A: Sanity.io (gratis hasta 100K docs, visual, real-time)
- [ ] Opción B: Google Sheets como backend (simple, Gallón ya lo conoce)
- [ ] Opción C: Markdown/MDX en GitHub (técnico pero gratis)
- [ ] Decisión: probablemente Sanity por balance entre facilidad y poder
- [ ] Instalar Sanity Studio o configurar Google Sheets API

#### S1.2 — Modelos de contenido en el CMS
- [ ] `bitacora` — slug, título, extracto, cuerpo (rich text), tag, fecha, imagen, readTime
- [ ] `historia` — slug, título, extracto, cuerpo, categoría, fecha, formato, imagen
- [ ] `idea` — slug, número, título, descripción, cuerpo
- [ ] `episodio` — número, título, invitado, rol, descripción, formatos, imagen, links (YouTube, Spotify)
- [ ] `columna` — slug, autor (nombre, rol, categoría, imagen), título, extracto, cuerpo, pullQuote, fecha
- [ ] `dato` — título, valor, sufijo, label (para cifras de impacto)
- [ ] `config` — manifesto quotes, bio, links redes sociales

#### S1.3 — Migrar datos estáticos al CMS
- [ ] Mover content.ts → CMS (todas las entries)
- [ ] Crear funciones de fetch (getStories, getBlogPosts, getIdeas, etc.)
- [ ] Configurar ISR (Incremental Static Regeneration) para revalidar cada 60s
- [ ] Las páginas ahora consumen del CMS en lugar de content.ts

#### S1.4 — Panel de administración
- [ ] Si Sanity: acceso en /studio o studio.gallonantioquia.com
- [ ] Si Sheets: documento compartido con el equipo
- [ ] Documentar: "Cómo publicar un post en Bitácora" (guía para el equipo)

**Entregable:** CMS funcional donde el equipo puede crear/editar contenido.

---

### SPRINT 2 — CONTENIDO REAL + FOTOGRAFÍA (7-10 días)
**Objetivo:** Reemplazar TODO el placeholder con contenido real

#### S2.1 — Sesión fotográfica (el equipo de Gallón)
- [ ] Coordinar sesión de 2-3 horas con fotógrafo
- [ ] Brief fotográfico:
  - Gallón caminando por veredas (casual, mochila, sin casco)
  - Gallón hablando con campesinos/líderes
  - Gallón mirando directamente a la cámara (retrato de autor, luz dramática)
  - Gallón en paisaje antioqueño (panorámica)
  - Fotos de territorio: vías, puentes, comunidades, café, montañas
- [ ] Retratos recortados (PNG sin fondo) para uso editorial
- [ ] Mínimo 30 fotos seleccionadas, resolución completa

#### S2.2 — Contenido para Bitácora (3 posts reales)
- [ ] Post 1: "Lo que uno aprende cuando escucha más de lo que habla" — Gallón dicta/escribe
- [ ] Post 2: "Las carreteras no solo conectan lugares, conectan sueños" — sobre la gestión vial
- [ ] Post 3: "Lo que enseña recorrer Antioquia a pie" — crónica personal
- [ ] Cada post: 800-1200 palabras, tono personal, con foto real
- [ ] Publicar en CMS

#### S2.3 — Contenido para Territorio Vivo (2 historias reales)
- [ ] Historia 1: Una comunidad transformada por una vía (la que tenga mejor historia)
- [ ] Historia 2: El túnel "Más cerca del mar" — crónica de la obra
- [ ] Cada historia: 600-1000 palabras, fotos reales del lugar/personas
- [ ] Publicar en CMS

#### S2.4 — Primera entrevista para "Un Café"
- [ ] Grabar conversación (puede ser con celular) con un líder comunitario
- [ ] Editar video (3-5 min para web) + versión audio
- [ ] Subir a YouTube + Spotify/Anchor
- [ ] Crear entry en CMS con links

#### S2.5 — Primera columna para "Voces"
- [ ] Invitar a un empresario o académico a escribir una columna
- [ ] 500-800 palabras sobre un tema de Antioquia
- [ ] Publicar en CMS con foto y bio del autor

#### S2.6 — Datos para "Antioquia en Datos"
- [ ] Recopilar cifras actualizadas de gestión
- [ ] Preparar 2-3 visualizaciones simples (Recharts)
- [ ] Mapa de Antioquia con datos por subregión (si hay datos)

**Entregable:** Sitio con contenido real — mínimo 3 posts, 2 historias, 1 entrevista, 1 columna.

---

### SPRINT 3 — FUNCIONALIDAD: NEWSLETTER + FORMULARIOS + MEDIA (5-7 días)
**Objetivo:** Que los formularios funcionen y el newsletter se envíe

#### S3.1 — Newsletter funcional
- [ ] Opción A: Resend + Vercel (simple, serverless)
- [ ] Opción B: Mailchimp/Brevo API
- [ ] Opción C: ConvertKit (más features de email marketing)
- [ ] Decisión: Resend por simplicidad y precio
- [ ] Crear API route /api/newsletter que registre suscriptores
- [ ] Almacenar emails en Neon Postgres o Upstash Redis
- [ ] Email de confirmación automático
- [ ] Template de email "Carta para Antioquia" con el branding

#### S3.2 — Formularios de "Participa" funcionales
- [ ] Crear API route /api/participa que reciba los 4 tipos de formulario
- [ ] Almacenar envíos en base de datos
- [ ] Enviar notificación por email al equipo cuando alguien envía algo
- [ ] Mensaje de confirmación real (no solo toast local)

#### S3.3 — Integración de media
- [ ] Embed de YouTube para episodios de "Un Café"
- [ ] Player de audio (Spotify embed o reproductor custom) para podcast
- [ ] Galería de fotos para historias de "Territorio Vivo"
- [ ] Lazy loading de todos los embeds

#### S3.4 — Compartir en redes
- [ ] Botones de compartir en cada artículo/post (WhatsApp, Twitter, Facebook)
- [ ] OG images dinámicos por artículo (usando next/og)
- [ ] URL canónica por artículo

**Entregable:** Newsletter funcional, formularios que envían email, media integrado.

---

### SPRINT 4 — OPTIMIZACIÓN + ANALYTICS + PERFORMANCE (3-4 días)
**Objetivo:** Sitio rápido, medible, indexable

#### S4.1 — Performance
- [ ] Migrar TODAS las <img> a next/image con sizes y priority
- [ ] Comprimir/optimizar las imágenes AI (muchas son 2+ MB)
- [ ] Implementar lazy loading en secciones below-the-fold
- [ ] Eliminar CSS/JS no usado
- [ ] Lighthouse score: target 90+ en las 4 categorías

#### S4.2 — Analytics
- [ ] Instalar Vercel Analytics (@vercel/analytics)
- [ ] Instalar Vercel Speed Insights (@vercel/speed-insights)
- [ ] Custom events: click en secciones, formularios enviados, newsletter suscrito
- [ ] Dashboard de métricas compartido con el equipo

#### S4.3 — SEO avanzado
- [ ] Schema.org Article para cada post/historia
- [ ] Schema.org BreadcrumbList en páginas internas
- [ ] Mejorar meta descriptions por página (no genéricas)
- [ ] Internal linking strategy (cada post enlaza a 2-3 posts relacionados)
- [ ] Verificar Google Search Console

#### S4.4 — Accesibilidad
- [ ] Auditar con axe-core
- [ ] alt text real en todas las imágenes
- [ ] Contraste WCAG AA en todos los textos
- [ ] Navegación por teclado completa
- [ ] Skip-to-content link

**Entregable:** Lighthouse 90+, analytics activo, SEO completo.

---

### SPRINT 5 — DOMINIO + LAUNCH + CONTENIDO PIPELINE (3-5 días)
**Objetivo:** Sitio en dominio final, pipeline de contenido automatizado

#### S5.1 — Dominio
- [ ] Comprar gallonantioquia.com (si no está comprado)
- [ ] Configurar DNS en Vercel (vercel domains add)
- [ ] SSL automático
- [ ] Redirect www → non-www (o viceversa)
- [ ] Verificar que OG URLs apunten al dominio final

#### S5.2 — Pipeline de contenido (Nano Banana + Flow + CMS)
- [ ] Documentar flujo: Gallón genera material → equipo edita → publica en CMS
- [ ] Template de publicación para cada tipo de contenido
- [ ] Calendario editorial: 1 post Bitácora/semana, 1 historia/mes, 1 episodio/mes
- [ ] Proceso de mejora de fotos con Nano Banana (upscale, backgrounds)
- [ ] Proceso de animación con Google Flow (fondos, reels para redes)

#### S5.3 — Redes sociales
- [ ] Configurar cuentas reales: @gallonantioquia en Instagram, Twitter, YouTube
- [ ] Auto-compartir nuevos posts del CMS a redes (via Zapier/n8n o manual)
- [ ] Crear templates de redes con la identidad visual

#### S5.4 — Launch checklist
- [ ] Revisar todos los links (internos y externos)
- [ ] Probar formularios en producción
- [ ] Probar newsletter en producción
- [ ] Verificar mobile en 3+ dispositivos
- [ ] Verificar velocidad con WebPageTest
- [ ] Probar compartir en WhatsApp/redes (OG image correcto)
- [ ] Backup del CMS
- [ ] Monitoreo de uptime

**Entregable:** Sitio en dominio final, pipeline documentado, launch exitoso.

---

### SPRINT 6 (POST-LAUNCH) — ITERACIÓN + "ANTIOQUIA EN DATOS" COMPLETA (ongoing)
**Objetivo:** Hacer crecer la plataforma con datos y contenido continuo

#### S6.1 — "Antioquia en Datos" completa
- [ ] Dashboard interactivo con Recharts
- [ ] Mapa de Antioquia con datos por municipio (Mapbox GL JS)
- [ ] Fuentes de datos: datos.gov.co, DANE, gobernación
- [ ] Cifras de inversión vial por subregión
- [ ] Indicadores de conectividad, educación, agricultura
- [ ] Actualización periódica de datos

#### S6.2 — Features avanzados
- [ ] Búsqueda interna (algolia o native search)
- [ ] Tags y categorías cruzadas entre secciones
- [ ] "Relacionados" al final de cada artículo
- [ ] Paginación o infinite scroll en listados
- [ ] Dark mode (opcional)

#### S6.3 — Contenido continuo
- [ ] Meta: 4 posts Bitácora/mes
- [ ] Meta: 2 historias Territorio Vivo/mes
- [ ] Meta: 1 episodio Un Café/mes
- [ ] Meta: 2 columnas Voces/mes
- [ ] Meta: 1 idea Antioquia Piensa/mes
- [ ] Revisar analytics mensualmente para ajustar

---

## CRONOGRAMA ESTIMADO

| Sprint | Duración | Quién | Depende de |
|--------|----------|-------|------------|
| Sprint 0 | 3-4 días | Dev (Claude) | Nada — ARRANCA YA |
| Sprint 1 | 5-7 días | Dev (Claude) | S0 completado |
| Sprint 2 | 7-10 días | Equipo Gallón + Dev | Sesión fotográfica + Gallón escribe |
| Sprint 3 | 5-7 días | Dev (Claude) | S1 (CMS) listo |
| Sprint 4 | 3-4 días | Dev (Claude) | S0-S3 completados |
| Sprint 5 | 3-5 días | Dev + Equipo | Dominio comprado + contenido real |
| Sprint 6 | Ongoing | Todos | Post-launch |

**Total estimado hasta launch: 4-6 semanas**

---

## DECISIONES PENDIENTES (para alinear con el equipo)

1. **¿CMS?** Sanity (recomendado) vs. Google Sheets vs. MDX en GitHub
2. **¿Newsletter?** Resend (recomendado) vs. Mailchimp vs. ConvertKit
3. **¿Sesión fotográfica?** ¿Cuándo? ¿Con qué fotógrafo?
4. **¿Dominio?** ¿Ya está comprado gallonantioquia.com?
5. **¿Redes sociales?** ¿Cuentas existentes o nuevas?
6. **¿Datos?** ¿Qué fuentes de datos tiene la Secretaría de Infraestructura?
7. **¿Gallón escribe?** ¿O alguien ghostwrites y él revisa?
8. **¿Presupuesto para tools?** Sanity gratis, Resend gratis tier, Vercel Pro ($20/mes)?
