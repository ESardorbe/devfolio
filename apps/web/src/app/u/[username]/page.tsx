'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usersApi } from '@/src/services';
import {
  MapPin, Globe, GitBranch, Link2, AtSign,
  Send, ExternalLink, Calendar, Star, Phone,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: '#6366f1',
  INTERMEDIATE: '#00ff88',
  ADVANCED: '#06b6d4',
  EXPERT: '#f59e0b',
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Boshlang\'ich',
  INTERMEDIATE: 'O\'rta',
  ADVANCED: 'Yuqori',
  EXPERT: 'Ekspert',
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundErr, setNotFoundErr] = useState(false);

  useEffect(() => {
    usersApi.getPublicProfile(username)
      .then((res) => {
        const data = res?.data || res;
        setProfile(data);
      })
      .catch(() => setNotFoundErr(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border2)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFoundErr || !profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative', textAlign: 'center' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔍</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Profil topilmadi</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>/u/{username} mavjud emas yoki yopiq</p>
      <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Bosh sahifa →</Link>
    </div>
  );

  const grouped = (profile.skills || []).reduce((acc: any, s: any) => {
    const cat = s.category || 'Ko\'nikmalar';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const formatDate = (d: string) => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Glow */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)', top: '0', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

      {/* Navbar minimal */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700 }}>
          Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
        </Link>
        <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 16px' }}>
          Portfolio yaratish →
        </Link>
      </nav>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Hero card */}
        <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%', flexShrink: 0,
              background: profile.avatar
                ? `url(${profile.avatar.startsWith('http') ? profile.avatar : `${API_URL}${profile.avatar}`}) center/cover`
                : 'var(--surface2)',
              border: '3px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px',
            }}>
              {!profile.avatar && '👤'}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700 }}>{profile.name || profile.username}</h1>
                {profile.isOpenToWork && (
                  <span className="tag tag-accent" style={{ fontSize: '11px' }}>🟢 Ish qidirmoqda</span>
                )}
              </div>

              {profile.headline && (
                <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '12px' }}>{profile.headline}</p>
              )}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {profile.location && (
                  <span style={{ fontSize: '13px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {profile.location}
                  </span>
                )}
                {profile.birthDate && (
                  <span style={{ fontSize: '13px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {new Date(profile.birthDate).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} style={{ fontSize: '13px', color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} /> {profile.phone}
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={12} /> Veb-sayt
                  </a>
                )}
              </div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {profile.github && (
                  <a href={profile.github} target="_blank" className="btn-ghost" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '12px' }}>
                    <GitBranch size={13} /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" className="btn-ghost" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '12px' }}>
                    <Link2 size={13} /> LinkedIn
                  </a>
                )}
                {profile.telegram && (
                  <a href={`https://t.me/${profile.telegram.replace('@', '')}`} target="_blank" className="btn-ghost" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '12px' }}>
                    <Send size={13} /> Telegram
                  </a>
                )}
                {profile.twitter && (
                  <a href={`https://x.com/${profile.twitter.replace('@', '')}`} target="_blank" className="btn-ghost" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '12px' }}>
                    <AtSign size={13} /> Twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
              ⚡ Ko'nikmalar
            </h2>
            {Object.entries(grouped).map(([cat, items]: any) => (
              <div key={cat} style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {items.map((s: any) => (
                    <span key={s.id} style={{
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderRadius: '8px', padding: '6px 12px', fontSize: '13px',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: LEVEL_COLORS[s.level], flexShrink: 0 }} />
                      {s.name}
                      <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{LEVEL_LABELS[s.level]}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>🚀 Loyihalar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {profile.projects.map((p: any) => (
                <div key={p.id} className="card">
                  {p.featured && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                      <Star size={12} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '11px', color: '#f59e0b' }}>Featured</span>
                    </div>
                  )}
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{p.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {p.description.slice(0, 120)}{p.description.length > 120 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {p.techs.slice(0, 4).map((t: string) => (
                      <span key={t} className="tag tag-purple" style={{ fontSize: '10px' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {p.github && (
                      <a href={p.github} target="_blank" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <GitBranch size={12} /> GitHub
                      </a>
                    )}
                    {p.demo && (
                      <a href={p.demo} target="_blank" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ExternalLink size={12} /> Demo
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
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>💼 Ish tajribasi</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {profile.experiences.map((exp: any, i: number) => (
                <div key={exp.id} style={{ display: 'flex', gap: '16px', paddingBottom: i < profile.experiences.length - 1 ? '20px' : 0, marginBottom: i < profile.experiences.length - 1 ? '20px' : 0, borderBottom: i < profile.experiences.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    🏢
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{exp.position}</h3>
                      {exp.isCurrent && <span className="tag tag-accent" style={{ fontSize: '10px' }}>Hozir</span>}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--accent)', margin: '2px 0' }}>{exp.company}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: exp.description ? '8px' : 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={10} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Hozir' : exp.endDate ? formatDate(exp.endDate) : ''}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                    {exp.description && <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.educations?.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>🎓 Ta'lim</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profile.educations.map((edu: any) => (
                <div key={edu.id} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    🏛️
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{edu.institution}</h3>
                      {edu.isCurrent && <span className="tag tag-accent" style={{ fontSize: '10px' }}>Hozir</span>}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--accent)', margin: '2px 0' }}>{edu.degree} — {edu.field}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
                      {new Date(edu.startDate).getFullYear()} — {edu.isCurrent ? 'Hozir' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {profile.certificates?.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
              🏆 Sertifikatlar va Diplomlar
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {profile.certificates.map((c: any) => {
                const fileSrc = c.fileUrl ? (c.fileUrl.startsWith('http') ? c.fileUrl : `${API_URL}${c.fileUrl}`) : null;
                return (
                  <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Header: badge + info */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #00c853, #00e5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
                        🏆
                      </div>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.3 }}>{c.title}</h3>
                        {c.issuer && <p style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{c.issuer}</p>}
                        {c.issueDate && (
                          <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                            {new Date(c.issueDate).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' })}
                            {c.expiryDate ? ` — ${new Date(c.expiryDate).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' })}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Show credential button */}
                    {c.url && (
                      <a href={c.url} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--text)', border: '1px solid var(--border2)', borderRadius: '6px', padding: '6px 12px', textDecoration: 'none', width: 'fit-content' }}>
                        <ExternalLink size={11} /> Sertifikatni ko'rish
                      </a>
                    )}

                    {/* File thumbnail — LinkedIn style */}
                    {fileSrc && c.fileType === 'image' && (
                      <a href={fileSrc} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', textDecoration: 'none' }}>
                        <img src={fileSrc} alt={c.title} style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.4 }}>Sertifikat — {c.title}</span>
                      </a>
                    )}
                    {fileSrc && c.fileType === 'pdf' && (
                      <a href={fileSrc} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', textDecoration: 'none' }}>
                        <div style={{ width: '80px', height: '54px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: '2px' }}>
                          <span style={{ fontSize: '20px' }}>📄</span>
                          <span style={{ fontSize: '9px', color: '#dc2626', fontWeight: 700 }}>PDF</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.4 }}>Sertifikat — {c.title}</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
            Powered by{' '}
            <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>DevFolio</Link>
          </p>
        </div>
      </main>
    </div>
  );
}