import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIA_IDS } from './data/blog-categorias';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Original Wix slug, accents included: served at /post/{slug}. */
      slug: z.string(),
      categories: z.array(z.enum(CATEGORIA_IDS)).default([]),
      date: z.coerce.date(),
      description: z.string(),
      image: image().optional(),
      author: z.string().default('Vitalitty'),
      minutesToRead: z.number().int().positive().optional(),
    }),
});

export const collections = { blog };
