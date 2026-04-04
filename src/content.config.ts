import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    translation_key: z.string(),
    date: z.date(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    lang: z.enum(['en', 'es']),
    description: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
