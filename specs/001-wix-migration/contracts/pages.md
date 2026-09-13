# Page Routes Contract

All pages serve HTML with status 200 unless noted. Every page includes: BaseLayout (SEO meta, OG, header, footer), responsive design, WCAG 2.1 AA.

## Static Pages

| Route | File | Key Components |
|-------|------|----------------|
| `/` | `src/pages/index.astro` | Hero, TeamMember×2, WhyUs, TestimonialCarousel, ContactInfo |
| `/nutricion` | `src/pages/nutricion.astro` | ServiceCard×6 (from servicios-nutricion.json), ContactForm |
| `/fisioterapia` | `src/pages/fisioterapia.astro` | ServiceCard×6 (from servicios-fisio.json), ContactForm |
| `/copia-de-nutricion` | `src/pages/copia-de-nutricion.astro` | Recomposición Online landing (detail page) |
| `/colaboraciones` | `src/pages/colaboraciones.astro` | CollaboratorCard×8 (from colaboradores.json), ContactForm |
| `/contacto` | `src/pages/contacto.astro` | Address, phones, email, hours, ContactForm, map |
| `/aviso-legal` | `src/pages/aviso-legal.astro` | Legal text |
| `/politica-privacidad` | `src/pages/politica-privacidad.astro` | Privacy policy text |
| `/politica-cookies` | `src/pages/politica-cookies.astro` | Cookie policy text |

## Blog Pages

| Route | File | Key Components |
|-------|------|----------------|
| `/blog` | `src/pages/blog/index.astro` | BlogCard list, search input, category links |
| `/blog/categories/{cat}` | `src/pages/blog/categories/[categoria].astro` | Filtered BlogCard list |
| `/post/{slug}` | `src/pages/post/[slug].astro` | Full post content (MDX rendered) |

**Categories**: `restaurantes`, `recetas`, `sabias-que`, `video-recetas`

## Rewrites (vercel.json)

> **Sustituido en Fase 5** por rutas acentuadas nativas (`getStaticPaths`) + 301 desde la variante sin acento (`redirects` en `astro.config.mjs`). Ver research.md §5.

| Source (preserved URL) | Destination (clean file) |
|------------------------|--------------------------|
| `/copia-de-nutrición` | `/copia-de-nutricion` |
| `/blog/categories/sabías-qué` | `/blog/categories/sabias-que` |

## Redirects (if slug cleanup applied)

| Source | Destination | Status |
|--------|-------------|--------|
| `/copia-de-nutrición` | `/recomposicion-online` | 301 (optional, only if client approves) |

## Shared Components

| Component | Used In | Props |
|-----------|---------|-------|
| Header | BaseLayout | `currentPath` |
| Footer | BaseLayout | — |
| ServiceCard | nutricion, fisioterapia | `servicio: Servicio` |
| TeamMember | index | `nombre, rol, descripcion, imagen` |
| TestimonialCarousel | index | `testimonios: Testimonio[]` |
| CollaboratorCard | colaboraciones | `colaborador: Colaborador` |
| BlogCard | blog/index, blog/categories | `post: BlogPost` |
| ContactForm | contacto, nutricion, fisioterapia, colaboraciones | `origen: string` |
| CookieBanner | BaseLayout | — |

## SEO Contract

Every page MUST include in `<head>`:
- `<title>` — Matching original Wix page
- `<meta name="description">` — Matching original
- `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- `<meta name="twitter:card" content="summary_large_image">`
- Canonical URL
