import { getCollection, getEntry } from 'astro:content';

export async function getArtworks() {
  const all = await getCollection('artworks');
  return all.sort((a, b) => (a.data.order - b.data.order) || (b.data.year - a.data.year));
}

export async function getWorlds() {
  const all = await getCollection('worlds');
  return all.sort((a, b) => (a.data.order - b.data.order) || a.data.title.localeCompare(b.data.title));
}

export async function getEditions() {
  const all = await getCollection('editions');
  return all.sort((a, b) => (a.data.order - b.data.order) || a.data.title.localeCompare(b.data.title));
}

// Lighten a hex colour toward white by `amount` (0..1). Used to build the
// soft "photo-stack" tiles that fan out behind each world tile.
export function lighten(hex: string, amount: number) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export type ExStatus = 'On view' | 'Upcoming' | 'Past';
export function exhibitionStatus(start: Date, end: Date, now = new Date()): ExStatus {
  if (now < start) return 'Upcoming';
  if (now > end) return 'Past';
  return 'On view';
}

export async function getExhibitions() {
  const all = await getCollection('exhibitions');
  const withStatus = all.map((x) => ({ ...x, status: exhibitionStatus(x.data.startDate, x.data.endDate) }));
  // sort: On view first, then Upcoming (soonest first), then Past (most recent first)
  const rank = { 'On view': 0, Upcoming: 1, Past: 2 } as const;
  return withStatus.sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    if (a.status === 'Past') return b.data.startDate.getTime() - a.data.startDate.getTime();
    return a.data.startDate.getTime() - b.data.startDate.getTime();
  });
}

export function displayDates(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const s = start.toLocaleDateString('en-US', opts);
  const e = end.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  return `${s} — ${e}`;
}

export { getEntry };
