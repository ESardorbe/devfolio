'use client';

import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(
  () => import('./ParticleBackground').then(m => ({ default: m.ParticleBackground })),
  { ssr: false }
);

export function ParticleBackgroundWrapper() {
  return <ParticleBackground />;
}
