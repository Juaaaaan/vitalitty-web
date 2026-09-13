# Quickstart: Validación de la Migración

**Feature**: `001-wix-migration`

## Prerequisites

- Node.js 18+ installed
- Git clone of this repo
- Environment variables set in `.env`:
  ```
  RESEND_API_KEY=re_xxx
  TURNSTILE_SECRET_KEY=0x4AAA...
  TURNSTILE_SITE_KEY=0x4BBB...
  CONTACT_TO_EMAIL=info@vitalitty.es
  ```

## Setup

```bash
npm install
npm run dev
```

Site runs at `http://localhost:4321`.

## Validation Scenarios

### 1. Static Pages Render (P1)

```bash
# Open each page and compare visually to https://www.vitalitty.es
open http://localhost:4321/
open http://localhost:4321/nutricion
open http://localhost:4321/fisioterapia
open http://localhost:4321/copia-de-nutricion
open http://localhost:4321/colaboraciones
open http://localhost:4321/contacto
```

**Expected**: Each page renders with content, layout and images matching the Wix original. No broken images, no missing sections.

### 2. Navigation (P1)

- Click every menu item in Header: Inicio, Servicios > Nutrición, Servicios > Fisioterapia, Colaboraciones, Blog, Contacto
- Click "Cónocenos" → scrolls to team section on Home
- Click social icons → open correct external profiles

**Expected**: All links resolve. No 404s. Menu works on mobile (hamburger).

### 3. Form Submission (P1)

```bash
# Fill and submit contact form on /contacto
# Required: nombre, email, mensaje, RGPD checkbox
# Anti-spam: Turnstile must validate
```

**Expected**:
- Valid submission → "Mensaje enviado correctamente" + email arrives at `CONTACT_TO_EMAIL`
- Missing RGPD checkbox → validation error, no email sent
- Repeat on /nutricion, /fisioterapia, /colaboraciones — each with correct `origen`

### 4. Blog (P2)

```bash
open http://localhost:4321/blog
```

- Click each category filter (Restaurantes, Recetas, Sabías qué, Video recetas)
- Use search to find a known post
- Open a post → full content renders

**Expected**: 13 posts present. Categories filter correctly. Post content matches Wix original.

### 5. SEO & URLs (P1)

```bash
# Build and check
npm run build

# Check sitemap
curl http://localhost:4321/sitemap.xml

# Verify accented URL rewrite
curl -I "http://localhost:4321/copia-de-nutrici%C3%B3n"
# Expected: 200

# Check meta tags on any page (view source)
# Expected: title, description, og:*, twitter:card present
```

### 6. Legal Pages & Cookies (P2)

```bash
open http://localhost:4321/aviso-legal
open http://localhost:4321/politica-privacidad
open http://localhost:4321/politica-cookies
```

- First visit to any page → cookie banner appears
- Accept/reject → banner dismissed, preference persisted
- Footer links to each legal page work

### 7. Lighthouse Audit (P1)

```bash
# Build production
npm run build
npm run preview

# Run Lighthouse on key pages
npx lighthouse http://localhost:4321/ --output=json --output-path=./lighthouse-home.json
npx lighthouse http://localhost:4321/nutricion --output=json --output-path=./lighthouse-nutricion.json
```

**Expected**: All scores ≥ 95 (Performance, Accessibility, Best Practices, SEO).

### 8. Link Check (P1)

```bash
# After build, run link checker
npx linkinator http://localhost:4321 --recurse
```

**Expected**: 0 broken links.

### 9. Type Check

```bash
npm run astro check
```

**Expected**: No errors, no new warnings.

## Production Checklist (before deploy)

- [ ] Client confirms real phone numbers (currently marked TODO)
- [ ] Client confirms email address (currently using `info@vitalitty.es`)
- [ ] Legal texts reviewed/provided by client
- [ ] All images exported from Wix and placed in `public/images/`
- [ ] Environment variables configured in Vercel dashboard
- [ ] Domain `vitalitty.es` pointed to Vercel
- [ ] Final Lighthouse audit on production URL
- [ ] Full link check on production URL
