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
    // Optional extra photos (process shots, details). When present, the work's
    // page shows a carousel; the main `image` is always the first slide.
    gallery: z.array(z.object({
      image: z.string(),
      label: z.string().default(''),    // short tab label, e.g. "Detail" / "Day 8"
      caption: z.string().default(''),  // line shown over the photo
    })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),     // lower = earlier in the grid
  }),
});

// Worlds — bodies of work (themed series). Shown as app-icon "squircle" tiles.
// The two/three colours compose the tile gradient; `count` is a curated total
// (not auto-derived) so it can include works that aren't online.
const worlds = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    blurb: z.string().default(''),
    years: z.string().default(''),      // e.g. "2024 — present"
    count: z.number().default(0),       // e.g. 9 works
    colorLight: z.string().default('#FFE2C9'),
    colorMid: z.string().default('#FF9A75'),
    colorDeep: z.string().default('#C44A1F'),
    order: z.number().default(0),
  }),
});

// Editions — limited prints, shown as smaller app-icon tiles on the Worlds page.
const editions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    editionLabel: z.string().default(''), // e.g. "Edition of 30"
    size: z.string().default(''),         // e.g. "12 × 16 in."
    price: z.string().default('Inquire'),
    colorLight: z.string().default('#FFD4B8'),
    colorMid: z.string().default('#FF7A3D'),
    colorDeep: z.string().default('#5A1A0A'),
    order: z.number().default(0),
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

export const collections = { artworks, exhibitions, worlds, editions, site };
