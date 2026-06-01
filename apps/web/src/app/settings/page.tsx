'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/src/store/ui.store';

export default function SettingsPage() {
  const router = useRouter();
  const { openSettings } = useUIStore();

  useEffect(() => {
    openSettings();
    router.replace('/dashboard');
  }, []);

  return null;
}
