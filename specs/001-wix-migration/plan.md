# Implementation Plan: Migración 1:1 Wix → Astro

**Branch**: `001-wix-migration` | **Date**: 2026-09-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-wix-migration/spec.md`

## Summary

Migración fiel de `vitalitty.es` desde Wix a un sitio Astro v7 desplegado en Vercel. Se replican contenido, estructura, URLs y metadatos SEO del original. Se añaden páginas legales obligatorias (RGPD/LOPDGDD) y se corrigen bugs documentados (teléfonos, emails). Formularios vía Resend con Turnstile + honeypot. Blog con content collections MDX.

## Technical Context

**Language/Version**: TypeScript, Astro v7 (última estable)

**Primary Dependencies**: Astro v7, @astrojs/vercel (adapter SSR para endpoints), @astrojs/sitemap, @astrojs/mdx, Resend (email), Cloudflare Turnstile (anti-spam)

**Storage**: Filesystem — `src/data/*.json` para servicios/testimonios/colaboradores, content collections MDX para blog. Sin base de datos.

**Testing**: `astro check` (tipos/diagnósticos), Lighthouse CLI, crawler de enlaces (linkinator o similar), comparación visual manual contra Wix

**Target Platform**: Web — Vercel (SSG + funciones serverless para endpoints de formularios)

**Project Type**: Web application (sitio estático con endpoints serverless)

**Performance Goals**: Lighthouse ≥ 95 en las 4 categorías. Static-first, cero JS por defecto, islas solo para carrusel de testimonios y validación de formularios.

**Constraints**: Imágenes optimizadas AVIF/WebP, lazy-loading. URLs acentuadas preservadas. Cumplimiento RGPD/LOPDGDD obligatorio.

**Scale/Scope**: ~10 páginas estáticas, 13 posts de blog, 4 formularios, 6+6 servicios, 8 colaboradores. Sitio de bajo tráfico (clínica local).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Notas |
|-----------|--------|-------|
| I. Fidelidad al original | ✅ PASS | Réplica 1:1 explícita. Copy literal, sin rediseño |
| II. Preservación URLs/SEO | ✅ PASS | Todas las URLs preservadas, 301 para limpiezas opcionales. Metadatos replicados |
| III. Presupuesto rendimiento | ✅ PASS | Astro SSG, cero JS default, islas mínimas, Lighthouse ≥ 95 |
| IV. Accesibilidad WCAG 2.1 AA | ✅ PASS | Requerido en spec (FR-011). HTML semántico, alt, contraste, foco |
| V. RGPD/LOPDGDD | ✅ PASS | Páginas legales, banner cookies, checkbox RGPD en formularios, sin datos en logs |
| VI. Mantenibilidad | ✅ PASS | Componentes, datos en JSON/collections, tipos validados |
| VII. Verificación | ✅ PASS | Comparación visual, check enlaces, prueba formularios, astro check |

**Gate result: ALL PASS** — No violations, no complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-wix-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API endpoints)
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/          # Header, Footer, ServiceCard, TeamMember,
│                        # TestimonialCarousel, CollaboratorCard, BlogCard,
│                        # ContactForm, CookieBanner
├── layouts/             # BaseLayout.astro (meta SEO + OG, header, footer)
├── pages/               # Una .astro por ruta
│   ├── index.astro      # Home
│   ├── nutricion.astro
│   ├── fisioterapia.astro
│   ├── copia-de-nutricion.astro  # Recomposición Online (redirect/rewrite para acento)
│   ├── colaboraciones.astro
│   ├── contacto.astro
│   ├── aviso-legal.astro
│   ├── politica-privacidad.astro
│   ├── politica-cookies.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── categories/
│   │       └── [categoria].astro
│   ├── post/
│   │   └── [slug].astro
│   └── api/
│       └── contact.ts   # Endpoint serverless (Resend + Turnstile)
├── content/
│   ├── config.ts        # Schema de content collections
│   └── blog/            # Posts MDX
├── data/                # JSON: servicios-nutricion, servicios-fisio,
│                        # testimonios, colaboradores
└── styles/              # CSS global / Tailwind config

public/
├── images/              # Imágenes exportadas de Wix
├── favicon.ico
├── robots.txt
└── (sitemap generado por @astrojs/sitemap)
```

**Structure Decision**: Single web application, Astro SSG + serverless endpoints. Matches CLAUDE.md structure exactly. No separate backend needed.

## Complexity Tracking

> No violations. Table not needed.
