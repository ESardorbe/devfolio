'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/store/auth.store';
import { useTheme } from '@/src/hooks/useTheme';
import { User, LogOut, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#features', label: 'Imkoniyatlar' },
  { href: '/#preview', label: 'Namuna' },
];

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 20px 48px;
          background: rgba(var(--navbar-bg, 10,10,15), 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          transition: background 0.3s, border-color 0.3s;
        }
        [data-theme="light"] .navbar {
          background: rgba(242,242,248,0.88);
        }
        .navbar-links {
          display: flex;
          gap: 32px;
          list-style: none;
          justify-content: center;
          margin: 0;
          padding: 0;
        }
        .navbar-auth {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: flex-end;
        }
        .navbar-hamburger {
          display: none;
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 4px;
          align-items: center;
          justify-content: flex-end;
        }
        .navbar-mobile {
          display: none;
          position: fixed;
          top: 61px; left: 0; right: 0;
          background: rgba(10,10,15,0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 20px 20px 24px;
          flex-direction: column;
          gap: 4px;
          z-index: 99;
        }
        [data-theme="light"] .navbar-mobile {
          background: rgba(242,242,248,0.98);
        }
        .navbar-mobile.open { display: flex; }
        .navbar-mobile-link {
          color: var(--text2);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 10px 4px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .navbar-mobile-link:hover { color: var(--text); }
        .navbar-mobile-divider {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }
        .navbar-mobile-btns {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .theme-btn {
          background: none;
          border: 1px solid var(--border2);
          color: var(--text2);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .theme-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        @media (max-width: 1023px) {
          .navbar { padding: 16px 24px; }
          .navbar-links { gap: 20px; }
          .navbar-auth { gap: 8px; }
        }
        @media (max-width: 900px) {
          .navbar {
            grid-template-columns: 1fr auto;
            padding: 14px 20px;
          }
          .navbar-links { display: none; }
          .navbar-auth { display: none; }
          .navbar-hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .navbar { padding: 12px 16px; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" width="36" height="28" alt="DevFolio logo" style={{ display: 'block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
            Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
          </span>
        </Link>

        <ul className="navbar-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href as any}
                style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text2)')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-auth">
          {mounted && (
            <button onClick={toggle} className="theme-btn" title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
          {!mounted ? null : isAuthenticated() ? (
            <>
              <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: 'none' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link href={`/u/${user?.username}` as any} className="btn-ghost" style={{ textDecoration: 'none' }}>
                <User size={14} /> Profilim
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}>
                <LogOut size={14} /> Chiqish
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>Kirish</Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Boshlash →</Link>
            </>
          )}
        </div>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href as any} className="navbar-mobile-link" onClick={close}>
            {link.label}
          </Link>
        ))}
        <div className="navbar-mobile-divider" />
        <div className="navbar-mobile-btns">
          {mounted && (
            <button
              onClick={() => { toggle(); close(); }}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', gap: '8px' }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
            </button>
          )}
          {!mounted ? null : isAuthenticated() ? (
            <>
              <Link href="/dashboard" className="btn-ghost" onClick={close} style={{ textDecoration: 'none' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link href={`/u/${user?.username}` as any} className="btn-ghost" onClick={close} style={{ textDecoration: 'none' }}>
                <User size={14} /> Profilim
              </Link>
              <button onClick={() => { handleLogout(); close(); }} className="btn-ghost" style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}>
                <LogOut size={14} /> Chiqish
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" onClick={close} style={{ textDecoration: 'none', justifyContent: 'center' }}>Kirish</Link>
              <Link href="/register" className="btn-primary" onClick={close} style={{ textDecoration: 'none', justifyContent: 'center' }}>Boshlash →</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
