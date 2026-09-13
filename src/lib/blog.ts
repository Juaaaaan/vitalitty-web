import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All posts, newest first (Wix blog order). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postUrl(post: Post): string {
  return `/post/${post.data.slug}`;
}

const dateFormat = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Europe/Madrid',
});

/** Wix style: "20 oct 2025". */
export function formatDate(date: Date): string {
  return dateFormat.format(date).replace('.', '');
}

/** Plain text of a post (title, excerpt and body) for client-side search. */
export function searchText(post: Post): string {
  const body = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_\\`-]/g, ' ');
  return `${post.data.title} ${post.data.description} ${body}`
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
