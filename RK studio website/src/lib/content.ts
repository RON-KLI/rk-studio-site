import { getCollection, getEntry } from 'astro:content';

export async function getArtworks() {
  const all = await getCollection('artworks');
  return all.sort((a, b) => (a.data.order - b.data.order) || (b.data.year - a.data.year));
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
