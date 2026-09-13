# Tasks: Migración 1:1 Wix → Astro

**Input**: Design documents from `/specs/001-wix-migration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested. Manual validation via quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Astro project initialization, dependencies, base config

- [x] T001 Initialize Astro v5 project with TypeScript in project root (astro.config.mjs, tsconfig.json, package.json)
- [x] T002 Install dependencies: @astrojs/vercel, @astrojs/sitemap, @astrojs/mdx, resend, tailwindcss v4
- [x] T003 [P] Configure Tailwind CSS v4 in src/styles/global.css with base theme matching Wix color palette
- [x] T004 [P] Configure astro.config.mjs: vercel adapter (hybrid output for API routes), sitemap integration, mdx integration
- [x] T005 [P] Create public/robots.txt matching original Wix robots.txt
- [x] T006 [P] Place favicon.ico in public/
- [x] T007 [P] Create vercel.json with rewrites for accented URLs: /copia-de-nutrición → /copia-de-nutricion, /blog/categories/sabías-qué → /blog/categories/sabias-que
- [x] T008 [P] Create .env.example with RESEND_API_KEY, TURNSTILE_SECRET_KEY, TURNSTILE_SITE_KEY, CONTACT_TO_EMAIL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Layout, global components, and data files that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create BaseLayout in src/layouts/BaseLayout.astro with HTML skeleton, SEO meta props (title, description, ogTitle, ogDescription, ogImage, ogUrl, twitterCard), canonical URL, and slot for page content
- [x] T010 Create Header component in src/components/Header.astro with nav menu (Inicio, Conócenos anchor, Servicios dropdown with Nutrición/Fisioterapia, Colaboraciones, Blog, Contacto), mobile hamburger, and social icons (Instagram, TikTok, YouTube, Facebook) with accessible labels
- [x] T011 [P] Create Footer component in src/components/Footer.astro with contact info, social links, and links to legal pages (aviso-legal, politica-privacidad, politica-cookies)
- [x] T012 [P] Create src/data/servicios-nutricion.json with 6 services (Nutrición Presencial, Antropometría/plicometría, Nutrición Online, Nutrición + entrenamiento, Recomposición Online, Personal Foodshopper) — copy literal from Wix
- [x] T013 [P] Create src/data/servicios-fisio.json with 6 services (Sesión Fisioterapia, Técnica invasiva ecoguiada, Pilates, Ecografía, Valoración y sesión, Fisioterapia a domicilio) — copy literal from Wix
- [x] T014 [P] Create src/data/testimonios.json with testimonials from Wix — copy literal
- [x] T015 [P] Create src/data/colaboradores.json with 8 collaborators (nombre, logo, enlace) — copy literal from Wix
- [x] T016 [P] Export and place all images from Wix into public/images/ (team photos, service icons, collaborator logos, blog images)

**Checkpoint**: Foundation ready — layout renders, data files populated, user story implementation can begin

---

## Phase 3: User Story 1 — Visitante navega páginas de servicios (Priority: P1) 🎯 MVP

**Goal**: All static pages render with content identical to Wix original

**Independent Test**: Navigate each page and visually compare against https://www.vitalitty.es

### Implementation for User Story 1

- [x] T017 [P] [US1] Create ServiceCard component in src/components/ServiceCard.astro — props: servicio (id, nombre, descripcion, precio?, enlace?, icono?)
- [x] T018 [P] [US1] Create TeamMember component in src/components/TeamMember.astro — props: nombre, rol, descripcion, imagen
- [x] T019 [P] [US1] Create TestimonialCarousel island in src/components/TestimonialCarousel.astro — client:visible, vanilla JS, auto-advance, swipe support, props: testimonios[]
- [x] T020 [US1] Create Home page in src/pages/index.astro — hero section ("Cuidar tu cuerpo, comienza con saber entenderlo"), TeamMember×2 (Jesús García, Rubén Horcajo), "¿Por qué nosotros?" section, TestimonialCarousel, contact info block with correct phones and email. SEO meta from Wix original.
- [x] T021 [P] [US1] Create Nutrición page in src/pages/nutricion.astro — 6 ServiceCards from servicios-nutricion.json, "Recomposición Online" card links to /copia-de-nutrición. SEO meta from Wix.
- [x] T022 [P] [US1] Create Fisioterapia page in src/pages/fisioterapia.astro — 6 ServiceCards from servicios-fisio.json. SEO meta from Wix.
- [x] T023 [P] [US1] Create Recomposición Online page in src/pages/copia-de-nutricion.astro — landing detail for the online program. SEO meta from Wix.
- [x] T024 [P] [US1] Create Contacto page in src/pages/contacto.astro — address, phones, email, opening hours, map embed. SEO meta from Wix. (ContactForm added in US2 phase)

**Checkpoint**: All static pages render. Visual comparison against Wix passes. Menu navigation works.

---

## Phase 4: User Story 2 — Visitante envía formulario de contacto (Priority: P1)

**Goal**: Contact forms on 4 pages send email via Resend with anti-spam protection

**Independent Test**: Submit form on /contacto, /nutricion, /fisioterapia, /colaboraciones — email arrives with correct origen

### Implementation for User Story 2

- [x] T025 [US2] Create ContactForm component in src/components/ContactForm.astro — fields: nombre, email, telefono, mensaje, consentimiento checkbox (links to /politica-privacidad), honeypot (_honey hidden), Turnstile widget. Props: origen string. Client-side validation + Turnstile script (client:load island).
- [x] T026 [US2] Create API endpoint in src/pages/api/contact.ts — per contracts/api-contact.md: honeypot check → Turnstile verify → input validation → Resend send. Env vars: RESEND_API_KEY, TURNSTILE_SECRET_KEY, CONTACT_TO_EMAIL.
- [x] T027 [P] [US2] Add ContactForm (origen="nutricion") to src/pages/nutricion.astro
- [x] T028 [P] [US2] Add ContactForm (origen="fisioterapia") to src/pages/fisioterapia.astro
- [x] T029 [P] [US2] Add ContactForm (origen="contacto") to src/pages/contacto.astro
- [x] T029b [P] [US2] Add ContactForm (origen="colaboraciones") to src/pages/colaboraciones.astro — _completado en Fase 8 junto a T046_

**Checkpoint**: Forms submit on all 4 pages, email arrives with correct origen, anti-spam rejects bots, RGPD checkbox enforced.

---

## Phase 5: User Story 4 — SEO y URLs preservadas (Priority: P1)

**Goal**: All existing Wix URLs resolve. SEO meta tags match original.

**Independent Test**: Crawl all known URLs → 200 or 301→200. Check meta tags on each page.

### Implementation for User Story 4

- [x] T030 [US4] Verify all SEO meta tags on every page match Wix original (title, description, OG, Twitter Card) — audit and fix any discrepancies in BaseLayout props usage
- [x] T031 [US4] Configure @astrojs/sitemap in astro.config.mjs with site URL and verify sitemap.xml includes all public routes
- [x] T032 [US4] Verify vercel.json rewrites work: /copia-de-nutrición → 200, /blog/categories/sabías-qué → 200 — _@astrojs/vercel emite Build Output API sin los rewrites de vercel.json: se sustituyen por rutas acentuadas nativas (getStaticPaths) + 301 desde la variante sin acento (astro.config `redirects`)_
- [x] T033 [US4] Run linkinator or similar link checker on build output — fix any broken links

**Checkpoint**: 0 broken links. All Wix URLs resolve. Sitemap complete. Meta tags match.

---

## Phase 6: User Story 3 — Visitante lee el blog (Priority: P2)

**Goal**: Blog with 13 posts, category filtering, search, individual post pages

**Independent Test**: Navigate /blog, filter by each category, search, open a post — content matches Wix

### Implementation for User Story 3

- [x] T034 [US3] Create content collection config in src/content/config.ts — blog collection schema: title, slug, category (enum), date, description, image?, author?
- [x] T035 [US3] Migrate 13 blog posts from Wix to src/content/blog/*.mdx — copy content literal, fill frontmatter (title, slug, category, date, description, image)
- [x] T036 [P] [US3] Create BlogCard component in src/components/BlogCard.astro — props: post (title, slug, category, date, description, image)
- [x] T037 [US3] Create Blog listing page in src/pages/blog/index.astro — BlogCard list, category filter links, client-side search input. SEO meta.
- [x] T038 [US3] Create Blog category page in src/pages/blog/categories/[categoria].astro — getStaticPaths for 4 categories, filtered BlogCard list. SEO meta.
- [x] T039 [US3] Create Post detail page in src/pages/post/[slug].astro — render MDX content, SEO meta per post frontmatter

**Checkpoint**: 13 posts visible. Categories filter correctly. Search works. Post content matches Wix.

---

## Phase 7: User Story 5 — Páginas legales y cookies (Priority: P2)

**Goal**: RGPD/LOPDGDD compliance: legal pages + cookie consent banner

**Independent Test**: Visit site first time → banner appears. Legal pages accessible from footer.

### Implementation for User Story 5

- [x] T040 [P] [US5] Create CookieBanner island in src/components/CookieBanner.astro — client:load, accept/reject buttons, saves preference to localStorage (cookies-accepted: true/false), hides on subsequent visits
- [x] T041 [P] [US5] Create Aviso Legal page in src/pages/aviso-legal.astro with legal text (client-provided or LOPDGDD template). SEO meta.
- [x] T042 [P] [US5] Create Política de Privacidad page in src/pages/politica-privacidad.astro with privacy text. SEO meta.
- [x] T043 [P] [US5] Create Política de Cookies page in src/pages/politica-cookies.astro with cookie policy text. SEO meta.
- [x] T044 [US5] Add CookieBanner to BaseLayout.astro so it appears on every page

**Checkpoint**: Cookie banner on first visit. Legal pages render. Footer links work. ContactForm RGPD checkbox links to privacy policy.

---

## Phase 8: User Story 6 — Colaboraciones (Priority: P3)

**Goal**: Collaborations page with 8 partner cards and contact form

**Independent Test**: Navigate /colaboraciones, verify 8 logos with links, submit form

### Implementation for User Story 6

- [x] T045 [P] [US6] Create CollaboratorCard component in src/components/CollaboratorCard.astro — props: colaborador (nombre, logo, enlace)
- [x] T046 [US6] Create Colaboraciones page in src/pages/colaboraciones.astro — 8 CollaboratorCards from colaboradores.json, ContactForm (origen="colaboraciones"). SEO meta from Wix.

**Checkpoint**: 8 collaborator cards visible with working external links. Form sends email with origen=colaboraciones.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility hardening, performance optimization, final validation

- [ ] T047 [P] Accessibility audit: verify WCAG 2.1 AA on all pages — keyboard navigation, focus visible, contrast AA, alt text on all images, aria labels on social/menu icons
- [ ] T048 [P] Image optimization audit: verify all images use Astro <Image> component with AVIF/WebP, responsive sizes, lazy-loading
- [ ] T049 [P] Responsive audit: test all pages on mobile (375px), tablet (768px), desktop (1280px) — fix layout issues
- [ ] T050 Run `astro check` — fix any type errors or diagnostics warnings
- [ ] T051 Run `npm run build` — verify clean production build
- [ ] T052 Run Lighthouse on all key pages (/, /nutricion, /fisioterapia, /contacto, /blog) — target ≥ 95 in all categories
- [ ] T053 Run quickstart.md validation scenarios end-to-end
- [ ] T054 Visual comparison of each migrated page against Wix original — document any deviations in PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational
- **US2 (Phase 4)**: Depends on Foundational + ContactForm needs pages from US1 to exist
- **US4 (Phase 5)**: Depends on US1 (pages must exist to audit SEO)
- **US3 (Phase 6)**: Depends on Foundational only — can run parallel with US1/US2
- **US5 (Phase 7)**: Depends on Foundational only — can run parallel with US1
- **US6 (Phase 8)**: Depends on Foundational + US2 (reuses ContactForm)
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: No story dependencies — first to implement
- **US2 (P1)**: ContactForm component created here, but pages from US1 must exist to embed it
- **US4 (P1)**: Runs after US1 — needs pages to audit
- **US3 (P2)**: Independent — blog has no dependency on service pages
- **US5 (P2)**: Independent — legal pages and banner are self-contained
- **US6 (P3)**: Needs ContactForm from US2

### Parallel Opportunities

Within Phase 2: T012-T016 all parallel (data files)
Within US1: T017-T019 parallel (components), then T020-T024 parallel (pages)
Within US2: T027-T029 parallel (adding forms to pages)
Within US3: T036 parallel with T034/T035
Within US5: T040-T043 all parallel
US3 and US5 can run in parallel after Foundational

---

## Parallel Example: User Story 1

```bash
# Components (parallel):
Task: "Create ServiceCard in src/components/ServiceCard.astro"
Task: "Create TeamMember in src/components/TeamMember.astro"
Task: "Create TestimonialCarousel in src/components/TestimonialCarousel.astro"

