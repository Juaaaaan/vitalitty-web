/**
 * Blog categories as published on Wix. `slug` is the original URL segment
 * (accents included) served at /blog/categories/{slug}.
 */
export const CATEGORIAS = [
  { id: 'restaurantes', nombre: 'Restaurantes', slug: 'restaurantes' },
  { id: 'recetas', nombre: 'Recetas', slug: 'recetas' },
  { id: 'sabias-que', nombre: 'Sabías qué...', slug: 'sabías-qué' },
  { id: 'video-recetas', nombre: 'Video recetas', slug: 'video-recetas' },
] as const;

export type CategoriaId = (typeof CATEGORIAS)[number]['id'];

export const CATEGORIA_IDS = CATEGORIAS.map((c) => c.id) as [
  CategoriaId,
  ...CategoriaId[],
];

export function categoriaPorId(id: CategoriaId) {
  return CATEGORIAS.find((c) => c.id === id)!;
}
