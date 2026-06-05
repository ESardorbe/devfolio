'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { authApi } from '../../../services/auth.api';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.push('/login');
      return;
    }

    (async () => {
      try {
        const tokensData: any = await authApi.exchangeOauthCode(code);
        const { accessToken, refreshToken } = tokensData.data ?? tokensData;
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        const meRes: any = await authApi.getMe();
        const user = meRes.data || meRes;
        setAuth(user, accessToken);
        router.push('/dashboard');
      } catch {
        localStorage.removeItem('accessToken');
        router.push('/login');
      }
    })();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Spinner */}
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid var(--border2)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
        Tizimga kirilmoqda...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '48px', height: '48px',
          border: '3px solid var(--border2)',
          borderTop: '3px solid var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}