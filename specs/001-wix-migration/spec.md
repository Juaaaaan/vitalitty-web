# Feature Specification: Migración 1:1 Wix → Astro

**Feature Branch**: `001-wix-migration`

**Created**: 2026-09-03

**Status**: Draft

**Input**: Migración 1:1 de la web de Vitalitty (clínica de nutrición y fisioterapia en Perales de Tajuña, Madrid) desde Wix a Astro/Vercel. Réplica fiel de contenido, estructura y URLs.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Visitante navega páginas de servicios (Priority: P1)

Un visitante llega a la web, explora el menú, lee las páginas de Nutrición y Fisioterapia con sus tarjetas de servicio, y obtiene la misma información y experiencia visual que en el Wix actual.

**Why this priority**: Sin las páginas de servicios no hay web funcional. Son el core del negocio.

**Independent Test**: Navegar cada página estática y comparar visualmente contra el original de Wix. Todos los textos, imágenes y layout coinciden.

**Acceptance Scenarios**:

1. **Given** visitante en Home, **When** abre menú Servicios > Nutrición, **Then** ve 6 tarjetas de servicio con textos idénticos al original
2. **Given** visitante en Nutrición, **When** hace clic en "Recomposición Online", **Then** llega a `/copia-de-nutrición` con el detalle del programa
3. **Given** visitante en Fisioterapia, **When** ve las tarjetas, **Then** encuentra los 6 servicios con descripción
4. **Given** visitante en Home, **When** scrollea, **Then** ve hero, equipo, "¿Por qué nosotros?", testimonios y contacto en ese orden

---

### User Story 2 - Visitante envía formulario de contacto (Priority: P1)

Un visitante rellena el formulario de contacto (disponible en Contacto, Nutrición, Fisioterapia y Colaboraciones), acepta la casilla RGPD, pasa el anti-spam y el mensaje llega por email a la clínica.

**Why this priority**: Los formularios son el canal principal de captación de pacientes. Sin ellos, la web no cumple su función comercial.

**Independent Test**: Enviar un formulario en cada página que lo tiene; verificar que llega el email con el campo `origen` correcto.

**Acceptance Scenarios**:

1. **Given** formulario en /contacto, **When** visitante rellena campos y acepta RGPD, **Then** mensaje llega al email de la clínica con `origen: contacto`
2. **Given** formulario sin checkbox RGPD marcado, **When** envía, **Then** se muestra error de validación, no se envía
3. **Given** bot intenta enviar, **When** falla Turnstile, **Then** formulario rechazado
4. **Given** formulario con honeypot rellenado, **When** envía, **Then** descartado silenciosamente

---

### User Story 3 - Visitante lee el blog (Priority: P2)

Un visitante navega el blog, filtra por categoría (Restaurantes, Recetas, Sabías qué, Video recetas), busca por texto y lee un post individual.

**Why this priority**: Blog aporta SEO y contenido, pero no es el flujo primario de captación. Las 13 entradas deben estar migradas fielmente.

**Independent Test**: Navegar `/blog`, filtrar por cada categoría, buscar un término, abrir un post y comparar contenido con el original.

**Acceptance Scenarios**:

1. **Given** visitante en /blog, **When** selecciona categoría "Recetas", **Then** ve solo posts de esa categoría
2. **Given** visitante en /blog, **When** busca "quinoa", **Then** resultados relevantes aparecen
3. **Given** visitante hace clic en un post, **When** carga `/post/{slug}`, **Then** contenido idéntico al original de Wix

---

### User Story 4 - SEO y URLs preservadas (Priority: P1)

Los motores de búsqueda encuentran todas las URLs existentes sin cambios. Cualquier URL del Wix actual resuelve en el nuevo sitio (directa o vía 301).

**Why this priority**: La clínica depende del posicionamiento orgánico local. Perder URLs = perder pacientes.

**Independent Test**: Crawlear todas las URLs conocidas del sitio original y verificar 200 o 301→200 en el nuevo.

**Acceptance Scenarios**:

1. **Given** URL existente con acento (`/copia-de-nutrición`), **When** navegador la solicita, **Then** responde 200
2. **Given** URL de post existente (`/post/{slug}`), **When** crawler la indexa, **Then** encuentra `title`, `description`, OG y Twitter Card equivalentes al original
3. **Given** `/sitemap.xml`, **When** crawler lo lee, **Then** incluye todas las rutas públicas

---

### User Story 5 - Páginas legales y cookies (Priority: P2)

El sitio cumple RGPD/LOPDGDD con aviso legal, política de privacidad, política de cookies y banner de consentimiento.

**Why this priority**: Obligatorio legalmente antes de producción, pero no afecta la experiencia core.

