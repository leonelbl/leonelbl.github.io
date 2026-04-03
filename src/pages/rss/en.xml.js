import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { defaultLang } from '../../lib/i18n';

export async function GET(context) {
  const posts = await getCollection('posts');
  const sortedPosts = posts
    .filter(post => post.data.lang === defaultLang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'My Tools Blog',
    description: 'Useful notes and tools for everyday use',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/en/posts/${post.id.replace(/\.(en|es)\./, '.').replace(/\.(md|mdx)$/, '')}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
