'use client';

import Link from 'next/link';
import { Navbar } from '@/src/components/layout/Navbar';


export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -55%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          top: '30%', left: '20%',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          borderRadius: '100px',
          padding: '6px 16px',
          fontSize: '12px',
          fontFamily: 'var(--mono)',
          color: 'var(--accent)',
          marginBottom: '28px',
        }}>
          <span style={{
            width: '6px', height: '6px',
            background: 'var(--accent)',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'pulse-dot 2s infinite',
          }} />
          IT mutaxassislari uchun #1 portfolio platforma
        </div>

        {/* H1 */}
        <h1 className="animate-fade-up-1" style={{
          fontSize: 'clamp(44px, 7vw, 88px)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-3px',
          marginBottom: '20px',
        }}>
          O'zingizni professional
          <br />
          <span style={{ color: 'var(--accent)' }}>namoyish eting</span>
        </h1>

        <p className="animate-fade-up-2" style={{
          fontSize: '18px',
          color: 'var(--text2)',
          maxWidth: '540px',
          lineHeight: 1.65,
          marginBottom: '40px',
          fontWeight: 300,
        }}>
          GitHub bilan integratsiya, interaktiv portfolio va ulashish mumkin bo'lgan
          professional profil — barchasi bir joyda.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-3" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/register" className="btn-big" style={{ textDecoration: 'none' }}>
            Bepul boshlash →
          </Link>
          <Link href={"/u/demo" as any} className="btn-big-ghost" style={{ textDecoration: 'none' }}>
            Namunani ko'rish
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-up-4" style={{
          display: 'flex',
          gap: '48px',
          marginTop: '64px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { num: '2.4K+', label: 'FAOL FOYDALANUVCHILAR' },
            { num: '98%', label: 'MAMNUNLIK DARAJASI' },
            { num: '15K+', label: 'YARATILGAN PORTFOLIOLAR' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--text)',
              }}>
                {stat.num.includes('+') ? (
                  <>{stat.num.replace('+', '')}<span style={{ color: 'var(--accent)' }}>+</span></>
                ) : stat.num.includes('%') ? (
                  <>{stat.num.replace('%', '')}<span style={{ color: 'var(--accent)' }}>%</span></>
                ) : stat.num}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px', fontWeight: 500, letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '12px' }}>
              Nima uchun <span style={{ color: 'var(--accent)' }}>DevFolio</span>?
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
              Oddiy CV dan ko'ra ko'proq — bu sizning professional identifikatoringiz
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {[
              {
                icon: '⚡',
                title: 'GitHub Integratsiya',
                desc: 'Repositorylaringiz, contribution grafigingiz va faolligingiz avtomatik ko\'rsatiladi.',
                color: 'var(--accent)',
              },
              {
                icon: '🎨',
                title: 'Zamonaviy Dizayn',
                desc: 'Professional va toza ko\'rinish. Har bir profil noyob va chiroyli.',
                color: 'var(--accent2)',
              },
              {
                icon: '🔗',
                title: 'Ulashish Mumkin',
                desc: 'devfolio.uz/u/username — bu sizning online rezyumeyingiz. Istalgan joyda ulashing.',
                color: 'var(--accent3)',
              },
              {
                icon: '📄',
                title: 'PDF / Word Export',
                desc: 'Profilingizni bir tugma bilan PDF yoki Word formatda yuklab oling.',
                color: 'var(--accent)',
              },
              {
                icon: '🛡️',
                title: 'Xavfsiz va Tez',
                desc: 'JWT autentifikatsiya, OAuth (GitHub, Google) va tez ishlash kafolati.',
                color: 'var(--accent2)',
              },
              {
                icon: '📊',
                title: 'Profil Statistika',
                desc: 'Profilingizni kim ko\'rganini, qayerdan kelganini kuzatib boring.',
                color: 'var(--accent3)',
              },
            ].map((f) => (
              <div key={f.title} className="card" style={{
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: f.color }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{
        padding: '80px 48px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '60px 40px',
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          borderRadius: '20px',
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>
            Bugun boshlang
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
            5 daqiqada professional portfoliongizni yarating va ish beruvchilarga ulashing
          </p>
          <Link href="/register" className="btn-big" style={{ textDecoration: 'none' }}>
            Bepul ro'yxatdan o'tish →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700 }}>
          Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
        </span>
        <p style={{ fontSize: '13px', color: 'var(--text3)' }}>
          © 2026 DevFolio. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </>
  );
}