# Then pages (parallel, after components):
Task: "Create Home in src/pages/index.astro"
Task: "Create Nutrición in src/pages/nutricion.astro"
Task: "Create Fisioterapia in src/pages/fisioterapia.astro"
Task: "Create Recomposición Online in src/pages/copia-de-nutricion.astro"
Task: "Create Contacto in src/pages/contacto.astro"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (data + layout)
3. Complete Phase 3: US1 — static pages render
4. **STOP and VALIDATE**: Visual comparison against Wix
5. Deploy preview if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Static pages → Deploy preview (MVP!)
3. US2 → Forms working → Deploy preview
4. US4 → SEO verified → Deploy preview
5. US3 → Blog live → Deploy preview
6. US5 → Legal/cookies → Deploy preview
7. US6 → Collaborations → Deploy preview
8. Polish → Lighthouse ≥ 95 → Production ready

### Parallel Team Strategy

With multiple developers after Foundational:

- Developer A: US1 (service pages) → US2 (forms)
- Developer B: US3 (blog) → US6 (collaborations)
- Developer C: US5 (legal/cookies) → US4 (SEO audit)

---

## Notes

- [P] tasks = different files, no dependencies
- Copy literal del Wix — no inventar copy (Constitution I)
- Images must be exported from Wix first (T016) before page implementation
- Phone/email: use confirmed values from spec FR-012 (tel:690071950, info@vitalitty.es)
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
