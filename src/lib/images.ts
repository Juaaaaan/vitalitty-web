import type { ImageMetadata } from 'astro';

/**
 * Resolves the `/images/...` paths stored in `src/data/*.json` to the
 * optimizable assets under `src/assets/images/`, so data files stay plain
 * strings while components render them with `astro:assets`.
 */
const assets = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function resolveImage(path: string): ImageMetadata {
  const key = `/src/assets${path.startsWith('/') ? path : `/${path}`}`;
  const mod = assets[key];
  if (!mod) {
    throw new Error(`Image not found in src/assets: ${path}`);
  }
  return mod.default;
}
