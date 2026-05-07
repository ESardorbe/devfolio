import type { Metadata } from 'next';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const apiBase = apiUrl.replace('/api', '');

  try {
    const res = await fetch(`${apiUrl}/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('not found');
    const profile = await res.json();

    const displayName = profile.name || username;
    const title = `${displayName} — Portfolio`;
    const description =
      profile.headline ||
      (profile.bio ? profile.bio.slice(0, 160) : `${displayName} ning DevFolio portfolio sahifasi`);

    const avatarUrl = profile.avatar
      ? profile.avatar.startsWith('http')
        ? profile.avatar
        : `${apiBase}${profile.avatar}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://devfolio.uz/u/${username}`,
        type: 'profile',
        ...(avatarUrl && { images: [{ url: avatarUrl, width: 400, height: 400, alt: displayName }] }),
      },
      twitter: {
        card: 'summary',
        title,
        description,
        ...(avatarUrl && { images: [avatarUrl] }),
      },
      alternates: {
        canonical: `https://devfolio.uz/u/${username}`,
      },
    };
  } catch {
    return {
      title: `${username} — Portfolio | DevFolio`,
      description: 'DevFolio portfolio sahifasi',
    };
  }
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
