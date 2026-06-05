'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/auth.store';
import { useTheme } from '@/src/hooks/useTheme';
import {
  skillsApi, projectsApi, experiencesApi,
  educationsApi, usersApi, certificatesApi,
  type Skill, type Project, type Experience, type Education, type Certificate,
} from '@/src/services';
import {
  Plus, Trash2, Edit3, ExternalLink, GitBranch,
  Eye, Briefcase, GraduationCap, Code2,
  Settings, ChevronRight, Star, Download,
  LayoutDashboard, LogOut, Sun, Moon, Award, Menu,
  TrendingUp, Zap, Rocket, Users,
} from 'lucide-react';
import { ExportModal } from '@/src/components/ExportModal';
import { ConfirmModal } from '@/src/components/ConfirmModal';
import { LEVEL_COLORS, LEVEL_LABELS } from '@/src/lib/constants';
import { useUIStore } from '@/src/store/ui.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:4000';

type Tab = 'overview' | 'skills' | 'projects' | 'experience' | 'education' | 'certificates' | 'github';

const DB_STYLES = `
  .db-layout {
    display: flex;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .db-sidebar {
    width: 260px;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 50;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
    overflow-y: auto;
  }
  .db-sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
  }
  .db-sidebar-user {
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .db-sidebar-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: var(--surface2);
    overflow: hidden;
  }
  .db-sidebar-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  .db-sidebar-headline {
    font-size: 11px;
    color: var(--text3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  .db-nav {
    padding: 12px 12px;
    flex: 1;
  }
  .db-nav-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--text3);
    padding: 8px 8px 4px;
    text-transform: uppercase;
  }
  .db-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    background: none;
    border: none;
    color: var(--text2);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    margin-bottom: 2px;
  }
  .db-nav-item:hover { background: var(--surface2); color: var(--text); }
  .db-nav-item.active { background: rgba(0,255,136,0.1); color: var(--accent); }
  .db-nav-item.active svg { color: var(--accent); }
  .db-nav-count {
    margin-left: auto;
    background: var(--surface2);
    color: var(--text3);
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 100px;
    font-family: var(--mono);
  }
  .db-nav-item.active .db-nav-count {
    background: rgba(0,255,136,0.15);
    color: var(--accent);
  }
  .db-sidebar-footer {
    padding: 12px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .db-footer-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    background: none;
    border: none;
    color: var(--text2);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    transition: all 0.15s;
  }
  .db-footer-btn:hover { background: var(--surface2); color: var(--text); }
  .db-footer-btn.danger { color: #ff6b6b; }
  .db-footer-btn.danger:hover { background: rgba(255,107,107,0.08); color: #ff6b6b; }

  /* ── Main ── */
  .db-main {
    margin-left: 260px;
    flex: 1;
    padding: 32px;
    min-height: 100vh;
    max-width: calc(100vw - 260px);
    position: relative;
    z-index: 1;
  }
  .db-page-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text);
  }

  /* ── Stats cards ── */
  .db-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  .db-stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .db-stat-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .db-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 14px 14px 0 0;
  }
  .db-stat-card.green::before  { background: var(--accent); }
  .db-stat-card.cyan::before   { background: var(--accent3); }
  .db-stat-card.purple::before { background: var(--accent2); }
  .db-stat-card.amber::before  { background: #f59e0b; }
  .db-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    flex-shrink: 0;
  }
  .db-stat-value {
    font-family: var(--mono);
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
  }
  .db-stat-label {
    font-size: 12px;
    color: var(--text3);
  }

  /* ── Mobile top header ── */
  .db-mobile-header {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 60;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 16px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .db-sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 49;
  }

  /* ── Mobile bottom nav ── */
  .db-bottom-nav {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    z-index: 50;
    padding: 8px 0 env(safe-area-inset-bottom, 8px);
  }
  .db-bottom-nav-inner {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .db-bottom-nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    color: var(--text3);
    font-size: 10px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 8px;
    transition: color 0.15s;
    min-width: 52px;
  }
  .db-bottom-nav-btn.active { color: var(--accent); }
  .db-bottom-nav-btn:not(.active):hover { color: var(--text2); }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .db-sidebar { transform: translateX(-100%); }
    .db-sidebar.open { transform: translateX(0); }
    .db-sidebar-overlay.open { display: block; }
    .db-main { margin-left: 0; padding: 80px 16px 90px; max-width: 100vw; }
    .db-mobile-header { display: flex; }
    .db-bottom-nav { display: block; }
    .db-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .db-page-title { font-size: 17px; margin-bottom: 16px; }
  }
  @media (max-width: 480px) {
    .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
  }

  /* ── Responsive form grids ── */
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 600px) {
    .form-row-3 { grid-template-columns: 1fr; }
    .form-row-2 { grid-template-columns: 1fr; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

const BOTTOM_TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview',      label: 'Umumiy',    icon: LayoutDashboard },
  { id: 'skills',        label: 'Ko\'nikma', icon: Code2 },
  { id: 'projects',      label: 'Loyiha',    icon: Star },
  { id: 'experience',    label: 'Tajriba',   icon: Briefcase },
  { id: 'education',     label: 'Ta\'lim',   icon: GraduationCap },
  { id: 'certificates',  label: 'Sertifikat',icon: Award },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { openSettings } = useUIStore();
  const { theme, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [views, setViews] = useState({ total: 0, last30days: 0 });
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (!user) return null;

  const avatarSrc = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`)
    : null;

  const ghUsername = extractGithubUsername(user);

  const SIDEBAR_TABS = [
    { id: 'overview' as Tab,     label: 'Umumiy',       icon: LayoutDashboard },
    ...(ghUsername ? [{ id: 'github' as Tab, label: 'GitHub', icon: GitBranch }] : []),
    { id: 'skills' as Tab,       label: 'Ko\'nikmalar', icon: Code2,         count: skills.length },
    { id: 'projects' as Tab,     label: 'Loyihalar',    icon: Star,          count: projects.length },
    { id: 'experience' as Tab,   label: 'Tajriba',      icon: Briefcase,     count: experiences.length },
    { id: 'education' as Tab,    label: 'Ta\'lim',      icon: GraduationCap, count: educations.length },
    { id: 'certificates' as Tab, label: 'Sertifikatlar',icon: Award,         count: certificates.length },
  ];

  const PAGE_TITLES: Record<Tab, string> = {
    overview:     'Umumiy ko\'rinish',
    skills:       'Ko\'nikmalar',
    projects:     'Loyihalar',
    experience:   'Ish tajribasi',
    education:    'Ta\'lim',
    certificates: 'Sertifikatlar va Diplomlar',
    github:       'GitHub Faolligi',
  };

  return (
    <>
      <style>{DB_STYLES}</style>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        profile={{
          name: user.name, username: user.username, headline: user.headline,
          bio: user.bio, location: user.location, website: user.website,
          github: user.github, linkedin: user.linkedin, phone: user.phone,
          avatarUrl: avatarSrc ?? undefined,
          isOpenToWork: user.isOpenToWork,
          skills, projects, experiences, educations, certificates,
        }}
      />

      {/* Sidebar overlay (mobile) */}
      <div
        className={`db-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <Link href="/" className="db-sidebar-logo">
          <img src="/logo.svg" width="26" height="26" alt="logo" />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
            Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
          </span>
        </Link>

        {/* User */}
        <div className="db-sidebar-user">
          <div
            className="db-sidebar-avatar"
            style={{ backgroundImage: avatarSrc ? `url(${avatarSrc})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {!avatarSrc && '👤'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="db-sidebar-name">{user.name || user.username}</p>
            <p className="db-sidebar-headline">{user.headline || 'Headline qo\'shing'}</p>
            {user.isOpenToWork && (
              <span className="tag tag-accent" style={{ fontSize: '9px', marginTop: '4px' }}>🟢 Open to work</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="db-nav">
          <p className="db-nav-label">Navigatsiya</p>
          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`db-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={15} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="db-nav-count">{tab.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="db-sidebar-footer">
          <Link href={`/u/${user.username}` as any} target="_blank" className="db-footer-btn">
            <Eye size={14} /> Profilni ko'rish
          </Link>
          <button onClick={() => setShowExport(true)} className="db-footer-btn">
            <Download size={14} /> CV Yuklab olish
          </button>
          <button onClick={openSettings} className="db-footer-btn">
            <Settings size={14} /> Sozlamalar
          </button>
          <button onClick={toggle} className="db-footer-btn">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
          </button>
          <button onClick={handleLogout} className="db-footer-btn danger">
            <LogOut size={14} /> Chiqish
          </button>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <header className="db-mobile-header">
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px', display: 'flex' }}
        >
          <Menu size={22} />
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
          Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
        </span>
        <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

      {/* ── Main content ── */}
      <div className="db-layout">
        <main className="db-main">
          <h1 className="db-page-title">{PAGE_TITLES[activeTab]}</h1>

          {/* Action row (only overview) */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <Link href={`/u/${user.username}` as any} target="_blank" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '12px', padding: '7px 14px' }}>
                <Eye size={13} /> Profilni ko'rish
              </Link>
              <button onClick={() => setShowExport(true)} className="btn-ghost" style={{ fontSize: '12px', padding: '7px 14px' }}>
                <Download size={13} /> CV yuklab olish
              </button>
              <button onClick={openSettings} className="btn-primary" style={{ fontSize: '12px', padding: '7px 14px' }}>
                <Settings size={13} /> Sozlamalar
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid var(--border2)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              Yuklanmoqda...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  user={user}
                  views={views}
                  skills={skills}
                  projects={projects}
                  experiences={experiences}
                  onChangeTab={changeTab}
                  onOpenSettings={openSettings}
                />
              )}
              {activeTab === 'skills' && <SkillsTab skills={skills} onRefresh={loadAll} />}
              {activeTab === 'projects' && <ProjectsTab projects={projects} onRefresh={loadAll} />}
              {activeTab === 'experience' && <ExperienceTab experiences={experiences} onRefresh={loadAll} />}
              {activeTab === 'education' && <EducationTab educations={educations} onRefresh={loadAll} />}
              {activeTab === 'certificates' && <CertificatesTab certificates={certificates} onRefresh={loadAll} />}
              {activeTab === 'github' && <GitHubTab user={user} />}
            </>
          )}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="db-bottom-nav">
        <div className="db-bottom-nav-inner">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`db-bottom-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/* ─── Overview Tab ─────────────────────────────────────────── */
function OverviewTab({ user, views, skills, projects, experiences, onChangeTab, onOpenSettings }: {
  user: any; views: any; skills: Skill[]; projects: Project[]; experiences: Experience[];
  onChangeTab: (t: Tab) => void; onOpenSettings: () => void;
}) {
  const githubUsername = extractGithubUsername(user);
  const { repos: ghRepos, loading: ghLoading } = useGitHubData(githubUsername);

  const completionItems = [
    { label: 'Bio', done: !!user.bio },
    { label: 'Headline', done: !!user.headline },
    { label: 'Joylashuv', done: !!user.location },
    { label: 'GitHub havolasi', done: !!user.github },
    { label: "Ko'nikmalar (3+)", done: skills.length >= 3 },
    { label: 'Loyihalar (1+)', done: projects.length >= 1 },
    { label: 'Ish tajribasi', done: experiences.length >= 1 },
  ];
  const pct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);
  const topRepos = [...ghRepos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);

  return (
    <div>
      {/* Stats */}
      <div className="db-stats-grid">
        {[
          { label: "Jami ko'rishlar", value: views.total,      icon: <Eye size={17}/>,        iconBg: 'rgba(0,255,136,0.12)',  iconColor: 'var(--accent)',  color: 'var(--accent)',  cls: 'green'  },
          { label: "So'nggi 30 kun",  value: views.last30days, icon: <TrendingUp size={17}/>, iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--accent3)', color: 'var(--accent3)', cls: 'cyan'   },
          { label: 'Loyihalar',        value: projects.length,  icon: <Rocket size={17}/>,     iconBg: 'rgba(124,58,237,0.12)', iconColor: 'var(--accent2)', color: 'var(--accent2)', cls: 'purple' },
          { label: "Ko'nikmalar",     value: skills.length,    icon: <Zap size={17}/>,        iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b',        color: '#f59e0b',        cls: 'amber'  },
        ].map((s) => (
          <div key={s.label} className={`db-stat-card ${s.cls}`}>
            <div className="db-stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
            <div className="db-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Profile completion */}
        <div className="card">
          {(() => {
            const sz = 72, sw = 6, r = (sz - sw) / 2;
            const circ = 2 * Math.PI * r;
            const offset = circ - (pct / 100) * circ;
            return (
              <>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                  <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ flexShrink: 0 }}>
                    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="var(--surface2)" strokeWidth={sw} />
                    <circle cx={sz/2} cy={sz/2} r={r} fill="none"
                      stroke={pct === 100 ? 'var(--accent)' : 'var(--accent2)'}
                      strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset}
                      strokeLinecap="round" transform={`rotate(-90 ${sz/2} ${sz/2})`}
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                    <text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central"
                      fill="var(--text)" fontSize="15" fontWeight="700" fontFamily="var(--mono)">
                      {pct}%
                    </text>
                  </svg>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>
                      {pct === 100 ? "Profil to'liq!" : "Profil to'liqligi"}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '6px' }}>
                      {completionItems.filter(i => i.done).length}/{completionItems.length} qism tayyor
                    </p>
                    <button onClick={onOpenSettings} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: 500, padding: 0, fontFamily: 'var(--sans)' }}>
                      Tahrirlash →
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                  {completionItems.map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0, background: item.done ? 'var(--accent)' : 'var(--surface2)', border: item.done ? 'none' : '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.done && <span style={{ color: '#000', fontSize: '8px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: '11px', color: item.done ? 'var(--text)' : 'var(--text3)' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Tezkor amallar</h3>

          {githubUsername ? (
            <>
              {/* GitHub repos section */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitBranch size={13} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>GitHub Repos</span>
                  </div>
                  <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)'; }}
                  >
                    {githubUsername} <ExternalLink size={10} />
                  </a>
                </div>
                {ghLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} style={{ height: '46px', borderRadius: '8px', background: 'var(--surface2)', animation: 'pulse 1.5s ease infinite' }} />
                    ))}
                  </div>
                ) : topRepos.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', padding: '10px 0' }}>Repository topilmadi</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {topRepos.map(repo => (
                      <div
                        key={repo.id}
                        onClick={() => window.open(repo.html_url, '_blank')}
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                            {repo.name}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                            <Star size={10} style={{ color: 'var(--text3)' }} />
                            <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{repo.stargazers_count}</span>
                          </div>
                        </div>
                        {repo.description && (
                          <p style={{ fontSize: '10px', color: 'var(--text2)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {repo.description}
                          </p>
                        )}
                        {repo.language && (
                          <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '9px', padding: '1px 5px', borderRadius: '100px', background: 'rgba(57,255,133,0.1)', color: 'var(--accent)' }}>
                            {repo.language}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: "Ko'nikma qo'shish", icon: <Zap size={15}/>,   tab: 'skills'   as Tab },
                  { label: "Loyiha qo'shish",   icon: <Rocket size={15}/>, tab: 'projects' as Tab },
                ].map((q) => (
                  <button
                    key={q.label}
                    onClick={() => onChangeTab(q.tab)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', cursor: 'pointer', color: 'var(--text)', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s', textAlign: 'left' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>{q.icon}</span>
                    {q.label}
                    <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text3)' }} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: "Ko'nikma qo'shish", icon: <Zap size={15}/>,          tab: 'skills'     as Tab },
                { label: "Loyiha qo'shish",   icon: <Rocket size={15}/>,        tab: 'projects'   as Tab },
                { label: "Tajriba qo'shish",  icon: <Briefcase size={15}/>,     tab: 'experience' as Tab },
                { label: "Ta'lim qo'shish",   icon: <GraduationCap size={15}/>, tab: 'education'  as Tab },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => onChangeTab(q.tab)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', color: 'var(--text)', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s', textAlign: 'left' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>{q.icon}</span>
                  {q.label}
                  <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text3)' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GitHub Faolligi */}
      {githubUsername && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch size={15} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>GitHub Faolligi</span>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)'; }}
            >
              github.com/{githubUsername} <ExternalLink size={11} />
            </a>
          </div>
          <ContributionGraph username={githubUsername} />
        </div>
      )}

      {/* Profile URL promo */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(124,58,237,0.06) 100%)', borderColor: 'rgba(0,255,136,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Profilingiz havolasi</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)' }}>
              devfolio.uz/u/{user.username}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { navigator.clipboard.writeText(`devfolio.uz/u/${user.username}`); }}
              className="btn-ghost"
              style={{ fontSize: '12px', padding: '7px 14px' }}
            >
              Nusxa olish
            </button>
            <Link href={`/u/${user.username}` as any} target="_blank" className="btn-primary" style={{ textDecoration: 'none', fontSize: '12px', padding: '7px 14px' }}>
              Ko'rish →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skills Tab ─────────────────────────────────────────── */
function SkillsTab({ skills, onRefresh }: { skills: Skill[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: '', level: 'INTERMEDIATE', category: '' });
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm({ name: '', level: 'INTERMEDIATE', category: '' }); setShowForm(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, level: s.level, category: s.category || '' }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      if (editing) await skillsApi.update(editing.id, { ...form, level: form.level as Skill['level'] });
      else await skillsApi.create(form);
      setShowForm(false); onRefresh();
    } finally { setLoading(false); }
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await skillsApi.delete(deleteConfirmId);
    setDeleteConfirmId(null);
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
      <ConfirmModal
        open={!!deleteConfirmId}
        title="Ko'nikmani o'chirish"
        message="Bu ko'nikma profilingizdan butunlay o'chiriladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{skills.length} ta ko'nikma</p>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Ko'nikma qo'shish
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>
            {editing ? 'Ko\'nikmani tahrirlash' : 'Yangi ko\'nikma'}
          </h3>
          <div className="form-row-3" style={{ marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Nomi *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="TypeScript" />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Daraja</label>
              <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {Object.entries(LEVEL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Kategoriya</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Frontend, Backend..." />
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

      {skills.length === 0 ? (
        <EmptyState icon={<Zap size={26}/>} text="Hali ko'nikma qo'shilmagan" onAdd={openAdd} />
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {items.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: LEVEL_COLORS[skill.level] || 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{skill.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{LEVEL_LABELS[skill.level]}</span>
                  <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                    <button onClick={() => openEdit(skill)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '2px' }}><Edit3 size={12} /></button>
                    <button onClick={() => handleDelete(skill.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '2px' }}><Trash2 size={12} /></button>
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

/* ─── Projects Tab ─────────────────────────────────────────── */
function ProjectsTab({ projects, onRefresh }: { projects: Project[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', techs: '', github: '', demo: '', featured: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', techs: '', github: '', demo: '', featured: false }); setFormError(''); setShowForm(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ title: p.title, description: p.description, techs: p.techs.join(', '), github: p.github || '', demo: p.demo || '', featured: p.featured }); setFormError(''); setShowForm(true); };

  const isValidUrl = (val: string) => { try { return /^https?:$/.test(new URL(val).protocol); } catch { return false; } };

  const handleSubmit = async () => {
    setFormError('');
    if (!form.title.trim()) { setFormError('Loyiha nomini kiriting'); return; }
    if (!form.description.trim()) { setFormError('Tavsifni kiriting'); return; }
    if (form.demo && !isValidUrl(form.demo)) { setFormError('Demo URL noto\'g\'ri formatda'); return; }
    if (form.github && !isValidUrl(form.github)) { setFormError('GitHub URL noto\'g\'ri formatda'); return; }
    setLoading(true);
    try {
      const data = { ...form, techs: form.techs.split(',').map((t) => t.trim()).filter(Boolean), demo: form.demo.trim() || undefined, github: form.github.trim() || undefined };
      if (editing) await projectsApi.update(editing.id, data);
      else await projectsApi.create(data);
      setShowForm(false); onRefresh();
    } catch (err: any) {
      const msg = err?.message;
      setFormError(Array.isArray(msg) ? msg[0] : msg || 'Xato yuz berdi');
    } finally { setLoading(false); }
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await projectsApi.delete(deleteConfirmId);
    setDeleteConfirmId(null);
    onRefresh();
  };

  return (
    <div>
      <ConfirmModal
        open={!!deleteConfirmId}
        title="Loyihani o'chirish"
        message="Bu loyiha profilingizdan butunlay o'chiriladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{projects.length} ta loyiha</p>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Loyiha qo'shish
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{editing ? 'Loyihani tahrirlash' : 'Yangi loyiha'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
            <div className="form-row-2">
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Nomi *</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="DevFolio" />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Texnologiyalar (vergul bilan)</label>
                <input className="input" value={form.techs} onChange={(e) => setForm({ ...form, techs: e.target.value })} placeholder="React, NestJS, PostgreSQL" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Tavsif *</label>
              <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Loyiha haqida..." rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-row-2">
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>GitHub URL</label>
                <input className="input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Demo URL</label>
                <input className="input" value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured sifatida ko'rsat
            </label>
          </div>
          {formError && <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#ff6b6b', marginBottom: '12px' }}>{formError}</div>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>{loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {projects.length === 0 ? <EmptyState icon={<Rocket size={26}/>} text="Hali loyiha qo'shilmagan" onAdd={openAdd} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {projects.map((p) => (
            <div key={p.id} className="card" style={{ position: 'relative' }}>
              {p.featured && <span className="tag tag-accent" style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '10px' }}>⭐ Featured</span>}
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', paddingRight: '70px' }}>{p.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '10px' }}>{p.description.slice(0, 100)}{p.description.length > 100 ? '...' : ''}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                {p.techs.slice(0, 5).map((t) => <span key={t} className="tag tag-purple" style={{ fontSize: '10px' }}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {p.github && <a href={p.github} target="_blank" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={12} /> GitHub</a>}
                  {p.demo && <a href={p.demo} target="_blank" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={12} /> Demo</a>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Experience Tab ──────────────────────────────────────── */
function ExperienceTab({ experiences, onRefresh }: { experiences: Experience[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ company: '', position: '', description: '', startDate: '', endDate: '', isCurrent: false, location: '' });
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm({ company: '', position: '', description: '', startDate: '', endDate: '', isCurrent: false, location: '' }); setShowForm(true); };
  const openEdit = (e: Experience) => { setEditing(e); setForm({ company: e.company, position: e.position, description: e.description || '', startDate: e.startDate.slice(0, 10), endDate: e.endDate?.slice(0, 10) || '', isCurrent: e.isCurrent, location: e.location || '' }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.position.trim()) return;
    setLoading(true);
    try {
      if (editing) await experiencesApi.update(editing.id, form);
      else await experiencesApi.create(form);
      setShowForm(false); onRefresh();
    } finally { setLoading(false); }
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await experiencesApi.delete(deleteConfirmId);
    setDeleteConfirmId(null);
    onRefresh();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });

  return (
    <div>
      <ConfirmModal
        open={!!deleteConfirmId}
        title="Tajribani o'chirish"
        message="Bu ish tajribasi profilingizdan butunlay o'chiriladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{experiences.length} ta tajriba</p>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}><Plus size={14} /> Tajriba qo'shish</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{editing ? 'Tahrirlash' : 'Yangi tajriba'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
            <div className="form-row-2">
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Kompaniya *</label><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Uzum Bank" /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Lavozim *</label><input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Backend Developer" /></div>
            </div>
            <div className="form-row-3">
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Boshlanish</label><input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Tugash</label><input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Joylashuv</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Toshkent" /></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} />
              Hozirda shu yerda ishlayapman
            </label>
            <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Tavsif</label><textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Vazifalar va yutuqlar..." style={{ resize: 'vertical' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>{loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {experiences.length === 0 ? <EmptyState icon={<Briefcase size={26}/>} text="Hali ish tajribasi qo'shilmagan" onAdd={openAdd} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {experiences.map((exp) => (
            <div key={exp.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{exp.position}</h3>
                  {exp.isCurrent && <span className="tag tag-accent" style={{ fontSize: '10px' }}>Hozir</span>}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '4px', fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: exp.description ? '8px' : 0 }}>{fmt(exp.startDate)} — {exp.isCurrent ? 'Hozir' : exp.endDate ? fmt(exp.endDate) : ''}{exp.location && ` · ${exp.location}`}</p>
                {exp.description && <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5 }}>{exp.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <button onClick={() => openEdit(exp)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Education Tab ───────────────────────────────────────── */
function EducationTab({ educations, onRefresh }: { educations: Education[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState({ institution: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, description: '' });
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, description: '' }); setShowForm(true); };
  const openEdit = (e: Education) => { setEditing(e); setForm({ institution: e.institution, degree: e.degree, field: e.field, startDate: e.startDate.slice(0, 10), endDate: e.endDate?.slice(0, 10) || '', isCurrent: e.isCurrent, description: e.description || '' }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.institution.trim()) return;
    setLoading(true);
    try {
      if (editing) await educationsApi.update(editing.id, form);
      else await educationsApi.create(form);
      setShowForm(false); onRefresh();
    } finally { setLoading(false); }
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await educationsApi.delete(deleteConfirmId);
    setDeleteConfirmId(null);
    onRefresh();
  };

  return (
    <div>
      <ConfirmModal
        open={!!deleteConfirmId}
        title="Ta'lim ma'lumotini o'chirish"
        message="Bu ta'lim ma'lumoti profilingizdan butunlay o'chiriladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{educations.length} ta ta'lim</p>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}><Plus size={14} /> Ta'lim qo'shish</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{editing ? 'Tahrirlash' : 'Yangi ta\'lim'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
            <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>O'quv muassasasi *</label><input className="input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="TATU, NUU..." /></div>
            <div className="form-row-2">
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Daraja *</label><input className="input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Bakalavr" /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Yo'nalish *</label><input className="input" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Dasturiy injiniring" /></div>
            </div>
            <div className="form-row-2">
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Boshlanish</label><input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Tugash</label><input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} /></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} />
              Hozirda o'qiyapman
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>{loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {educations.length === 0 ? <EmptyState icon={<GraduationCap size={26}/>} text="Hali ta'lim ma'lumoti qo'shilmagan" onAdd={openAdd} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {educations.map((edu) => (
            <div key={edu.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{edu.institution}</h3>
                  {edu.isCurrent && <span className="tag tag-accent" style={{ fontSize: '10px' }}>Hozir</span>}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '4px' }}>{edu.degree} — {edu.field}</p>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>{new Date(edu.startDate).getFullYear()} — {edu.isCurrent ? 'Hozir' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <button onClick={() => openEdit(edu)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(edu.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Certificates Tab ────────────────────────────────────── */
function CertificatesTab({ certificates, onRefresh }: { certificates: Certificate[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ title: '', issuer: '', issueDate: '', expiryDate: '', url: '' });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => { setEditing(null); setForm({ title: '', issuer: '', issueDate: '', expiryDate: '', url: '' }); setFile(null); setFilePreview(''); setShowForm(true); };
  const openEdit = (c: Certificate) => { setEditing(c); setForm({ title: c.title, issuer: c.issuer || '', issueDate: c.issueDate?.slice(0, 10) || '', expiryDate: c.expiryDate?.slice(0, 10) || '', url: c.url || '' }); setFile(null); setFilePreview(c.fileUrl ? (c.fileUrl.startsWith('http') ? c.fileUrl : `${API_URL}${c.fileUrl}`) : ''); setShowForm(true); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(f.type.startsWith('image/') ? URL.createObjectURL(f) : 'pdf');
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const data = { ...form, file: file || undefined };
      if (editing) await certificatesApi.update(editing.id, data);
      else await certificatesApi.create(data);
      setShowForm(false); onRefresh();
    } finally { setLoading(false); }
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await certificatesApi.delete(deleteConfirmId);
    setDeleteConfirmId(null);
    onRefresh();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });

  return (
    <div>
      <ConfirmModal
        open={!!deleteConfirmId}
        title="Sertifikatni o'chirish"
        message="Bu sertifikat profilingizdan butunlay o'chiriladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{certificates.length} ta sertifikat</p>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}><Plus size={14} /> Sertifikat qo'shish</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--border2)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{editing ? 'Tahrirlash' : 'Yangi sertifikat'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
            <div className="form-row-2">
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Nomi *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AWS Solutions Architect" /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Bergan tashkilot</label><input className="input" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon, Coursera..." /></div>
            </div>
            <div className="form-row-2">
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Berilgan sana</label><input type="date" className="input" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Muddati tugaydi</label><input type="date" className="input" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
            </div>
            <div><label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Havola (URL)</label><input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://credentials.example.com/..." /></div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '5px' }}>Fayl (rasm yoki PDF)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost" style={{ fontSize: '12px' }}>📎 Fayl tanlash</button>
                {filePreview && filePreview !== 'pdf' && <img src={filePreview} alt="preview" style={{ height: '40px', borderRadius: '4px', border: '1px solid var(--border)' }} />}
                {filePreview === 'pdf' && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>📄 {file?.name}</span>}
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ fontSize: '13px' }}>{loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: '13px' }}>Bekor</button>
          </div>
        </div>
      )}

      {certificates.length === 0 ? <EmptyState icon={<Award size={26}/>} text="Hali sertifikat qo'shilmagan" onAdd={openAdd} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {certificates.map((c) => {
            const fileSrc = c.fileUrl ? (c.fileUrl.startsWith('http') ? c.fileUrl : `${API_URL}${c.fileUrl}`) : null;
            return (
              <div key={c.id} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingRight: '52px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'linear-gradient(135deg, #00c853, #00e5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px' }}>🏆</div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.3 }}>{c.title}</h3>
                    {c.issuer && <p style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{c.issuer}</p>}
                    {c.issueDate && <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>Berilgan: {fmt(c.issueDate)}{c.expiryDate ? ` · Muddati: ${fmt(c.expiryDate)}` : ''}</p>}
                  </div>
                </div>
                {c.url && <a href={c.url} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--text)', background: 'transparent', border: '1px solid var(--border2)', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none' }}><ExternalLink size={11} /> Sertifikatni ko'rish</a>}
                {fileSrc && c.fileType === 'image' && <a href={fileSrc} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', textDecoration: 'none' }}><img src={fileSrc} alt={c.title} style={{ width: '70px', height: '46px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} /><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Sertifikat — {c.title}</span></a>}
                {fileSrc && c.fileType === 'pdf' && <a href={fileSrc} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', textDecoration: 'none' }}><div style={{ width: '70px', height: '46px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: '2px' }}><span style={{ fontSize: '18px' }}>📄</span><span style={{ fontSize: '9px', color: '#dc2626', fontWeight: 700 }}>PDF</span></div><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Sertifikat — {c.title}</span></a>}
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

/* ─── Empty State ─────────────────────────────────────────── */
function EmptyState({ icon, text, onAdd }: { icon: React.ReactNode; text: string; onAdd: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text3)' }}>
        {icon}
      </div>
      <p style={{ fontSize: '14px', marginBottom: '16px' }}>{text}</p>
      <button onClick={onAdd} className="btn-primary" style={{ fontSize: '13px' }}><Plus size={14} /> Qo'shish</button>
    </div>
  );
}

/* ─── GitHub Data Types ──────────────────────────────────────── */
interface GitHubProfile {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
}
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  license: { spdx_id: string } | null;
}
interface ContributionDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4; }
interface GitHubContributions { total: Record<string, number>; contributions: ContributionDay[]; }
interface GitHubData {
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  contributions: GitHubContributions | null;
  loading: boolean;
  error: string | null;
}

function extractGithubUsername(user: any): string | null {
  if (user?.githubUsername) return user.githubUsername as string;
  if (user?.github) {
    const m = (user.github as string).match(/github\.com\/([^/?#\s]+)/i);
    return m ? m[1] : null;
  }
  return null;
}

const githubCache = new Map<string, GitHubData>();

function useGitHubData(username: string | null): GitHubData {
  const [data, setData] = useState<GitHubData>(() => {
    if (username && githubCache.has(username)) return githubCache.get(username)!;
    return { profile: null, repos: [], contributions: null, loading: !!username, error: null };
  });

  useEffect(() => {
    if (!username) {
      setData({ profile: null, repos: [], contributions: null, loading: false, error: null });
      return;
    }
    if (githubCache.has(username)) {
      setData(githubCache.get(username)!);
      return;
    }
    setData({ profile: null, repos: [], contributions: null, loading: true, error: null });
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then(r => r.json()),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then(r => r.json()),
    ]).then(([profile, repos]) => {
      const result: GitHubData = {
        profile: profile?.login ? (profile as GitHubProfile) : null,
        repos: Array.isArray(repos) ? (repos as GitHubRepo[]) : [],
        contributions: null,
        loading: false,
        error: null,
      };
      githubCache.set(username, result);
      setData(result);
    }).catch((err: Error) => {
      setData({ profile: null, repos: [], contributions: null, loading: false, error: err.message });
    });
  }, [username]);

  return data;
}

/* ─── Contribution Graph ─────────────────────────────────────── */
const contribCache = new Map<string, GitHubContributions>();

function ContributionGraph({ username }: { username: string }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [contributions, setContributions] = useState<GitHubContributions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `${username}:${selectedYear}`;
    if (contribCache.has(key)) {
      setContributions(contribCache.get(key)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    setContributions(null);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`)
      .then(r => r.json())
      .then(data => {
        if (data?.contributions) {
          contribCache.set(key, data as GitHubContributions);
          setContributions(data as GitHubContributions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username, selectedYear]);

  const days = contributions?.contributions ?? [];

  const CELL = 10, GAP = 2, S = CELL + GAP;
  const LABEL_W = 28, MONTH_H = 18;
  const GH_COLORS = ['var(--surface2)', 'rgba(57,255,133,0.25)', 'rgba(57,255,133,0.50)', 'rgba(57,255,133,0.75)', '#39FF85'];

  const weeks: (ContributionDay | null)[][] = [];
  if (days.length > 0) {
    let week: (ContributionDay | null)[] = [];
    const firstDow = new Date(days[0].date + 'T00:00:00').getDay();
    for (let i = 0; i < firstDow; i++) week.push(null);
    for (const day of days) {
      week.push(day);
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((wk, wi) => {
    const firstDay = wk.find(d => d !== null);
    if (!firstDay) return;
    const m = new Date(firstDay.date + 'T00:00:00').getMonth();
    if (m !== lastMonth) { monthLabels.push({ x: LABEL_W + wi * S, label: MONTHS[m] }); lastMonth = m; }
  });

  const svgW = LABEL_W + weeks.length * S;
  const svgH = MONTH_H + 7 * S;
  const totalCount = contributions?.total?.[selectedYear] ?? days.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
          {loading
            ? <span style={{ color: 'var(--text3)' }}>Yuklanmoqda...</span>
            : <><span style={{ fontWeight: 700, color: 'var(--text)' }}>{totalCount}</span> ta faollik yil davomida</>
          }
        </p>
        <div style={{ display: 'flex', gap: '4px' }}>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                padding: '3px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'var(--mono)', border: '1px solid var(--border2)',
                background: selectedYear === y ? 'rgba(0,255,136,0.15)' : 'transparent',
                color: selectedYear === y ? 'var(--accent)' : 'var(--text3)',
                transition: 'all 0.15s',
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ height: '88px', borderRadius: '8px', background: 'var(--surface2)', animation: 'pulse 1.5s ease infinite' }} />
      ) : days.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>
          Bu yil uchun faollik ma&apos;lumotlari topilmadi
        </p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <svg width={svgW} height={svgH} style={{ display: 'block', minWidth: `${svgW}px` }}>
              {monthLabels.map(({ x, label }) => (
                <text key={`${label}-${x}`} x={x} y={13} fontSize="10" fill="var(--text3)" fontFamily="var(--sans)">{label}</text>
              ))}
              {[{ label: 'Mon', dow: 1 }, { label: 'Wed', dow: 3 }, { label: 'Fri', dow: 5 }].map(({ label, dow }) => (
                <text key={label} x={LABEL_W - 4} y={MONTH_H + dow * S + CELL - 1} fontSize="9" fill="var(--text3)" textAnchor="end" fontFamily="var(--sans)">{label}</text>
              ))}
              {weeks.map((wk, wi) =>
                wk.map((day, di) => (
                  <rect key={`${wi}-${di}`} x={LABEL_W + wi * S} y={MONTH_H + di * S} width={CELL} height={CELL} rx={2}
                    fill={day ? GH_COLORS[day.level] : GH_COLORS[0]}
                  >
                    {day?.date ? <title>{day.date}: {day.count} contributions</title> : null}
                  </rect>
                ))
              )}
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '10px', color: 'var(--text3)', marginRight: '4px' }}>Less</span>
            {GH_COLORS.map((color, i) => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
            ))}
            <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: '4px' }}>More</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── GitHub Tab ─────────────────────────────────────────────── */
function GitHubTab({ user }: { user: any }) {
  const githubUsername = extractGithubUsername(user);
  const { profile, repos, loading } = useGitHubData(githubUsername);
  const [filter, setFilter] = useState<'all' | 'source' | 'forked'>('all');
  const [sort, setSort] = useState<'stars' | 'updated' | 'name'>('stars');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  if (!githubUsername) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
        <GitBranch size={36} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
        <p style={{ marginBottom: '8px' }}>GitHub profilingiz ulanmagan</p>
        <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Sozlamalar → Ijtimoiy tarmoqlar da GitHub URL ni qo'shing</p>
      </div>
    );
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  const filteredRepos = repos
    .filter(r => filter === 'all' ? true : filter === 'source' ? !r.fork : r.fork)
    .sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sort === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return a.name.localeCompare(b.name);
    });

  const pagedRepos = filteredRepos.slice(0, page * PER_PAGE);

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'bugun';
    if (d === 1) return 'kecha';
    if (d < 30) return `${d} kun oldin`;
    if (d < 365) return `${Math.floor(d / 30)} oy oldin`;
    return `${Math.floor(d / 365)} yil oldin`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Stats */}
      <div className="db-stats-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="db-stat-card" style={{ minHeight: '100px', animation: 'pulse 1.5s ease infinite' }} />
            ))
          : [
              { label: 'Repositories', value: profile?.public_repos ?? repos.length, color: 'var(--accent)',  cls: 'green',  bg: 'rgba(0,255,136,0.12)',  icon: <GitBranch size={17} /> },
              { label: 'Stars',         value: totalStars,                            color: '#f59e0b',        cls: 'amber',  bg: 'rgba(245,158,11,0.12)', icon: <Star size={17} /> },
              { label: 'Followers',     value: profile?.followers ?? 0,              color: 'var(--accent3)', cls: 'cyan',   bg: 'rgba(6,182,212,0.12)',  icon: <Users size={17} /> },
              { label: 'Following',     value: profile?.following ?? 0,              color: 'var(--accent2)', cls: 'purple', bg: 'rgba(124,58,237,0.12)', icon: <Users size={17} /> },
            ].map(s => (
              <div key={s.label} className={`db-stat-card ${s.cls}`}>
                <div className="db-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="db-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            ))}
      </div>

      {/* Contribution graph */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <GitBranch size={15} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>GitHub Faolligi</span>
        </div>
        <ContributionGraph username={githubUsername!} />
      </div>

      {/* Repos */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Repositories ({filteredRepos.length})</h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {(['all', 'source', 'forked'] as const).map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', border: '1px solid var(--border2)', fontFamily: 'var(--sans)', background: filter === f ? 'rgba(0,255,136,0.1)' : 'transparent', color: filter === f ? 'var(--accent)' : 'var(--text2)' }}
              >
                {f === 'all' ? 'Hammasi' : f === 'source' ? 'Asosiy' : 'Fork'}
              </button>
            ))}
            <span style={{ color: 'var(--border2)' }}>|</span>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as 'stars' | 'updated' | 'name'); setPage(1); }}
              className="input"
              style={{ fontSize: '11px', padding: '4px 8px', width: 'auto', cursor: 'pointer' }}
            >
              <option value="stars">Stars ↓</option>
              <option value="updated">Updated ↓</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Yuklanmoqda...</div>
        ) : filteredRepos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Repository topilmadi</div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {pagedRepos.map(repo => (
                <div
                  key={repo.id}
                  onClick={() => window.open(repo.html_url, '_blank')}
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <GitBranch size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {repo.name}
                      </span>
                      {repo.fork && <span style={{ fontSize: '9px', color: 'var(--text3)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>fork</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '8px' }}>
                      {repo.forks_count > 0 && (
                        <span style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <GitBranch size={10} /> {repo.forks_count}
                        </span>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={11} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{repo.stargazers_count}</span>
                      </div>
                      <ExternalLink size={12} style={{ color: 'var(--text3)' }} />
                    </div>
                  </div>
                  {repo.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px', lineHeight: 1.5 }}>
                      {repo.description.length > 100 ? repo.description.slice(0, 100) + '…' : repo.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {repo.language && (
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: 'rgba(57,255,133,0.1)', color: 'var(--accent)', fontWeight: 500 }}>
                        {repo.language}
                      </span>
                    )}
                    {repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION' && (
                      <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{repo.license.spdx_id}</span>
                    )}
                    <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: 'auto' }}>{timeAgo(repo.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
            {pagedRepos.length < filteredRepos.length && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="btn-ghost"
                style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '10px' }}
              >
                Ko'proq yuklash ({filteredRepos.length - pagedRepos.length} ta qoldi)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
