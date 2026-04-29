'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { Navbar } from '../../components/layout/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.push('/login');
  }
}, []);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh',
        padding: '100px 48px 48px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Welcome */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--accent)', marginBottom: '8px' }}>
              // dashboard
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px' }}>
              Xush kelibsiz, <span style={{ color: 'var(--accent)' }}>{user.name || user.username}</span> 👋
            </h1>
            <p style={{ color: 'var(--text2)', marginTop: '8px' }}>
              devfolio.uz/u/{user.username} — sizning profil havolangiz
            </p>
          </div>

          {/* Quick stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {[
              { label: 'Profil ko\'rishlar', value: '0', icon: '👁️' },
              { label: 'Loyihalar', value: '0', icon: '🚀' },
              { label: 'Ko\'nikmalar', value: '0', icon: '⚡' },
              { label: 'Tajriba', value: '0', icon: '💼' },
            ].map((stat) => (
              <div key={stat.label} className="card">
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
              Tez harakatlar
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary">+ Ko'nikma qo'shish</button>
              <button className="btn-ghost">+ Loyiha qo'shish</button>
              <button className="btn-ghost">Profilni tahrirlash</button>
              <button className="btn-ghost">PDF yuklab olish</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}