**Independent Test**: Acceder a cada página legal, verificar que el banner aparece en primera visita, y que rechazar cookies impide tracking.

**Acceptance Scenarios**:

1. **Given** primera visita, **When** página carga, **Then** banner de cookies visible con opciones aceptar/rechazar
2. **Given** visitante en footer, **When** hace clic en "Política de privacidad", **Then** llega a página con el texto legal completo
3. **Given** formulario de contacto, **When** visitante lee checkbox RGPD, **Then** enlace a política de privacidad funciona

---

### User Story 6 - Colaboraciones (Priority: P3)

Un visitante ve la rejilla de 8 colaboradores con logo y enlace, y puede enviar un formulario para proponer colaboración.

**Why this priority**: Página secundaria, menor tráfico, pero completa el sitio.

**Independent Test**: Navegar a /colaboraciones, verificar 8 logos con enlaces, enviar formulario.

**Acceptance Scenarios**:

1. **Given** visitante en /colaboraciones, **When** página carga, **Then** ve 8 tarjetas con logo y enlace externo funcional
2. **Given** visitante rellena formulario de colaboración, **When** envía, **Then** email llega con `origen: colaboraciones`

---

### Edge Cases

- Visitante con JS deshabilitado: formularios no envían (necesitan Turnstile), pero todo el contenido estático es legible
- URL con encoding diferente para acentos: redirect o rewrite para variantes comunes
- Imagen de Wix no exportada: placeholder visible con `alt` descriptivo y `TODO` en el código
- Formulario con campos excesivamente largos: validación server-side trunca/rechaza

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Sistema DEBE servir todas las páginas estáticas (Home, Nutrición, Fisioterapia, Recomposición Online, Colaboraciones, Contacto) con contenido idéntico al original Wix
- **FR-002**: Sistema DEBE renderizar el blog con listado, filtrado por 4 categorías, búsqueda y página individual por post (13 entradas)
- **FR-003**: Sistema DEBE enviar emails desde los formularios de Contacto, Nutrición, Fisioterapia y Colaboraciones vía Resend, con campo `origen`
- **FR-004**: Formularios DEBEN incluir honeypot + Cloudflare Turnstile + checkbox RGPD obligatorio
- **FR-005**: Sistema DEBE preservar todas las URLs existentes del Wix, incluyendo las acentuadas
- **FR-006**: Sistema DEBE generar `sitemap.xml` y servir `robots.txt`
- **FR-007**: Cada página DEBE tener `title`, `meta description`, Open Graph y Twitter Card equivalentes al original
- **FR-008**: Sistema DEBE incluir páginas legales: aviso legal, política de privacidad, política de cookies
- **FR-009**: Sistema DEBE mostrar banner de consentimiento de cookies en primera visita
- **FR-010**: Cabecera DEBE tener menú con submenú Servicios y enlaces sociales (Instagram, TikTok, YouTube, Facebook)
- **FR-011**: Sistema DEBE ser responsive (mobile-first) y cumplir WCAG 2.1 AA
- **FR-012**: Teléfonos y emails DEBEN ser correctos y consistentes entre texto y enlaces `tel:690071950`/`mailto:info@vitalitty.es`
- **FR-013**: Imágenes DEBEN estar optimizadas (AVIF/WebP, lazy-loading, responsive sizes)

### Key Entities

- **Servicio**: nombre, descripción, precio (opcional), categoría (nutrición/fisioterapia), enlace a detalle (opcional)
- **Testimonio**: nombre del paciente, texto, puntuación o destacado
- **Colaborador**: nombre, logo (imagen), enlace externo
- **Post (Blog)**: título, slug, categoría, fecha, contenido MDX, imagen destacada, metadatos SEO
- **Página legal**: tipo (aviso-legal/privacidad/cookies), contenido

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Lighthouse ≥ 95 en Performance, Accesibilidad, Best Practices y SEO en todas las páginas
- **SC-002**: 0 enlaces rotos verificados con crawler
- **SC-003**: 100% de URLs del Wix original resuelven (200 directo o 301→200)
- **SC-004**: Cada formulario entrega email en < 30 segundos
- **SC-005**: Comparación visual pixel-approximate entre cada página migrada y su original Wix
- **SC-006**: `astro check` y build sin errores ni warnings

## Assumptions

- Las imágenes del Wix original se exportan y colocan en `public/` antes de empezar la maquetación
- El email de contacto definitivo (info@vitalitty.es) y teléfono (690071950) confirmados
- No se necesita CMS: el contenido se gestiona como ficheros en el repo
- El dominio `vitalitty.es` se reconfigurará en Vercel al desplegar (fuera del scope técnico de este plan)
- Los textos legales los proporciona el cliente o se redactan con plantilla estándar LOPDGDD
