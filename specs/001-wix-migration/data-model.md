# Data Model: Migración 1:1 Wix → Astro

**Feature**: `001-wix-migration` | **Date**: 2026-09-03

## Entities

### Servicio (JSON)

Almacenado en `src/data/servicios-nutricion.json` y `src/data/servicios-fisio.json`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Slug único (e.g. `nutricion-presencial`) |
| nombre | string | yes | Nombre mostrado en tarjeta |
| descripcion | string | yes | Texto descriptivo (literal del Wix) |
| precio | string | no | Texto de precio si aplica (e.g. "45€/sesión") |
| enlace | string | no | URL interna si tiene página de detalle (e.g. `/copia-de-nutrición`) |
| icono | string | no | Nombre o ruta del icono asociado |

**Validation**: `id` único dentro de cada archivo. `nombre` y `descripcion` no vacíos.

### Testimonio (JSON)

Almacenado en `src/data/testimonios.json`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Orden en el carrusel |
| nombre | string | yes | Nombre del paciente |
| texto | string | yes | Texto del testimonio (literal) |
| destacado | boolean | no | Si se muestra con énfasis visual |

**Validation**: `id` único, `texto` no vacío.

### Colaborador (JSON)

Almacenado en `src/data/colaboradores.json`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Slug único |
| nombre | string | yes | Nombre del colaborador/marca |
| logo | string | yes | Ruta a imagen en `public/images/` |
| enlace | string | yes | URL externa |

**Validation**: `enlace` debe ser URL válida. `logo` debe existir en public/.

### Post de Blog (Content Collection MDX)

Definido en `src/content/config.ts`, archivos en `src/content/blog/`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | Título del post |
| slug | string | yes | Slug para la URL `/post/{slug}` |
| category | enum | yes | `restaurantes` \| `recetas` \| `sabias-que` \| `video-recetas` |
| date | date | yes | Fecha de publicación |
| description | string | yes | Meta description y resumen |
| image | string | no | Ruta imagen destacada |
| author | string | no | Autor (default: "Vitalitty") |

**Content collection schema** (`src/content/config.ts`):
```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['restaurantes', 'recetas', 'sabias-que', 'video-recetas']),
    date: z.date(),
    description: z.string(),
    image: z.string().optional(),
    author: z.string().default('Vitalitty'),
  }),
});

export const collections = { blog };
```

### Página Legal (Astro pages)

No necesita schema — son páginas estáticas con texto fijo.

| Page | Route | Content source |
|------|-------|---------------|
| Aviso Legal | `/aviso-legal` | Texto proporcionado por cliente o plantilla LOPDGDD |
| Política de Privacidad | `/politica-privacidad` | Texto proporcionado por cliente o plantilla LOPDGDD |
| Política de Cookies | `/politica-cookies` | Texto proporcionado por cliente o plantilla LOPDGDD |

### Miembro del Equipo (inline en Home)

Datos embebidos en `index.astro` o extraídos a `src/data/equipo.json` si se reutilizan.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| nombre | string | yes | Nombre completo |
| rol | string | yes | Cargo (e.g. "CEO y Nutricionista") |
| descripcion | string | yes | Credenciales y bio breve |
| imagen | string | yes | Foto en `public/images/` |

## Relationships

```
Home
├── Equipo[] (inline)
├── Testimonios[] (carrusel, desde testimonios.json)
└── Contacto info (inline)

Nutrición
├── Servicios[] (desde servicios-nutricion.json)
│   └── Recomposición Online → /copia-de-nutrición (enlace)
└── ContactForm (componente compartido)

Fisioterapia
├── Servicios[] (desde servicios-fisio.json)
└── ContactForm (componente compartido)

Colaboraciones
├── Colaboradores[] (desde colaboradores.json)
└── ContactForm (componente compartido)

Blog
├── Posts[] (content collection)
│   └── Categoría (enum, filtro)
└── Búsqueda (client-side)

Contacto
└── ContactForm (componente compartido)
```

## State Transitions

No aplica — sitio estático sin estado persistente en el servidor. El único estado client-side es:
- **Cookie consent**: `localStorage` flag (`cookies-accepted: true|false`)
- **Carrusel de testimonios**: índice actual del slide (en memoria, no persistido)
