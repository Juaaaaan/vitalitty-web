// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.vitalitty.es',
  // Inline the (small) Tailwind bundle to avoid a render-blocking request.
  build: { inlineStylesheets: 'always' },
  adapter: vercel(),
  // Legacy Wix URLs. Accented routes are generated natively by getStaticPaths.
  redirects: {
    '/copia-de-nutricion': {
      status: 301,
      destination: '/copia-de-nutrici%C3%B3n',
    },
    '/sitemap.xml': { status: 301, destination: '/sitemap-index.xml' },
    '/pages-sitemap.xml': { status: 301, destination: '/sitemap-index.xml' },
    '/blog-posts-sitemap.xml': {
      status: 301,
      destination: '/sitemap-index.xml',
    },
    '/blog-categories-sitemap.xml': {
      status: 301,
      destination: '/sitemap-index.xml',
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !/^https?:\/\/[^/]+\/(api|404)(\/|$)/.test(page),
      // Match Wix URLs: no trailing slash, home is the bare origin.
      serialize: (item) => ({
        ...item,
        url: item.url.replace(/(?<=.)\/+$/, ''),
      }),
    }),
    mdx(),
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      CONTACT_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Vitalitty Web <onboarding@resend.dev>',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
