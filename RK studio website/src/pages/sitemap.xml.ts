import type { APIRoute } from 'astro';
import { getArtworks } from '../lib/content';
import { siteConfig } from '../siteConfig';

export const GET: APIRoute = async () => {
  const base = siteConfig.domain.replace(/\/$/, '');
  const artworks = await getArtworks();
  const urls = [
    '/', '/artworks/', '/worlds/', '/exhibitions/', '/about/',
    ...artworks.map((w) => `/artworks/${w.slug}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
