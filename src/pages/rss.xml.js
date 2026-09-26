import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: 'E3M Solutions — Blog',
    description: 'E3M Solutions — Engenharia de Software, Nuvem & IA descomplicadas.',
    site: context.site ?? 'https://e3m.dev.br',
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: [post.data.type],
    })),
  });
}
