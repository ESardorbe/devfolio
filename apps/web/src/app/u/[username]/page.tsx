'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usersApi } from '@/src/services';
import { useTheme } from '@/src/hooks/useTheme';
import {
  MapPin, Globe, GitBranch, Link2, AtSign, Send,
  ExternalLink, Calendar, Star, Phone,
  Zap, Rocket, Briefcase, GraduationCap, Award,
  Sun, Moon,
} from 'lucide-react';
import { LEVEL_COLORS, LEVEL_LABELS } from '@/src/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:4000';

const PROFILE_STYLES = `
  .pf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 32px;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    transition: background 0.3s, border-color 0.3s;
    gap: 12px;
  }
  html:not([data-theme="light"]) .pf-nav { background: rgba(10,10,15,0.88); }
  html[data-theme="light"] .pf-nav  { background: rgba(244,245,252,0.92); }

  .pf-nav-logo { text-decoration: none; font-family: var(--mono); font-size: 16px; font-weight: 700; color: var(--text); }
  .pf-nav-right { display: flex; align-items: center; gap: 10px; }
  .pf-theme-btn {
    background: none; border: 1px solid var(--border2);
    color: var(--text2); width: 34px; height: 34px; border-radius: 8px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .pf-theme-btn:hover { border-color: var(--accent); color: var(--accent); }

  .pf-wrap { max-width: 1060px; margin: 0 auto; padding: 80px 20px 60px; }

  /* ── Two-column layout ── */
  .pf-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }
  .pf-sidebar { position: sticky; top: 82px; }

  /* ── Profile card ── */
  .pf-profile-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden; margin-bottom: 16px;
  }
  .pf-card-banner {
    height: 60px;
    background: linear-gradient(135deg, rgba(0,255,136,0.25) 0%, rgba(124,58,237,0.25) 60%, rgba(6,182,212,0.15) 100%);
  }
  html[data-theme="light"] .pf-card-banner {
    background: linear-gradient(135deg, rgba(0,180,100,0.18) 0%, rgba(79,70,229,0.18) 60%, rgba(8,145,178,0.12) 100%);
  }
  .pf-card-body { padding: 0 18px 20px; }
  .pf-avatar-wrap { display: flex; align-items: flex-end; justify-content: space-between; margin-top: -34px; margin-bottom: 12px; }
  .pf-avatar {
    width: 68px; height: 68px; border-radius: 50%;
    border: 3px solid var(--surface);
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; overflow: hidden; flex-shrink: 0;
    background-size: cover; background-position: center;
  }
  .pf-name { font-size: 17px; font-weight: 700; margin-bottom: 3px; }
  .pf-headline { font-size: 12px; color: var(--text2); margin-bottom: 12px; line-height: 1.45; }
  .pf-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text2); margin-bottom: 5px; }
  .pf-divider { height: 1px; background: var(--border); margin: 12px 0; }
  .pf-social-btn {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 7px 10px; border-radius: 8px;
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text2); font-size: 12px; font-weight: 500;
    text-decoration: none; cursor: pointer; transition: all 0.15s;
    margin-bottom: 5px;
  }
  .pf-social-btn:hover { border-color: var(--accent); color: var(--accent); }
  .pf-bio { font-size: 12px; color: var(--text2); line-height: 1.65; }

  /* ── Quick stats bar ── */
  .pf-stats-bar {
    display: flex; gap: 0;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden; margin-bottom: 16px;
  }
  .pf-stat-cell {
    flex: 1; padding: 10px 8px; text-align: center;
    border-right: 1px solid var(--border);
  }
  .pf-stat-cell:last-child { border-right: none; }
  .pf-stat-val { font-family: var(--mono); font-size: 16px; font-weight: 700; line-height: 1; }
  .pf-stat-lbl { font-size: 9px; color: var(--text3); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Section card ── */
  .pf-section {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 22px; margin-bottom: 16px;
  }
  .pf-section-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 18px; padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .pf-section-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pf-section-title { font-size: 14px; font-weight: 700; }

  /* ── Skills ── */
  .pf-skill-group { margin-bottom: 14px; }
  .pf-skill-group:last-child { margin-bottom: 0; }
  .pf-skill-cat { font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; }
  .pf-skill-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 7px; padding: 4px 10px; font-size: 12px;
    margin: 0 4px 6px 0; transition: border-color 0.15s;
  }
  .pf-skill-tag:hover { border-color: var(--border2); }

  /* ── Timeline ── */
  .pf-tl-item { display: flex; gap: 14px; padding-bottom: 22px; position: relative; }
  .pf-tl-item:last-child { padding-bottom: 0; }
  .pf-tl-left { display: flex; flex-direction: column; align-items: center; width: 34px; flex-shrink: 0; }
  .pf-tl-dot {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; color: var(--text3);
  }
  .pf-tl-line { width: 2px; flex: 1; background: var(--border); margin-top: 5px; min-height: 16px; }
  .pf-tl-item:last-child .pf-tl-line { display: none; }
  .pf-tl-body { flex: 1; padding-top: 4px; }
  .pf-tl-title { font-size: 13px; font-weight: 600; }
  .pf-tl-company { font-size: 13px; color: var(--accent); margin: 2px 0; font-weight: 500; }
  .pf-tl-date { font-size: 11px; color: var(--text3); display: flex; align-items: center; gap: 4px; margin-bottom: 5px; }
  .pf-tl-desc { font-size: 12px; color: var(--text2); line-height: 1.6; }

  /* ── Projects ── */
  .pf-proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .pf-proj-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px; transition: border-color 0.2s;
  }
  .pf-proj-card:hover { border-color: var(--border2); }

  /* ── Certs ── */
  .pf-cert-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    margin-bottom: 8px;
  }
  .pf-cert-item:last-child { margin-bottom: 0; }
  .pf-cert-badge {
    width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(0,200,100,0.15), rgba(6,182,212,0.15));
    border: 1px solid rgba(0,200,100,0.2);
  }

  /* ── Footer ── */
  .pf-footer { text-align: center; padding-top: 20px; border-top: 1px solid var(--border); }

  /* ── Responsive ── */
  @media (max-width: 820px) {
    .pf-nav { padding: 12px 16px; }
    .pf-wrap { padding: 68px 12px 40px; }
    .pf-layout { grid-template-columns: 1fr; }
    .pf-sidebar { position: static; }
    .pf-card-body { padding: 0 16px 16px; }
    .pf-proj-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .pf-section { padding: 16px; border-radius: 12px; }
    .pf-profile-card { border-radius: 12px; }
    .pf-proj-grid { grid-template-columns: 1fr; }
  }
`;

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundErr, setNotFoundErr] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    usersApi.getPublicProfile(username)
      .then((res) => { setProfile(res?.data || res); })
      .catch(() => setNotFoundErr(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <>
      <style>{PROFILE_STYLES}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--border2)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );

  if (notFoundErr || !profile) return (
    <>
      <style>{PROFILE_STYLES}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Profil topilmadi</h1>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>/u/{username} mavjud emas yoki yopiq</p>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Bosh sahifa →</Link>
      </div>
    </>
  );

  const grouped = (profile.skills || []).reduce((acc: any, s: any) => {
    const cat = s.category || 'Ko\'nikmalar';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const fmt = (d: string) => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });

  const avatarSrc = profile.avatar
    ? (profile.avatar.startsWith('http') ? profile.avatar : `${API_URL}${profile.avatar}`)
    : null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <style>{PROFILE_STYLES}</style>

      {/* ── Navbar ── */}
      <nav className="pf-nav">
        <Link href="/" className="pf-nav-logo">
          Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
        </Link>
        <div className="pf-nav-right">
          {mounted && (
            <button onClick={toggle} className="pf-theme-btn" title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
          <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '12px', padding: '7px 14px' }}>
            Portfolio yaratish →
          </Link>
        </div>
      </nav>

      <div className="pf-wrap">
        <div className="pf-layout">

          {/* ── Sidebar ── */}
          <aside className="pf-sidebar">

            {/* Profile card */}
            <div className="pf-profile-card">
              <div className="pf-card-banner" />
              <div className="pf-card-body">
                <div className="pf-avatar-wrap">
                  <div
                    className="pf-avatar"
                    style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : {}}
                  >
                    {!avatarSrc && '👤'}
                  </div>
                  {profile.isOpenToWork && (
                    <span className="tag tag-accent" style={{ fontSize: '9px' }}>🟢 Open to work</span>
                  )}
                </div>

                <h1 className="pf-name">{profile.name || profile.username}</h1>
                {profile.headline && <p className="pf-headline">{profile.headline}</p>}

                {profile.location && (
                  <div className="pf-meta"><MapPin size={11} /> {profile.location}</div>
                )}
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="pf-meta" style={{ textDecoration: 'none' }}>
                    <Phone size={11} /> {profile.phone}
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" className="pf-meta" style={{ textDecoration: 'none', color: 'var(--accent)' }}>
                    <Globe size={11} /> Veb-sayt
                  </a>
                )}

                {/* Social buttons */}
                {(profile.github || profile.linkedin || profile.telegram || profile.twitter) && (
                  <>
                    <div className="pf-divider" />
                    {profile.github && (
                      <a href={profile.github} target="_blank" className="pf-social-btn">
                        <GitBranch size={13} /> GitHub
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" className="pf-social-btn">
                        <Link2 size={13} /> LinkedIn
                      </a>
                    )}
                    {profile.telegram && (
                      <a href={`https://t.me/${profile.telegram.replace('@', '')}`} target="_blank" className="pf-social-btn">
                        <Send size={13} /> Telegram
                      </a>
                    )}
                    {profile.twitter && (
                      <a href={`https://x.com/${profile.twitter.replace('@', '')}`} target="_blank" className="pf-social-btn">
                        <AtSign size={13} /> Twitter / X
                      </a>
                    )}
                  </>
                )}

                {/* Bio */}
                {profile.bio && (
                  <>
                    <div className="pf-divider" />
                    <p className="pf-bio">{profile.bio}</p>
                  </>
                )}
              </div>
            </div>

            {/* Quick stats */}
            {(profile.skills?.length > 0 || profile.projects?.length > 0 || profile.experiences?.length > 0) && (
              <div className="pf-stats-bar">
                {profile.skills?.length > 0 && (
                  <div className="pf-stat-cell">
                    <div className="pf-stat-val" style={{ color: 'var(--accent)' }}>{profile.skills.length}</div>
                    <div className="pf-stat-lbl">Ko'nikma</div>
                  </div>
                )}
                {profile.projects?.length > 0 && (
                  <div className="pf-stat-cell">
                    <div className="pf-stat-val" style={{ color: 'var(--accent2)' }}>{profile.projects.length}</div>
                    <div className="pf-stat-lbl">Loyiha</div>
                  </div>
                )}
                {profile.experiences?.length > 0 && (
                  <div className="pf-stat-cell">
                    <div className="pf-stat-val" style={{ color: 'var(--accent3)' }}>{profile.experiences.length}</div>
                    <div className="pf-stat-lbl">Tajriba</div>
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* ── Main content ── */}
          <div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="pf-section">
                <div className="pf-section-head">
                  <div className="pf-section-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                    <Zap size={14} />
                  </div>
                  <span className="pf-section-title">Ko'nikmalar</span>
                </div>
                {Object.entries(grouped).map(([cat, items]: any) => (
                  <div key={cat} className="pf-skill-group">
                    <div className="pf-skill-cat">{cat}</div>
                    <div>
                      {items.map((s: any) => (
                        <span key={s.id} className="pf-skill-tag">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: LEVEL_COLORS[s.level], flexShrink: 0 }} />
                          {s.name}
                          <span style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{LEVEL_LABELS[s.level]}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {profile.projects?.length > 0 && (
              <div className="pf-section">
                <div className="pf-section-head">
                  <div className="pf-section-icon" style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--accent2)' }}>
                    <Rocket size={14} />
                  </div>
                  <span className="pf-section-title">Loyihalar</span>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{profile.projects.length} ta</span>
                </div>
                <div className="pf-proj-grid">
                  {profile.projects.map((p: any) => (
                    <div key={p.id} className="pf-proj-card">
                      {p.featured && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                          <Star size={11} style={{ color: '#f59e0b' }} />
                          <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 600 }}>Featured</span>
                        </div>
                      )}
                      <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{p.title}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '10px' }}>
                        {p.description.slice(0, 100)}{p.description.length > 100 ? '…' : ''}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                        {p.techs.slice(0, 4).map((t: string) => (
                          <span key={t} className="tag tag-purple" style={{ fontSize: '9px' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {p.github && (
                          <a href={p.github} target="_blank" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <GitBranch size={11} /> GitHub
                          </a>
                        )}
                        {p.demo && (
                          <a href={p.demo} target="_blank" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ExternalLink size={11} /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experiences?.length > 0 && (
              <div className="pf-section">
                <div className="pf-section-head">
                  <div className="pf-section-icon" style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--accent3)' }}>
                    <Briefcase size={14} />
                  </div>
                  <span className="pf-section-title">Ish tajribasi</span>
                </div>
                <div>
                  {profile.experiences.map((exp: any, i: number) => (
                    <div key={exp.id} className="pf-tl-item">
                      <div className="pf-tl-left">
                        <div className="pf-tl-dot"><Briefcase size={14} /></div>
                        {i < profile.experiences.length - 1 && <div className="pf-tl-line" />}
                      </div>
                      <div className="pf-tl-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="pf-tl-title">{exp.position}</span>
                          {exp.isCurrent && <span className="tag tag-accent" style={{ fontSize: '9px' }}>Hozir</span>}
                        </div>
                        <p className="pf-tl-company">{exp.company}</p>
                        <p className="pf-tl-date">
                          <Calendar size={10} />
                          {fmt(exp.startDate)} — {exp.isCurrent ? 'Hozir' : exp.endDate ? fmt(exp.endDate) : ''}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                        {exp.description && <p className="pf-tl-desc">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.educations?.length > 0 && (
              <div className="pf-section">
                <div className="pf-section-head">
                  <div className="pf-section-icon" style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--accent)' }}>
                    <GraduationCap size={14} />
                  </div>
                  <span className="pf-section-title">Ta'lim</span>
                </div>
                <div>
                  {profile.educations.map((edu: any, i: number) => (
                    <div key={edu.id} className="pf-tl-item">
                      <div className="pf-tl-left">
                        <div className="pf-tl-dot"><GraduationCap size={14} /></div>
                        {i < profile.educations.length - 1 && <div className="pf-tl-line" />}
                      </div>
                      <div className="pf-tl-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="pf-tl-title">{edu.institution}</span>
                          {edu.isCurrent && <span className="tag tag-accent" style={{ fontSize: '9px' }}>Hozir</span>}
                        </div>
                        <p className="pf-tl-company">{edu.degree} — {edu.field}</p>
                        <p className="pf-tl-date">
                          <Calendar size={10} />
                          {new Date(edu.startDate).getFullYear()} — {edu.isCurrent ? 'Hozir' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                        </p>
                        {edu.description && <p className="pf-tl-desc">{edu.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates */}
            {profile.certificates?.length > 0 && (
              <div className="pf-section">
                <div className="pf-section-head">
                  <div className="pf-section-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                    <Award size={14} />
                  </div>
                  <span className="pf-section-title">Sertifikatlar</span>
                </div>
                <div>
                  {profile.certificates.map((c: any) => {
                    const fileSrc = c.fileUrl ? (c.fileUrl.startsWith('http') ? c.fileUrl : `${API_URL}${c.fileUrl}`) : null;
                    return (
                      <div key={c.id} className="pf-cert-item">
                        <div className="pf-cert-badge"><Award size={16} style={{ color: '#f59e0b' }} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, marginBottom: '2px' }}>{c.title}</p>
                          {c.issuer && <p style={{ fontSize: '11px', color: 'var(--text2)' }}>{c.issuer}</p>}
                          {c.issueDate && (
                            <p style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>
                              {fmt(c.issueDate)}{c.expiryDate ? ` — ${fmt(c.expiryDate)}` : ''}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {c.url && (
                              <a href={c.url} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, color: 'var(--text)', border: '1px solid var(--border2)', borderRadius: '6px', padding: '3px 9px', textDecoration: 'none' }}>
                                <ExternalLink size={10} /> Ko'rish
                              </a>
                            )}
                            {fileSrc && c.fileType === 'image' && (
                              <a href={fileSrc} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent)', textDecoration: 'none' }}>
                                <ExternalLink size={10} /> Rasm
                              </a>
                            )}
                            {fileSrc && c.fileType === 'pdf' && (
                              <a href={fileSrc} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#dc2626', textDecoration: 'none' }}>
                                <ExternalLink size={10} /> PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pf-footer">
              <p style={{ fontSize: '11px', color: 'var(--text3)' }}>
                Powered by{' '}
                <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>DevFolio</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
