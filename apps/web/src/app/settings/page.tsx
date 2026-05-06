'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/auth.store';
import { Navbar } from '@/src/components/layout/Navbar';
import { usersApi } from '@/src/services';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/src/services/auth.api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState<'profile' | 'social' | 'account'>('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Profile form
  const [profile, setProfile] = useState({
    name: '', username: '', headline: '', bio: '',
    location: '', website: '', isPublic: true, isOpenToWork: false,
  });

  // Social form
  const [social, setSocial] = useState({
    github: '', linkedin: '', telegram: '', twitter: '',
  });

  // Password form
  const [passwords, setPasswords] = useState({
    oldPassword: '', newPassword: '', confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    if (user) {
      setProfile({
        name: user.name || '',
        username: user.username || '',
        headline: user.headline || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        isPublic: user.isPublic,
        isOpenToWork: user.isOpenToWork,
      });
      setSocial({
        github: user.github || '',
        linkedin: user.linkedin || '',
        telegram: user.telegram || '',
        twitter: user.twitter || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true); setError(''); setSaved(false);
    try {
      const stripUrl = (v: string) => v.trim() || undefined;
      const payload = {
        ...profile,
        website: stripUrl(profile.website),
        github: stripUrl(social.github),
        linkedin: stripUrl(social.linkedin),
        telegram: social.telegram.trim() || undefined,
        twitter: social.twitter.trim() || undefined,
      };
      const res = await usersApi.updateProfile(payload);
      const updated = res?.data || res;
      if (updated) setUser({ ...user!, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      const msg = err?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Parollar mos kelmaydi'); return;
    }
    setLoading(true); setError(''); setSaved(false);
    try {
      await authApi.changePassword?.(passwords.oldPassword, passwords.newPassword);
      setSaved(true);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message?.[0] || err?.message || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const sections = [
    { id: 'profile', label: '👤 Profil ma\'lumotlari' },
    { id: 'social', label: '🔗 Ijtimoiy tarmoqlar' },
    { id: 'account', label: '🔐 Hisob xavfsizligi' },
  ];

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '80px 0 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', paddingTop: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <Link href="/dashboard" style={{ color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Sozlamalar</h1>
          </div>

          {/* Sections nav */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id as any); setError(''); setSaved(false); }}
                style={{
                  padding: '10px 16px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${activeSection === s.id ? 'var(--accent)' : 'transparent'}`,
                  color: activeSection === s.id ? 'var(--accent)' : 'var(--text2)',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                  marginBottom: '-1px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#ff6b6b', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          {saved && (
            <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: 'var(--accent)', marginBottom: '20px' }}>
              ✓ Muvaffaqiyatli saqlandi!
            </div>
          )}

          {/* ── Profile Section ── */}
          {activeSection === 'profile' && (
            <div className="card">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Asosiy ma'lumotlar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Ism familiya</label>
                    <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                      Username
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--mono)' }}>
                        /u/
                      </span>
                      <input className="input" style={{ paddingLeft: '38px', fontFamily: 'var(--mono)' }} value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase() })} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Headline</label>
                  <input className="input" value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} placeholder="Senior Backend Developer | NestJS" maxLength={100} />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Bio</label>
                  <textarea className="input" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="O'zingiz haqida..." rows={4} style={{ resize: 'vertical' }} maxLength={500} />
                  <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>{profile.bio.length}/500</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Joylashuv</label>
                    <input className="input" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Toshkent, O'zbekiston" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Veb-sayt</label>
                    <input className="input" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={profile.isPublic} onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })} />
                    Profilni hammaga ochiq qil
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={profile.isOpenToWork} onChange={(e) => setProfile({ ...profile, isOpenToWork: e.target.checked })} />
                    🟢 Ish qidirmoqdaman
                  </label>
                </div>

                <button onClick={handleSaveProfile} className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', fontSize: '13px' }}>
                  <Save size={14} />
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          )}

          {/* ── Social Section ── */}
          {activeSection === 'social' && (
            <div className="card">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Ijtimoiy tarmoqlar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'github', label: '🐙 GitHub', placeholder: 'https://github.com/username' },
                  { key: 'linkedin', label: '💼 LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'telegram', label: '✈️ Telegram', placeholder: '@username' },
                  { key: 'twitter', label: '🐦 Twitter/X', placeholder: '@username' },
                ].map((s) => (
                  <div key={s.key}>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>{s.label}</label>
                    <input
                      className="input"
                      value={social[s.key as keyof typeof social]}
                      onChange={(e) => setSocial({ ...social, [s.key]: e.target.value })}
                      placeholder={s.placeholder}
                    />
                  </div>
                ))}

                <button onClick={handleSaveProfile} className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', fontSize: '13px' }}>
                  <Save size={14} />
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          )}

          {/* ── Account Section ── */}
          {activeSection === 'account' && (
            <div className="card">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Parolni o'zgartirish</h2>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '24px' }}>
                OAuth (GitHub/Google) orqali kirgan bo'lsangiz, parol bo'lmaydi.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'oldPassword', label: 'Eski parol', placeholder: '••••••••' },
                  { key: 'newPassword', label: 'Yangi parol', placeholder: '••••••••' },
                  { key: 'confirmPassword', label: 'Yangi parolni tasdiqlang', placeholder: '••••••••' },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="input"
                        type={showPwd ? 'text' : 'password'}
                        value={passwords[f.key as keyof typeof passwords]}
                        onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        style={{ paddingRight: '44px' }}
                      />
                      {f.key === 'oldPassword' && (
                        <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button onClick={handleChangePassword} className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', fontSize: '13px' }}>
                  <Save size={14} />
                  {loading ? 'Saqlanmoqda...' : 'Parolni o\'zgartirish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}