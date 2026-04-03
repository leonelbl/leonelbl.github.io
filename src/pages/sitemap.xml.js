import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  const staticPages = [
    { url: '/en/', lastmod: new Date() },
    { url: '/es/', lastmod: new Date() },
    { url: '/en/about/', lastmod: new Date() },
    { url: '/es/about/', lastmod: new Date() },
    { url: '/en/posts/', lastmod: new Date() },
    { url: '/es/posts/', lastmod: new Date() },
    { url: '/en/tags/', lastmod: new Date() },
    { url: '/es/tags/', lastmod: new Date() },
  ];

  const postsSitemap = posts.map((post) => {
    const slug = post.id.replace(/\.(en|es)\./, '.').replace(/\.(md|mdx)$/, '');
    return {
      url: `/${post.data.lang}/posts/${slug}/`,
      lastmod: post.data.date,
    };
  });

  const allPages = [...staticPages, ...postsSitemap];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${context.site}${page.url}</loc>
    <lastmod>${page.lastmod.toISOString().split('T')[0]}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
