# Constitución del proyecto — Vitalitty Web

Migración 1:1 de `vitalitty.es` (Wix) a Astro, desplegada en Vercel.
Estos principios son **no negociables** y prevalecen sobre decisiones puntuales.
Cualquier cambio a esta constitución debe documentarse en un commit específico.

---

## I. Fidelidad al original primero (réplica 1:1)

La web migrada **reproduce fielmente** el contenido, la estructura y la jerarquía
visual del Wix actual. No hay rediseño ni reescritura de textos.

- Los textos, títulos, servicios y testimonios se toman **literalmente** de la web
  real (`https://www.vitalitty.es`). No se inventa ni se "mejora" copy.
- La única excepción son correcciones de bugs evidentes, que se aplican **solo si
  están documentadas** como tal en el PR (ver Anexo A).

## II. Preservación de URLs y SEO (sin regresiones)

El posicionamiento actual no se toca.

- **Todas las URLs existentes se preservan tal cual**, incluidas las que llevan
  acentos (`/copia-de-nutrición`, `/blog/categories/sabías-qué`).
- Cualquier limpieza de slug (p. ej. `/copia-de-nutrición` → `/recomposicion-online`)
  es **opcional** y, si se hace, **debe** acompañarse de un redirect **301**.
- Se replican: `title`, `meta description`, Open Graph, Twitter Card, `sitemap.xml`
  y `robots.txt`. Ninguna página pierde metadatos respecto al original.

## III. Presupuesto de rendimiento

- **Static-first**: Astro en modo SSG. Cero JS por defecto; solo "islas" donde una
  interacción lo exija (carrusel de testimonios, validación de formularios).
- Objetivo **Lighthouse ≥ 95** en Performance, Accesibilidad, Best Practices y SEO
  en todas las páginas.
- Imágenes optimizadas (AVIF/WebP, tamaños responsive, lazy-loading) vía el
  componente de imagen de Astro.

## IV. Accesibilidad (WCAG 2.1 AA)

- HTML semántico, `alt` en todas las imágenes con contenido, navegación por teclado,
  foco visible y contraste AA.
- Los iconos sociales y enlaces del menú tienen nombres accesibles.

## V. Protección de datos (RGPD / LOPDGDD)

Requisito legal, no un extra. Es un negocio de salud que recoge datos personales.

- Páginas de **Aviso legal, Política de privacidad y Política de cookies** presentes
  antes de salir a producción.
- Banner de cookies con consentimiento y **checkbox de consentimiento** en cada
  formulario, enlazando a la política de privacidad.
- Ningún dato personal viaja en query strings ni se registra en logs de cliente.
- Secretos (API keys) nunca se commitean; van en variables de entorno.

## VI. Mantenibilidad

- Desarrollo por **componentes**. El contenido repetido (servicios, testimonios,
  colaboradores) vive en `src/data/*.json` o en content collections, **no** hardcodeado
  en el markup.
- Tipos y esquemas validados (content collections tipadas).
- Las convenciones de código y estructura se documentan en `CLAUDE.md` y se respetan.

## VII. Verificación

Antes de dar una tarea por terminada:

- **Comparación visual** de la página migrada contra el original de Wix.
- **Comprobación de enlaces** (sin rotos) y de que las redirecciones 301 resuelven.
- **Prueba real de envío** de cada formulario (llega el correo, funciona el anti-spam).
- `astro check` y build sin errores ni warnings nuevos.

---

## Anexo A — Bugs del original a corregir (documentados)

Estos desajustes del Wix actual se corrigen en la migración y se anotan en el PR:

- **Teléfonos**: el número mostrado no coincide con el enlace `tel:`
  (p. ej. muestra `657.423.574` pero enlaza a `690071950`). Verificar el número real
  con el cliente antes de fijarlo.
- **Emails**: los `mailto:` apuntan a direcciones incorrectas
  (`info@vitalitty.com`, `info@mysite.com`) mientras el texto dice `info@vitalitty.es`.
  Unificar al correo real confirmado por el cliente.

## Anexo B — Gobernanza

- Esta constitución se revisa si cambia el alcance (p. ej. si más adelante se añade
  reserva de cita online o portal de paciente, que hoy quedan **fuera de alcance**).
