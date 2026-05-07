import type { MetadataRoute } from 'next';

const BASE = 'https://devfolio.uz';

async function getAllUsernames(): Promise<string[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/users/sitemap-list`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map((u: { username: string }) => u.username) : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const usernames = await getAllUsernames();

  return [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...usernames.map((username) => ({
      url: `${BASE}/u/${username}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
