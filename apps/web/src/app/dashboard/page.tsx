'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/auth.store';
import { Navbar } from '@/src/components/layout/Navbar';
import {
  skillsApi, projectsApi, experiencesApi,
  educationsApi, usersApi, certificatesApi,
  type Skill, type Project, type Experience, type Education, type Certificate,
} from '@/src/services';
import {
  Plus, Trash2, Edit3, ExternalLink, GitBranch,
  Eye, Briefcase, GraduationCap, Code2,
  Settings, ChevronRight, Star, Download,
} from 'lucide-react';
import { ExportModal } from '@/src/components/ExportModal';
import { LEVEL_COLORS, LEVEL_LABELS } from '@/src/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:4000';

type Tab = 'overview' | 'skills' | 'projects' | 'experience' | 'education' | 'certificates';

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [views, setViews] = useState({ total: 0, last30days: 0 });
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profileRes, skillsRes, projectsRes, expRes, eduRes, viewsRes, certRes] =
        await Promise.allSettled([
          usersApi.getMe(),
          skillsApi.getAll(),
          projectsApi.getAll(),
          experiencesApi.getAll(),
          educationsApi.getAll(),
          usersApi.getViews(),
          certificatesApi.getAll(),
        ]);

      if (profileRes.status === 'fulfilled') {
        const p = profileRes.value?.data || profileRes.value;
        if (p) setUser(p);
      }
      if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value?.data || skillsRes.value || []);
      if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value?.data || projectsRes.value || []);
      if (expRes.status === 'fulfilled') setExperiences(expRes.value?.data || expRes.value || []);
      if (eduRes.status === 'fulfilled') setEducations(eduRes.value?.data || eduRes.value || []);
      if (certRes.status === 'fulfilled') setCertificates(certRes.value?.data || certRes.value || []);
      if (viewsRes.status === 'fulfilled') {
        const v = viewsRes.value?.data || viewsRes.value;
        if (v) setViews(v);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Umumiy', icon: Eye },
    { id: 'skills', label: 'Ko\'nikmalar', icon: Code2, count: skills.length },
    { id: 'projects', label: 'Loyihalar', icon: Star, count: projects.length },
    { id: 'experience', label: 'Tajriba', icon: Briefcase, count: experiences.length },
    { id: 'education', label: 'Ta\'lim', icon: GraduationCap, count: educations.length },
    { id: 'certificates', label: 'Sertifikatlar', icon: GraduationCap, count: certificates.length },
  ];

  return (
    <>
      <Navbar />
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        profile={{
          name: user.name,
          username: user.username,
          headline: user.headline,
          bio: user.bio,
          location: user.location,
          website: user.website,
          github: user.github,
          linkedin: user.linkedin,
          phone: user.phone,
          avatarUrl: user.avatar
            ? (user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`)
            : undefined,
          isOpenToWork: user.isOpenToWork,
          skills,
          projects,
          experiences,
          educations,
          certificates,
        }}
      />
      <main style={{ minHeight: '100vh', padding: '80px 0 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px', paddingTop: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Avatar */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: user.avatar
                  ? `url(${user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`}) center/cover`
                  : 'var(--surface2)',
                border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', flexShrink: 0,
              }}>
                {!user.avatar && '👤'}
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 700 }}>
                  {user.name || user.username}
                </h1>
                <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '2px' }}>
                  {user.headline || 'Headline qo\'shing'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <span className="tag tag-accent" style={{ fontSize: '10px' }}>
                    /u/{user.username}
                  </span>
                  {user.isOpenToWork && (
                    <span className="tag tag-accent" style={{ fontSize: '10px' }}>
                      🟢 Ish qidirmoqda
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                href={`/u/${user.username}` as any}
                target="_blank"
                className="btn-ghost"
                style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 16px' }}
              >
                <Eye size={14} /> Profilni ko'rish
              </Link>
              <button
                onClick={() => setShowExport(true)}
                className="btn-ghost"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                <Download size={14} /> Yuklab olish
              </button>
              <Link
                href={"/settings" as any}
                className="btn-primary"
                style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 16px' }}
              >
                <Settings size={14} /> Sozlamalar
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '24px',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto', paddingBottom: '0',
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 16px', background: 'none', border: 'none',
                    borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                    color: isActive ? 'var(--accent)' : 'var(--text2)',
                    cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                    marginBottom: '-1px',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span style={{
                      background: isActive ? 'rgba(0,255,136,0.15)' : 'var(--surface)',
                      color: isActive ? 'var(--accent)' : 'var(--text3)',
                      borderRadius: '100px', padding: '1px 7px', fontSize: '11px',
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid var(--border2)',
                borderTop: '3px solid var(--accent)', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
              }} />
              Yuklanmoqda...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && (
            <>
              {/* ── OVERVIEW ── */}
              {activeTab === 'overview' && (
                <div>
                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Jami ko\'rishlar', value: views.total, icon: '👁️', color: 'var(--accent)' },
                      { label: 'So\'nggi 30 kun', value: views.last30days, icon: '📈', color: 'var(--accent3)' },
                      { label: 'Loyihalar', value: projects.length, icon: '🚀', color: 'var(--accent2)' },
                      { label: 'Ko\'nikmalar', value: skills.length, icon: '⚡', color: '#f59e0b' },
                    ].map((s) => (
                      <div key={s.label} className="card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>{s.icon}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 700, color: s.color }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Profile completion */}
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Profil to'liqligi</h3>
                      <Link href={"/settings" as any} style={{ color: 'var(--accent)', fontSize: '12px', textDecoration: 'none' }}>
                        Tahrirlash →
                      </Link>
                    </div>
                    {[
                      { label: 'Bio', done: !!user.bio },
                      { label: 'Headline', done: !!user.headline },
                      { label: 'Joylashuv', done: !!user.location },
                      { label: 'GitHub havolasi', done: !!user.github },
                      { label: 'Ko\'nikmalar (3+)', done: skills.length >= 3 },
                      { label: 'Loyihalar (1+)', done: projects.length >= 1 },
                      { label: 'Ish tajribasi', done: experiences.length >= 1 },
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                          background: item.done ? 'var(--accent)' : 'var(--surface2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px',
                        }}>
                          {item.done ? '✓' : ''}
                        </div>
                        <span style={{ fontSize: '13px', color: item.done ? 'var(--text)' : 'var(--text2)' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                    {/* Progress bar */}
                    {(() => {
                      const items = [!!user.bio, !!user.headline, !!user.location, !!user.github, skills.length >= 3, projects.length >= 1, experiences.length >= 1];
                      const pct = Math.round((items.filter(Boolean).length / items.length) * 100);
                      return (
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: '3px', transition: 'width 0.5s' }} />
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '6px' }}>{pct}% to'liq</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Quick links */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {[
                      { label: 'Ko\'nikma qo\'shish', icon: '⚡', tab: 'skills' },
                      { label: 'Loyiha qo\'shish', icon: '🚀', tab: 'projects' },
                      { label: 'Tajriba qo\'shish', icon: '💼', tab: 'experience' },
                      { label: 'Ta\'lim qo\'shish', icon: '🎓', tab: 'education' },
                    ].map((q) => (
                      <button
                        key={q.label}
                        onClick={() => setActiveTab(q.tab as Tab)}
                        style={{
                          background: 'var(--surface)', border: '1px solid var(--border)',
                          borderRadius: '10px', padding: '16px', textAlign: 'left',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          gap: '10px', color: 'var(--text)', fontSize: '13px', fontWeight: 500,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        <span style={{ fontSize: '20px' }}>{q.icon}</span>
                        {q.label}
                        <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text3)' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SKILLS ── */}
              {activeTab === 'skills' && (
                <SkillsTab
                  skills={skills}
                  onRefresh={loadAll}
                />
              )}

              {/* ── PROJECTS ── */}
              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={projects}
                  onRefresh={loadAll}
                />
              )}

              {/* ── EXPERIENCE ── */}
              {activeTab === 'experience' && (
                <ExperienceTab
                  experiences={experiences}
                  onRefresh={loadAll}
                />
              )}

              {/* ── EDUCATION ── */}
              {activeTab === 'education' && (
                <EducationTab educations={educations} onRefresh={loadAll} />
              )}

              {/* ── CERTIFICATES ── */}
              {activeTab === 'certificates' && (
                <CertificatesTab certificates={certificates} onRefresh={loadAll} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

// ─── Skills Tab ───────────────────────────────────────────
function SkillsTab({ skills, onRefresh }: { skills: Skill[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: '', level: 'INTERMEDIATE', category: '' });
  const [loading, setLoading] = useState(false);

  const openAdd = () => { setEditing(null); setForm({ name: '', level: 'INTERMEDIATE', category: '' }); setShowForm(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, level: s.level, category: s.category || '' }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      if (editing) {
        await skillsApi.update(editing.id, { ...form, level: form.level as Skill['level'] });
      } else {
        await skillsApi.create(form);
      }
      setShowForm(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('O\'chirilsinmi?')) return;
    await skillsApi.delete(id);
    onRefresh();
  };

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Boshqa';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Ko'nikmalar</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Ko'nikma qo'shish
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            {editing ? 'Ko\'nikmani tahrirlash' : 'Yangi ko\'nikma'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Nomi *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="TypeScript"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Daraja</label>
              <select
                className="input"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {Object.entries(LEVEL_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Kategoriya</label>
              <input
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Frontend, Backend..."
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>
              {loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {/* Skills grouped */}
      {skills.length === 0 ? (
        <EmptyState icon="⚡" text="Hali ko'nikma qo'shilmagan" onAdd={openAdd} />
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {category}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {items.map((skill) => (
                <div key={skill.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '8px 12px',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: LEVEL_COLORS[skill.level] || 'var(--accent)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{skill.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    {LEVEL_LABELS[skill.level]}
                  </span>
                  <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                    <button onClick={() => openEdit(skill)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '2px' }}>
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => handleDelete(skill.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '2px' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────
function ProjectsTab({ projects, onRefresh }: { projects: Project[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', techs: '', github: '', demo: '', featured: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', techs: '', github: '', demo: '', featured: false }); setFormError(''); setShowForm(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, techs: p.techs.join(', '), github: p.github || '', demo: p.demo || '', featured: p.featured });
    setFormError('');
    setShowForm(true);
  };

  const isValidUrl = (val: string) => { try { return /^https?:$/.test(new URL(val).protocol); } catch { return false; } };

  const handleSubmit = async () => {
    setFormError('');
    if (!form.title.trim()) { setFormError('Loyiha nomini kiriting'); return; }
    if (!form.description.trim()) { setFormError('Tavsifni kiriting'); return; }
    if (form.demo && !isValidUrl(form.demo)) { setFormError('Demo URL noto\'g\'ri formatda (https://... bo\'lishi kerak)'); return; }
    if (form.github && !isValidUrl(form.github)) { setFormError('GitHub URL noto\'g\'ri formatda'); return; }
    setLoading(true);
    try {
      const data = {
        ...form,
        techs: form.techs.split(',').map((t) => t.trim()).filter(Boolean),
        demo: form.demo.trim() || undefined,
        github: form.github.trim() || undefined,
      };
      if (editing) {
        await projectsApi.update(editing.id, data);
      } else {
        await projectsApi.create(data);
      }
      setShowForm(false);
      onRefresh();
    } catch (err: any) {
      const msg = err?.message;
      setFormError(Array.isArray(msg) ? msg[0] : msg || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Loyiha o\'chirilsinmi?')) return;
    await projectsApi.delete(id);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Loyihalar</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Loyiha qo'shish
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            {editing ? 'Loyihani tahrirlash' : 'Yangi loyiha'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Nomi *</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="DevFolio" />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Texnologiyalar (vergul bilan)</label>
                <input className="input" value={form.techs} onChange={(e) => setForm({ ...form, techs: e.target.value })} placeholder="React, NestJS, PostgreSQL" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Tavsif *</label>
              <textarea
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Loyiha haqida..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>GitHub URL</label>
                <input className="input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Demo URL</label>
                <input className="input" value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Profilda featured sifatida ko'rsat
            </label>
          </div>
          {formError && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#ff6b6b', marginBottom: '12px' }}>
              {formError}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>
              {loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState icon="🚀" text="Hali loyiha qo'shilmagan" onAdd={openAdd} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {projects.map((p) => (
            <div key={p.id} className="card" style={{ position: 'relative' }}>
              {p.featured && (
                <span className="tag tag-accent" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px' }}>
                  ⭐ Featured
                </span>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', paddingRight: '70px' }}>{p.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '12px' }}>
                {p.description.slice(0, 100)}{p.description.length > 100 ? '...' : ''}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {p.techs.slice(0, 5).map((t) => (
                  <span key={t} className="tag tag-purple" style={{ fontSize: '10px' }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────
function ExperienceTab({ experiences, onRefresh }: { experiences: Experience[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ company: '', position: '', description: '', startDate: '', endDate: '', isCurrent: false, location: '' });
  const [loading, setLoading] = useState(false);

  const openAdd = () => { setEditing(null); setForm({ company: '', position: '', description: '', startDate: '', endDate: '', isCurrent: false, location: '' }); setShowForm(true); };
  const openEdit = (e: Experience) => {
    setEditing(e);
    setForm({
      company: e.company, position: e.position, description: e.description || '',
      startDate: e.startDate.slice(0, 10), endDate: e.endDate?.slice(0, 10) || '',
      isCurrent: e.isCurrent, location: e.location || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.position.trim()) return;
    setLoading(true);
    try {
      if (editing) {
        await experiencesApi.update(editing.id, form);
      } else {
        await experiencesApi.create(form);
      }
      setShowForm(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('O\'chirilsinmi?')) return;
    await experiencesApi.delete(id);
    onRefresh();
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Ish tajribasi</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Tajriba qo'shish
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            {editing ? 'Tahrirlash' : 'Yangi tajriba'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Kompaniya *</label>
                <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Uzum Bank" />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Lavozim *</label>
                <input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Backend Developer" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Boshlanish</label>
                <input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Tugash</label>
                <input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Joylashuv</label>
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Toshkent" />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} />
              Hozirda shu yerda ishlayapman
            </label>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Tavsif</label>
              <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Vazifalar va yutuqlar..." style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>
              {loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {experiences.length === 0 ? (
        <EmptyState icon="💼" text="Hali ish tajribasi qo'shilmagan" onAdd={openAdd} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {experiences.map((exp) => (
            <div key={exp.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{exp.position}</h3>
                  {exp.isCurrent && <span className="tag tag-accent" style={{ fontSize: '10px' }}>Hozir</span>}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '4px', fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: exp.description ? '8px' : 0 }}>
                  {formatDate(exp.startDate)} — {exp.isCurrent ? 'Hozir' : exp.endDate ? formatDate(exp.endDate) : ''}
                  {exp.location && ` · ${exp.location}`}
                </p>
                {exp.description && <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5 }}>{exp.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <button onClick={() => openEdit(exp)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Education Tab ────────────────────────────────────────
function EducationTab({ educations, onRefresh }: { educations: Education[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState({ institution: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, description: '' });
  const [loading, setLoading] = useState(false);

  const openAdd = () => { setEditing(null); setForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, description: '' }); setShowForm(true); };
  const openEdit = (e: Education) => {
    setEditing(e);
    setForm({
      institution: e.institution, degree: e.degree, field: e.field,
      startDate: e.startDate.slice(0, 10), endDate: e.endDate?.slice(0, 10) || '',
      isCurrent: e.isCurrent, description: e.description || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.institution.trim()) return;
    setLoading(true);
    try {
      if (editing) {
        await educationsApi.update(editing.id, form);
      } else {
        await educationsApi.create(form);
      }
      setShowForm(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('O\'chirilsinmi?')) return;
    await educationsApi.delete(id);
    onRefresh();
  };

  const formatDate = (d: string) => new Date(d).getFullYear();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Ta'lim</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Ta'lim qo'shish
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            {editing ? 'Tahrirlash' : 'Yangi ta\'lim'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>O'quv muassasasi *</label>
              <input className="input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="TATU, NUU..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Daraja *</label>
                <input className="input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Bakalavr" />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Yo'nalish *</label>
                <input className="input" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Dasturiy injiniring" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Boshlanish</label>
                <input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Tugash</label>
                <input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} />
              Hozirda o'qiyapman
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>
              {loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {educations.length === 0 ? (
        <EmptyState icon="🎓" text="Hali ta'lim ma'lumoti qo'shilmagan" onAdd={openAdd} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {educations.map((edu) => (
            <div key={edu.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{edu.institution}</h3>
                  {edu.isCurrent && <span className="tag tag-accent" style={{ fontSize: '10px' }}>Hozir</span>}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '4px' }}>{edu.degree} — {edu.field}</p>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
                  {formatDate(edu.startDate)} — {edu.isCurrent ? 'Hozir' : edu.endDate ? formatDate(edu.endDate) : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <button onClick={() => openEdit(edu)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(edu.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Certificates Tab ─────────────────────────────────────
function CertificatesTab({ certificates, onRefresh }: { certificates: Certificate[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ title: '', issuer: '', issueDate: '', expiryDate: '', url: '' });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', issuer: '', issueDate: '', expiryDate: '', url: '' });
    setFile(null); setFilePreview('');
    setShowForm(true);
  };

  const openEdit = (c: Certificate) => {
    setEditing(c);
    setForm({
      title: c.title, issuer: c.issuer || '',
      issueDate: c.issueDate?.slice(0, 10) || '',
      expiryDate: c.expiryDate?.slice(0, 10) || '',
      url: c.url || '',
    });
    setFile(null);
    setFilePreview(c.fileUrl ? (c.fileUrl.startsWith('http') ? c.fileUrl : `${API_URL}${c.fileUrl}`) : '');
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview('pdf');
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const data = { ...form, file: file || undefined };
      if (editing) {
        await certificatesApi.update(editing.id, data);
      } else {
        await certificatesApi.create(data);
      }
      setShowForm(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sertifikat o\'chirilsinmi?')) return;
    await certificatesApi.delete(id);
    onRefresh();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Sertifikatlar va Diplomlar</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Sertifikat qo'shish
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            {editing ? 'Tahrirlash' : 'Yangi sertifikat'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Nomi *</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AWS Solutions Architect" />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Bergan tashkilot</label>
                <input className="input" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon, Coursera..." />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Berilgan sana</label>
                <input type="date" className="input" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Muddati tugaydi</label>
                <input type="date" className="input" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Havola (URL)</label>
              <input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://credentials.example.com/..." />
            </div>

            {/* File upload */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Fayl yuklash (rasm yoki PDF)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost" style={{ fontSize: '13px' }}>
                  📎 Fayl tanlash
                </button>
                {filePreview && filePreview !== 'pdf' && (
                  <img src={filePreview} alt="preview" style={{ height: '48px', borderRadius: '4px', border: '1px solid var(--border)' }} />
                )}
                {filePreview === 'pdf' && (
                  <span style={{ fontSize: '13px', color: 'var(--accent)' }}>📄 {file?.name || 'PDF fayl'}</span>
                )}
                {!filePreview && editing?.fileUrl && (
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Mavjud fayl saqlangan</span>
                )}
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>JPG, PNG, WebP yoki PDF — 10MB gacha</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>
              {loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {certificates.length === 0 ? (
        <EmptyState icon="🏆" text="Hali sertifikat qo'shilmagan" onAdd={openAdd} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {certificates.map((c) => {
            const fileSrc = c.fileUrl ? (c.fileUrl.startsWith('http') ? c.fileUrl : `${API_URL}${c.fileUrl}`) : null;
            return (
              <div key={c.id} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Header: issuer badge + info */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingRight: '52px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #00c853, #00e5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
                    🏆
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.3 }}>{c.title}</h3>
                    {c.issuer && <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '2px' }}>{c.issuer}</p>}
                    {c.issueDate && (
                      <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
                        Berilgan: {formatDate(c.issueDate)}
                        {c.expiryDate ? ` · Muddati: ${formatDate(c.expiryDate)}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Show credential button */}
                {c.url && (
                  <div>
                    <a href={c.url} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--text)', background: 'transparent', border: '1px solid var(--border2)', borderRadius: '6px', padding: '6px 12px', textDecoration: 'none' }}>
                      <ExternalLink size={11} /> Sertifikatni ko'rish
                    </a>
                  </div>
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

                {/* Edit/delete */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────
function EmptyState({ icon, text, onAdd }: { icon: string; text: string; onAdd: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontSize: '14px', marginBottom: '16px' }}>{text}</p>
      <button onClick={onAdd} className="btn-primary" style={{ fontSize: '13px' }}>
        <Plus size={14} /> Qo'shish
      </button>
    </div>
  );
}