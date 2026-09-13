# CLAUDE.md — Vitalitty Web

Instrucciones para trabajar en este repositorio con Claude Code.

## Qué es este proyecto

Migración **1:1** de la web `https://www.vitalitty.es` (actualmente en Wix) a un
sitio en **Astro**, desplegado en **Vercel**. No es un rediseño: se replica el
contenido, la estructura y las URLs del original. Ver `.specify/memory/constitution.md` para los
principios no negociables.

Vitalitty es una clínica de **nutrición y fisioterapia** en Perales de Tajuña
(Madrid). Equipo: Jesús García (nutrición, CEO) y Rubén Horcajo (fisioterapia).

## Stack

- **Astro** (v7, la última) con TypeScript.
- Adaptador **@astrojs/vercel** (para los endpoints de formularios como funciones).
- `@astrojs/sitemap` y `@astrojs/mdx`.
- Email: **Resend**. Anti-spam: **Cloudflare Turnstile**.
- Estilos: CSS/Tailwind (a decidir en el plan; mantener el look del original).

## Comandos

```bash
npm install
npm run dev        # servidor local
npm run build      # build de producción
npm run preview    # previsualizar el build
npm run astro check  # comprobación de tipos/diagnósticos
```

## Estructura de carpetas

```
src/
  components/   # Header, Footer, ServiceCard, TeamMember, TestimonialCarousel,
                # CollaboratorCard, BlogCard, ContactForm
  layouts/      # BaseLayout.astro (meta SEO + OG, header y footer)
  pages/        # una .astro por ruta; blog/ con [slug] y categorias/[categoria]
  pages/api/    # endpoints de formularios (funciones serverless en Vercel)
  content/      # blog/ (MDX) + config.ts con el schema
  data/         # servicios-nutricion.json, servicios-fisio.json,
                # testimonios.json, colaboradores.json
  styles/
public/         # imágenes exportadas de Wix, favicon, robots.txt
```

## Reglas de fidelidad al contenido

- El copy se toma **literal** del original. Ante la duda, no inventar: dejar un
  `TODO` y preguntar.
- El contenido repetido va en `src/data/*.json` o en content collections, nunca
  hardcodeado en el markup.
- Cualquier desviación respecto al original se documenta en el PR (ver Anexo A de
  la constitución).

## Mapa del sitio (rutas a replicar)

Páginas estáticas: `/`, `/nutricion`, `/fisioterapia`, `/copia-de-nutrición`
(Recomposición Online), `/colaboraciones`, `/contacto`.
Blog: `/blog`, `/blog/categories/{restaurantes,recetas,sabías-qué,video-recetas}`,
y `/post/{slug}` (13 entradas actuales).

Menú: Inicio · Cónocenos (ancla a la home) · Servicios (Nutrición / Fisioterapia)
· Colaboraciones · Blog · Contacto. Sociales: Instagram, TikTok, YouTube, Facebook.

## URLs y redirecciones

- **Por defecto se preservan las URLs exactas del original**, incluidas las
  acentuadas, para no romper SEO.
- Si se limpia algún slug, añadir el **301** en `vercel.json` (o en la config de
  Astro). Candidatos opcionales: `/copia-de-nutrición` → `/recomposicion-online`.
- Nota técnica: las rutas de archivo con acentos pueden dar problemas; si se opta
  por preservar una URL acentuada, gestionarla con redirect/rewrite en vez de un
  archivo con tilde en el nombre.

## SEO

- Cada página usa `BaseLayout` y define `title`, `description` y OG a partir de los
  metadatos del original.
- Regenerar `sitemap.xml` con `@astrojs/sitemap`. Mantener `robots.txt`.

## Formularios

- Un único componente `ContactForm` reutilizado en Contacto, Nutrición,
  Fisioterapia y Colaboraciones, con un campo oculto `origen` que identifica la página.
- El envío va a un endpoint en `src/pages/api/` que usa Resend.
- Incluir honeypot + Turnstile + checkbox de consentimiento RGPD.
- Variables de entorno (nunca en el repo): `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`,
  `TURNSTILE_SITE_KEY`, `CONTACT_TO_EMAIL`.

## Commits y PRs

- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`…).
- Una tarea del board = una rama = un PR pequeño y revisable.
- Cada PR pasa `astro check` + build y, si aplica, la comparación visual contra el
  original antes de fusionar.

## Fuera de alcance (hoy)

Reserva de cita online, pagos, portal de paciente, multi-idioma. Si se piden,
actualizar primero la constitución.
