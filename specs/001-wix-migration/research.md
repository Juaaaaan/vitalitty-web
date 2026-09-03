# Research: Migración 1:1 Wix → Astro

**Feature**: `001-wix-migration` | **Date**: 2026-09-03

## NEEDS CLARIFICATION Items

### 1. Teléfonos reales de la clínica

**Decision**: RESOLVED — `690071950`

**Context**: El Wix actual muestra `657.423.574` pero enlaza a `tel:690071950`. Confirmado: usar `690071950`.

**Rationale**: Valor confirmado por el cliente.

### 2. Email de contacto definitivo

**Decision**: RESOLVED — `info@vitalitty.es`

**Context**: El Wix tenía `info@vitalitty.com` y `info@mysite.com` en los `mailto:` (erróneos). Confirmado: usar `info@vitalitty.es`.

**Rationale**: Valor confirmado por el cliente.

## Technology Decisions

### 3. Astro v5 con SSG + endpoints serverless

**Decision**: Astro v5, modo SSG, con `@astrojs/vercel` para endpoints de formularios

**Rationale**: Astro v5 es la versión actual estable. SSG genera HTML estático (máximo rendimiento, Lighthouse 95+). Los formularios necesitan un endpoint server-side para Resend/Turnstile, que Vercel ejecuta como función serverless.

**Alternatives considered**:
- Next.js: Overkill para un sitio mayoritariamente estático. Más JS del necesario.
- Astro SSR completo: Innecesario, solo los formularios necesitan server-side.

### 4. Gestión de estilos: Tailwind CSS

**Decision**: Tailwind CSS v4

**Rationale**: Rápido para replicar layouts visuales, elimina CSS muerto automáticamente (rendimiento), encaja bien con Astro. El CLAUDE.md lo menciona como opción.

**Alternatives considered**:
- CSS puro: Más fiel al original pero más lento de implementar y mantener.
- Sass/SCSS: Capa adicional sin beneficio claro sobre Tailwind para este tipo de sitio.

### 5. URLs acentuadas

**Decision**: Usar nombres de archivo sin acento + rewrites en `vercel.json` (o config de Astro) para servir las URLs acentuadas

**Rationale**: Los archivos con tildes en el nombre dan problemas en algunos OS y herramientas. El rewrite es transparente para el usuario y el crawler.

**Alternatives considered**:
- Archivos con tildes: Funciona en Linux/Mac pero puede fallar en Windows y algunas herramientas de CI. Más riesgo.

**Implementation**:
```json
// vercel.json
{
  "rewrites": [
    { "source": "/copia-de-nutrición", "destination": "/copia-de-nutricion" },
    { "source": "/blog/categories/sabías-qué", "destination": "/blog/categories/sabias-que" }
  ]
}
```

### 6. Blog: Content Collections con MDX

**Decision**: Astro content collections con schema tipado, archivos MDX

**Rationale**: Content collections validan estructura (título, categoría, fecha, slug) en build time. MDX permite componentes embebidos si algún post lo necesita. 13 posts es manejable como archivos.

**Alternatives considered**:
- Markdown puro: Suficiente para posts simples, pero MDX da flexibilidad sin coste.
- CMS headless: Overhead innecesario para 13 posts estáticos gestionados por el equipo de desarrollo.

### 7. Formularios: Resend + Turnstile + Honeypot

**Decision**: Endpoint serverless en `src/pages/api/contact.ts`. Validación: honeypot (campo oculto) + Cloudflare Turnstile (challenge invisible) + checkbox RGPD. Envío: Resend.

**Rationale**: Stack definido en CLAUDE.md. Turnstile es gratuito y no invasivo. Honeypot atrapa bots simples. Resend es el proveedor de email elegido.

**Alternatives considered**:
- reCAPTCHA: Más intrusivo para el usuario, peor UX.
- Formspree/Netlify Forms: Dependencia externa adicional, menos control.

### 8. Banner de cookies

**Decision**: Componente propio (CookieBanner) sin librería externa

**Rationale**: Requisito simple (aceptar/rechazar, recordar preferencia en localStorage). Una librería de cookies añade JS innecesario. No hay cookies de analytics de terceros que gestionar inicialmente — solo la preferencia misma.

**Alternatives considered**:
- cookieconsent/tarteaucitron: Más peso JS, más complejidad, para un caso que se resuelve con 50 líneas.

### 9. Imágenes: Astro Image

**Decision**: Componente `<Image>` de Astro con optimización automática (AVIF/WebP, responsive sizes, lazy-loading)

**Rationale**: Integrado en Astro, genera formatos optimizados en build, sin config adicional. Cumple el principio III de la constitución.

**Alternatives considered**:
- Optimización manual con sharp: Más trabajo, mismo resultado.
- CDN de imágenes (Cloudinary): Dependencia externa y coste innecesario para un sitio estático.

### 10. Carrusel de testimonios

**Decision**: Isla Astro con JS mínimo (vanilla JS o componente Astro con `client:visible`)

**Rationale**: Único componente interactivo real. `client:visible` carga JS solo cuando el carrusel entra en viewport. Sin framework de UI (React/Vue) para un carrusel.

**Alternatives considered**:
- Swiper.js: Pesado para un carrusel simple.
- CSS-only carousel: Posible pero peor UX (sin autoplay, sin swipe táctil).
- Embla Carousel: Ligero pero aún una dependencia más. Evaluar si vanilla JS es suficiente.
