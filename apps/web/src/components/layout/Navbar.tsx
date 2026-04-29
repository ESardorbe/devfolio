'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth.store';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: 'var(--text)',
          }}
        >
          Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
        </span>
      </Link>

      {/* Nav links */}
      <ul style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
        {[
          { href: '/#features', label: 'Imkoniyatlar' },
          { href: '/#preview', label: 'Namuna' },
          { href: '/#pricing', label: 'Narx' },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              style={{
                color: 'var(--text2)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text2)')}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {isAuthenticated() ? (
          <>
            <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: 'none' }}>
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <Link
              href={`/u/${user?.username}`}
              className="btn-ghost"
              style={{ textDecoration: 'none' }}
            >
              <User size={14} />
              Profilim
            </Link>
            <button
              onClick={logout}
              className="btn-ghost"
              style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
            >
              <LogOut size={14} />
              Chiqish
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>
              Kirish
            </Link>
            <Link href="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
              Boshlash →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}