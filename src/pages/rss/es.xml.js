import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import es from '../../i18n/es.json';

export async function GET(context) {
  const posts = await getCollection('posts');
  const sortedPosts = posts
    .filter(post => post.data.lang === 'es')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${es.global.title} | Senior FullStack Developer`,
    description: 'Notas, herramientas y guías útiles para desarrolladores',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/es/posts/${post.id.replace(/\.(en|es)\./, '.').replace(/\.(md|mdx)$/, '')}/`,
    })),
    customData: '<language>es-es</language>',
  });
}
