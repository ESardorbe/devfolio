'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/src/store/auth.store';
import { useUIStore } from '@/src/store/ui.store';
import { usersApi, skillsApi, experiencesApi, educationsApi, projectsApi } from '@/src/services';
import { authApi } from '@/src/services/auth.api';
import {
  X, Save, Camera, Trash2, Eye, EyeOff,
  User, Link2, Shield, Sparkles, Loader2, Send,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:4000';

const COUNTRY_CODES = [
  { dial: '+998', flag: '🇺🇿', name: "O'zbekiston" },
  { dial: '+7',   flag: '🇷🇺', name: "Rossiya / Qozog'iston" },
  { dial: '+996', flag: '🇰🇬', name: "Qirg'iziston" },
  { dial: '+992', flag: '🇹🇯', name: 'Tojikiston' },
  { dial: '+993', flag: '🇹🇲', name: 'Turkmaniston' },
  { dial: '+994', flag: '🇦🇿', name: 'Ozarbayjon' },
  { dial: '+374', flag: '🇦🇲', name: 'Armaniston' },
  { dial: '+995', flag: '🇬🇪', name: 'Gruziya' },
  { dial: '+380', flag: '🇺🇦', name: 'Ukraina' },
  { dial: '+90',  flag: '🇹🇷', name: 'Turkiya' },
  { dial: '+971', flag: '🇦🇪', name: 'BAA' },
  { dial: '+966', flag: '🇸🇦', name: 'Saudiya Arabistoni' },
  { dial: '+49',  flag: '🇩🇪', name: 'Germaniya' },
  { dial: '+44',  flag: '🇬🇧', name: 'Buyuk Britaniya' },
  { dial: '+33',  flag: '🇫🇷', name: 'Fransiya' },
  { dial: '+1',   flag: '🇺🇸', name: 'AQSH / Kanada' },
  { dial: '+91',  flag: '🇮🇳', name: 'Hindiston' },
  { dial: '+86',  flag: '🇨🇳', name: 'Xitoy' },
  { dial: '+82',  flag: '🇰🇷', name: 'Janubiy Koreya' },
  { dial: '+81',  flag: '🇯🇵', name: 'Yaponiya' },
];

function detectCountry(phone: string) {
  if (!phone) return COUNTRY_CODES[0];
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  return sorted.find((c) => phone.startsWith(c.dial)) ?? COUNTRY_CODES[0];
}

const SM_STYLES = `
  @keyframes sm-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes sm-up {
    from { opacity: 0; transform: scale(0.96) translateY(12px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  @keyframes sm-spin {
    to { transform: rotate(360deg); }
  }

  .sm-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: sm-in 0.2s ease forwards;
  }
  html:not([data-theme="light"]) .sm-overlay {
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(12px);
  }
  html[data-theme="light"] .sm-overlay {
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(12px);
  }

  .sm-modal {
    width: 100%;
    max-width: 940px;
    max-height: calc(100dvh - 32px);
    border-radius: 22px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: sm-up 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    box-shadow: 0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07);
  }
  html:not([data-theme="light"]) .sm-modal {
    background: rgba(11, 12, 20, 0.96);
    backdrop-filter: blur(28px);
    border: 1px solid rgba(255,255,255,0.08);
  }
  html[data-theme="light"] .sm-modal {
    background: rgba(252, 253, 255, 0.97);
    backdrop-filter: blur(28px);
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 0 40px 100px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
  }

  .sm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .sm-header h2 {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }
  .sm-close {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--border2);
    background: none;
    color: var(--text2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .sm-close:hover {
    background: rgba(255,107,107,0.12);
    border-color: rgba(255,107,107,0.4);
    color: #ff6b6b;
  }

  .sm-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  .sm-sidebar {
    width: 230px;
    flex-shrink: 0;
    border-right: 1px solid var(--border);
    padding: 20px 14px 24px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
  }
  html:not([data-theme="light"]) .sm-sidebar {
    background: rgba(255,255,255,0.016);
  }
  html[data-theme="light"] .sm-sidebar {
    background: rgba(0,0,0,0.018);
  }

  .sm-sidebar-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 8px 0 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 10px;
  }
  .sm-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .sm-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: var(--surface2);
    border: 2px solid var(--border2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    transition: opacity 0.2s;
  }
  .sm-avatar-btn {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    border: 2px solid var(--bg);
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .sm-avatar-btn:hover { transform: scale(1.1); }
  .sm-sidebar-name {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 1.3;
  }
  .sm-sidebar-headline {
    font-size: 11px;
    color: var(--text3);
    text-align: center;
    line-height: 1.3;
  }

  .sm-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    border: none;
    background: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-size: 13px;
    font-weight: 500;
    color: var(--text2);
    transition: all 0.15s;
    font-family: var(--sans);
  }
  .sm-nav-item:hover {
    background: var(--surface2);
    color: var(--text);
  }
  .sm-nav-item.active {
    background: rgba(0,255,136,0.1);
    color: var(--accent);
  }
  html[data-theme="light"] .sm-nav-item.active {
    background: rgba(0,201,110,0.1);
  }

  .sm-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .sm-section-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }

  .sm-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }
  .sm-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text2);
  }
  .sm-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .sm-grid2 .sm-field { margin-bottom: 0; }

  .sm-bio-wrap {
    position: relative;
  }
  .sm-bio-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }
  .sm-ai-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 8px;
    border: 1px solid rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.1);
    color: #a78bfa;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    font-family: var(--sans);
  }
  .sm-ai-btn:hover:not(:disabled) {
    background: rgba(124,58,237,0.2);
    border-color: rgba(124,58,237,0.7);
    box-shadow: 0 0 12px rgba(124,58,237,0.25);
  }
  .sm-ai-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .sm-ai-btn .spin { animation: sm-spin 0.8s linear infinite; }

  .sm-char-count {
    font-size: 11px;
    color: var(--text3);
  }

  .sm-toggles {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .sm-toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text2);
    user-select: none;
  }
  .sm-toggle-label input { cursor: pointer; accent-color: var(--accent); }

  .sm-phone-row {
    display: flex;
    gap: 8px;
  }

  .sm-social-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .sm-social-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text3);
    flex-shrink: 0;
  }

  .sm-save-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .sm-status {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sm-status.success { color: var(--accent); }
  .sm-status.error   { color: #ff6b6b; }

  .sm-danger-zone {
    margin-top: 28px;
    padding: 20px;
    border-radius: 14px;
    border: 1px solid rgba(255,107,107,0.25);
    background: rgba(255,107,107,0.05);
  }
  .sm-danger-title {
    font-size: 13px;
    font-weight: 700;
    color: #ff6b6b;
    margin-bottom: 6px;
  }
  .sm-danger-desc {
    font-size: 12px;
    color: var(--text2);
    margin-bottom: 14px;
  }

  @media (max-width: 680px) {
    .sm-modal { max-height: 100dvh; border-radius: 0; }
    .sm-overlay { padding: 0; align-items: flex-end; }
    .sm-body { flex-direction: column; }
    .sm-sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
      flex-direction: row;
      align-items: center;
      overflow-x: auto;
      overflow-y: hidden;
      flex-shrink: 0;
      gap: 4px;
    }
    .sm-sidebar-profile { display: none; }
    .sm-nav-item { white-space: nowrap; }
    .sm-content { padding: 16px 16px 24px; }
    .sm-grid2 { grid-template-columns: 1fr; }
  }
`;

type Section = 'profile' | 'social' | 'security';

export function SettingsModal() {
  const { user, setUser } = useAuthStore();
  const { settingsOpen, closeSettings } = useUIStore();

  const [section, setSection] = useState<Section>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [profile, setProfile] = useState({
    name: '', username: '', headline: '', bio: '',
    location: '', website: '', birthDate: '',
    isPublic: true, isOpenToWork: false,
  });
  const [phoneCountry, setPhoneCountry] = useState(COUNTRY_CODES[0]);
  const [phoneDigits, setPhoneDigits] = useState('');

  const [social, setSocial] = useState({
    github: '', linkedin: '', telegram: '', twitter: '',
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '', newPassword: '', confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);

  const [generatingBio, setGeneratingBio] = useState(false);

  // Populate form when modal opens
  useEffect(() => {
    if (settingsOpen && user) {
      setProfile({
        name: user.name || '',
        username: user.username || '',
        headline: user.headline || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
        isPublic: user.isPublic,
        isOpenToWork: user.isOpenToWork,
      });
      setSocial({
        github: user.github || '',
        linkedin: user.linkedin || '',
        telegram: user.telegram || '',
        twitter: user.twitter || '',
      });
      if (user.phone) {
        const c = detectCountry(user.phone);
        setPhoneCountry(c);
        setPhoneDigits(user.phone.replace(c.dial, ''));
      } else {
        setPhoneCountry(COUNTRY_CODES[0]);
        setPhoneDigits('');
      }
      setAvatarPreview(null);
      setError('');
      setSaved(false);
      setSection('profile');
    }
  }, [settingsOpen, user]);

  // Escape to close
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settingsOpen, closeSettings]);

  // Lock body scroll
  useEffect(() => {
    if (settingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [settingsOpen]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const res = await usersApi.uploadAvatar(file);
      const updated = res?.data || res;
      if (updated?.avatar) setUser({ ...user!, avatar: updated.avatar });
    } catch {
      setError('Avatar yuklanmadi');
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const phone = phoneDigits.trim() ? `${phoneCountry.dial}${phoneDigits.trim()}` : undefined;
      const payload = {
        ...profile,
        website: profile.website.trim() || undefined,
        birthDate: profile.birthDate || undefined,
        phone,
        github: social.github.trim() || undefined,
        linkedin: social.linkedin.trim() || undefined,
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
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Parollar mos kelmaydi'); return;
    }
    setSaving(true); setError(''); setSaved(false);
    try {
      await authApi.changePassword(passwords.oldPassword, passwords.newPassword);
      setSaved(true);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message?.[0] || err?.message || 'Xato yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Hisobingizni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.")) return;
    setSaving(true);
    try {
      await usersApi.deleteAccount();
      localStorage.clear();
      closeSettings();
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.message || "Hisobni o'chirishda xato");
      setSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    setError('');
    try {
      const [skillsRes, expRes, eduRes, projRes] = await Promise.all([
        skillsApi.getAll().catch(() => []),
        experiencesApi.getAll().catch(() => []),
        educationsApi.getAll().catch(() => []),
        projectsApi.getAll().catch(() => []),
      ]);
      const skills     = skillsRes?.data     ?? skillsRes     ?? [];
      const experiences = expRes?.data       ?? expRes        ?? [];
      const educations = eduRes?.data        ?? eduRes        ?? [];
      const projects   = projRes?.data       ?? projRes       ?? [];

      const res = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          headline: profile.headline,
          location: profile.location,
          skills,
          experiences,
          educations,
          projects,
        }),
      });
      const data = await res.json();
      if (data.bio) {
        setProfile((p) => ({ ...p, bio: data.bio }));
      } else if (data.error) {
        setError(data.error);
      }
    } catch {
      setError('Bio yaratishda xato yuz berdi');
    } finally {
      setGeneratingBio(false);
    }
  };

  if (!settingsOpen || !user) return null;

  const avatarSrc = avatarPreview
    || (user.avatar
      ? (user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`)
      : null);

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'profile',  label: "Asosiy ma'lumotlar", icon: User },
    { id: 'social',   label: 'Ijtimoiy tarmoqlar',  icon: Link2 },
    { id: 'security', label: 'Xavfsizlik',          icon: Shield },
  ];

  const socialFields = [
    { key: 'github',   label: 'GitHub',      placeholder: 'https://github.com/username',      icon: Link2 },
    { key: 'linkedin', label: 'LinkedIn',   placeholder: 'https://linkedin.com/in/username', icon: User },
    { key: 'telegram', label: 'Telegram',   placeholder: '@username',                        icon: Send },
    { key: 'twitter',  label: 'Twitter / X',placeholder: '@username',                        icon: Link2 },
  ];

  return (
    <>
      <style>{SM_STYLES}</style>
      {/* Overlay */}
      <div
        className="sm-overlay"
        onMouseDown={(e) => { if (e.target === e.currentTarget) closeSettings(); }}
      >
        <div className="sm-modal" role="dialog" aria-modal="true" aria-label="Sozlamalar">
          {/* ── Header ── */}
          <div className="sm-header">
            <h2>Sozlamalar</h2>
            <button className="sm-close" onClick={closeSettings} aria-label="Yopish">
              <X size={16} />
            </button>
          </div>

          <div className="sm-body">
            {/* ── Sidebar ── */}
            <aside className="sm-sidebar">
              {/* Avatar + info */}
              <div className="sm-sidebar-profile">
                <div className="sm-avatar-wrap">
                  <div
                    className="sm-avatar"
                    style={{
                      backgroundImage: avatarSrc ? `url(${avatarSrc})` : undefined,
                      opacity: avatarUploading ? 0.55 : 1,
                    }}
                  >
                    {!avatarSrc && <User size={26} style={{ color: 'var(--text3)' }} />}
                  </div>
                  <button
                    className="sm-avatar-btn"
                    onClick={() => fileRef.current?.click()}
                    disabled={avatarUploading}
                    title="Rasm o'zgartirish"
                  >
                    {avatarUploading
                      ? <Loader2 size={10} className="spin" />
                      : <Camera size={10} />}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="sm-sidebar-name">{user.name || user.username}</p>
                <p className="sm-sidebar-headline">{user.headline || 'Developer'}</p>
              </div>

              {/* Nav items */}
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`sm-nav-item${section === id ? ' active' : ''}`}
                  onClick={() => { setSection(id); setError(''); setSaved(false); }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </aside>

            {/* ── Content ── */}
            <div className="sm-content">

              {/* ── Profile section ── */}
              {section === 'profile' && (
                <>
                  <p className="sm-section-title">Asosiy ma'lumotlar</p>

                  <div className="sm-grid2">
                    <div className="sm-field">
                      <label className="sm-label">Ism familiya</label>
                      <input
                        className="input"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="sm-field">
                      <label className="sm-label">Username</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--mono)' }}>/u/</span>
                        <input
                          className="input"
                          style={{ paddingLeft: 38, fontFamily: 'var(--mono)' }}
                          value={profile.username}
                          onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase() })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm-field">
                    <label className="sm-label">Headline</label>
                    <input
                      className="input"
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      placeholder="Senior Backend Developer | NestJS"
                      maxLength={100}
                    />
                  </div>

                  {/* Bio with AI */}
                  <div className="sm-field">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label className="sm-label" style={{ margin: 0 }}>Bio</label>
                      <button
                        className="sm-ai-btn"
                        onClick={handleGenerateBio}
                        disabled={generatingBio}
                        title="AI yordamida bio yaratish"
                      >
                        {generatingBio
                          ? <Loader2 size={11} className="spin" />
                          : <Sparkles size={11} />}
                        {generatingBio ? 'Yaratilmoqda...' : 'AI bilan yaratish'}
                      </button>
                    </div>
                    <textarea
                      className="input"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="O'zingiz haqida..."
                      rows={4}
                      style={{ resize: 'vertical' }}
                      maxLength={500}
                    />
                    <p className="sm-char-count">{profile.bio.length}/500</p>
                  </div>

                  <div className="sm-grid2">
                    <div className="sm-field">
                      <label className="sm-label">Joylashuv</label>
                      <input
                        className="input"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="Toshkent, O'zbekiston"
                      />
                    </div>
                    <div className="sm-field">
                      <label className="sm-label">Veb-sayt</label>
                      <input
                        className="input"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="sm-field">
                    <label className="sm-label">Telefon raqam</label>
                    <div className="sm-phone-row">
                      <select
                        className="input"
                        value={`${phoneCountry.dial}|${phoneCountry.name}`}
                        onChange={(e) => {
                          const [dial, name] = e.target.value.split('|');
                          setPhoneCountry(COUNTRY_CODES.find((c) => c.dial === dial && c.name === name) ?? COUNTRY_CODES[0]);
                        }}
                        style={{ width: 'auto', flexShrink: 0, cursor: 'pointer' }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.dial + c.name} value={`${c.dial}|${c.name}`}>
                            {c.flag} {c.dial}
                          </option>
                        ))}
                      </select>
                      <input
                        className="input"
                        style={{ flex: 1 }}
                        value={phoneDigits}
                        onChange={(e) => setPhoneDigits(e.target.value.replace(/[^\d\s\-]/g, ''))}
                        placeholder="90 123 45 67"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div className="sm-field">
                    <label className="sm-label">Tug'ilgan sana</label>
                    <input
                      type="date"
                      className="input"
                      style={{ maxWidth: 220 }}
                      value={profile.birthDate}
                      onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </div>

                  <div className="sm-toggles">
                    <label className="sm-toggle-label">
                      <input
                        type="checkbox"
                        checked={profile.isPublic}
                        onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })}
                      />
                      Profilni hammaga ochiq qil
                    </label>
                    <label className="sm-toggle-label">
                      <input
                        type="checkbox"
                        checked={profile.isOpenToWork}
                        onChange={(e) => setProfile({ ...profile, isOpenToWork: e.target.checked })}
                      />
                      🟢 Ish qidirmoqdaman
                    </label>
                  </div>

                  <div className="sm-save-bar">
                    {error && <span className="sm-status error">⚠ {error}</span>}
                    {saved && <span className="sm-status success">✓ Saqlandi!</span>}
                    <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ fontSize: 13 }}>
                      {saving ? <Loader2 size={13} className="spin" /> : <Save size={13} />}
                      {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </>
              )}

              {/* ── Social section ── */}
              {section === 'social' && (
                <>
                  <p className="sm-section-title">Ijtimoiy tarmoqlar</p>

                  {socialFields.map(({ key, label, placeholder, icon: Icon }) => (
                    <div key={key} className="sm-social-item">
                      <div className="sm-social-icon"><Icon size={14} /></div>
                      <div className="sm-field" style={{ marginBottom: 0 }}>
                        <label className="sm-label">{label}</label>
                        <input
                          className="input"
                          value={social[key as keyof typeof social]}
                          onChange={(e) => setSocial({ ...social, [key]: e.target.value })}
                          placeholder={placeholder}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="sm-save-bar">
                    {error && <span className="sm-status error">⚠ {error}</span>}
                    {saved && <span className="sm-status success">✓ Saqlandi!</span>}
                    <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ fontSize: 13 }}>
                      {saving ? <Loader2 size={13} className="spin" /> : <Save size={13} />}
                      {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </>
              )}

              {/* ── Security section ── */}
              {section === 'security' && (
                <>
                  <p className="sm-section-title">Parolni o'zgartirish</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20, marginTop: -8 }}>
                    OAuth (GitHub / Google) orqali kirgan bo'lsangiz, parol bo'lmaydi.
                  </p>

                  {[
                    { key: 'oldPassword',     label: 'Eski parol',              placeholder: '••••••••' },
                    { key: 'newPassword',     label: 'Yangi parol',             placeholder: '••••••••' },
                    { key: 'confirmPassword', label: 'Yangi parolni tasdiqlang', placeholder: '••••••••' },
                  ].map((f) => (
                    <div key={f.key} className="sm-field">
                      <label className="sm-label">{f.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="input"
                          type={showPwd ? 'text' : 'password'}
                          value={passwords[f.key as keyof typeof passwords]}
                          onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          style={{ paddingRight: f.key === 'oldPassword' ? 44 : undefined }}
                        />
                        {f.key === 'oldPassword' && (
                          <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}
                          >
                            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="sm-save-bar">
                    {error && <span className="sm-status error">⚠ {error}</span>}
                    {saved && <span className="sm-status success">✓ Parol o'zgartirildi!</span>}
                    <button className="btn-primary" onClick={handleChangePassword} disabled={saving} style={{ fontSize: 13 }}>
                      {saving ? <Loader2 size={13} className="spin" /> : <Save size={13} />}
                      {saving ? 'Saqlanmoqda...' : "Parolni o'zgartirish"}
                    </button>
                  </div>

                  {/* Danger zone */}
                  <div className="sm-danger-zone">
                    <p className="sm-danger-title">Xavfli zona</p>
                    <p className="sm-danger-desc">
                      Hisobni o'chirsangiz, barcha ma'lumotlaringiz butunlay yo'qoladi. Bu amalni qaytarib bo'lmaydi.
                    </p>
                    <button
                      disabled={saving}
                      onClick={handleDeleteAccount}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 16px', borderRadius: 8,
                        background: 'rgba(255,107,107,0.1)',
                        border: '1px solid rgba(255,107,107,0.35)',
                        color: '#ff6b6b', fontSize: 13, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'var(--sans)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Trash2 size={13} />
                      Hisobni o'chirish
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
