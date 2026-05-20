import { defineCollection, z } from 'astro:content';

// Artworks — one Markdown file per work. The body (after the frontmatter) is
// the optional "studio note" shown on the detail page.
const artworks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    series: z.string().default('Works'),
    category: z.string().default('Painting'), // Painting / Drawing / Sculpture / Edition...
    year: z.number(),
    medium: z.string(),
    sizeIn: z.string().default(''),   // e.g. "48 × 36 in."
    sizeCm: z.string().default(''),   // e.g. "(122 × 91 cm)"
    status: z.enum(['On view', 'Available', 'Sold', 'Private collection', 'Reserved']).default('Available'),
    edition: z.string().nullable().default(null), // "Edition of 30" or empty
    price: z.string().default('Inquire'),
    image: z.string().optional(),     // /uploads/your-photo.jpg (uploaded via CMS)
    alt: z.string().default(''),
    featured: z.boolean().default(false),
    order: z.number().default(0),     // lower = earlier in the grid
  }),
});

// Exhibitions — status is DERIVED from dates, never edited by hand.
const exhibitions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    city: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    image: z.string().optional(),
    alt: z.string().default(''),
    featured: z.boolean().default(false),
    rsvp: z.boolean().default(true),
  }),
});

// Singletons (About + studio settings) edited as single files in the CMS.
const site = defineCollection({
  type: 'content',
  schema: z.object({
    lede: z.string().optional(),
    portrait: z.string().optional(),
    portraitAlt: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
  }).passthrough(),
});

export const collections = { artworks, exhibitions, site };
