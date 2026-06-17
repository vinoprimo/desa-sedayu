import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    type: z.enum(['pengumuman', 'berita']),
    image: z.string().optional(),
  }),
});

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['Makanan', 'Minuman', 'Kerajinan', 'Pertanian', 'Jasa', 'Lainnya']),
    price: z.string(),
    owner: z.string(),
    whatsapp: z.string(),
    location: z.string(),
    image: z.string(),
    featured: z.boolean().default(false),
    available: z.boolean().default(true),
  }),
});

export const collections = { news, products };
