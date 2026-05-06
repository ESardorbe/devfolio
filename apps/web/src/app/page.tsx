'use client';

import Link from 'next/link';
import { Navbar } from '@/src/components/layout/Navbar';
import { GitBranch, Link2, Send, MapPin, Star, ExternalLink } from 'lucide-react';

// ─── Mock profile for preview section ─────────────────────
const MOCK = {
  name: 'Asilbek Nazarov',
  username: 'asilbek.dev',
  headline: 'Full-Stack Developer · NestJS & Next.js',
  location: 'Toshkent, O\'zbekiston',
  isOpenToWork: true,
  bio: 'Backend va frontend bo\'yicha 3 yillik tajribaga ega dasturchi. Clean code va skalabul arxitekturaga ishtiyoqmandman.',
  skills: [
    { name: 'TypeScript', level: 'EXPERT', cat: 'BACKEND' },
    { name: 'NestJS', level: 'ADVANCED', cat: 'BACKEND' },
    { name: 'PostgreSQL', level: 'ADVANCED', cat: 'BACKEND' },
    { name: 'Next.js', level: 'ADVANCED', cat: 'FRONTEND' },
    { name: 'React', level: 'EXPERT', cat: 'FRONTEND' },
    { name: 'Docker', level: 'INTERMEDIATE', cat: 'DEVOPS' },
  ],
  projects: [
    {
      title: 'DevFolio',
      description: 'IT mutaxassislari uchun professional portfolio platformasi. NestJS backend, Next.js frontend.',
      techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma'],
      featured: true,
      github: '#',
      demo: '#',
    },
    {
      title: 'TaskFlow API',
      description: 'Real-time task management tizimi. WebSocket, Redis queue va JWT auth.',
      techs: ['NestJS', 'Redis', 'WebSocket'],
      featured: false,
      github: '#',
    },
  ],
};

const LEVEL_DOT: Record<string, string> = {
  EXPERT: '#f59e0b',
  ADVANCED: '#00ff88',
  INTERMEDIATE: '#06b6d4',
  BEGINNER: '#6366f1',
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
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
        {/* Glows */}
        <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', top: '20%', left: '10%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', top: '60%', right: '8%', pointerEvents: 'none' }} />

        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: '100px', padding: '6px 18px',
          fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--accent)', marginBottom: '32px',
        }}>
          <span style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
          IT mutaxassislari uchun portfolio platforma
        </div>

        {/* H1 */}
        <h1 className="animate-fade-up-1" style={{
          fontSize: 'clamp(42px, 6.5vw, 84px)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-3px',
          marginBottom: '24px',
        }}>
          Kod yozasiz.
          <br />
          <span style={{ color: 'var(--accent)' }}>Biz sizni ko'rsatamiz.</span>
        </h1>

        <p className="animate-fade-up-2" style={{
          fontSize: '18px', color: 'var(--text2)', maxWidth: '520px',
          lineHeight: 1.7, marginBottom: '44px', fontWeight: 300,
        }}>
          Loyihalaringiz, ko'nikmalaringiz va tajribangizni bir sahifada jamlang —
          recruiter yoki mijoz qidirayotgan narsasi aynan shu.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-3" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '72px' }}>
          <Link href="/register" className="btn-big" style={{ textDecoration: 'none' }}>
            Bepul boshlash →
          </Link>
          <a href="#preview" className="btn-big-ghost">
            Namunani ko'rish ↓
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fade-up-4" style={{ display: 'flex', gap: '56px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { num: '3 daqiqa', label: 'PORTFOLIO YARATISH VAQTI' },
            { num: '100%', label: 'BEPUL' },
            { num: 'devfolio.uz/u/siz', label: 'SHAXSIY URL' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
                {s.num}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px', letterSpacing: '0.8px', fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '100px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '12px' }}>IMKONIYATLAR</p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '12px' }}>
              Oddiy CV emas —<br /><span style={{ color: 'var(--accent)' }}>jonli portfolio</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              Har bir blok interaktiv, har bir sahifa unikal va recruiterlar uchun qulay
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { icon: '⚡', title: 'GitHub Integratsiya', desc: 'Repolaringiz, kontribusiyalaringiz va faolligingiz avtomatik tortiladi. Qo\'lda hech narsa kiritmasangiz ham bo\'ladi.', color: 'var(--accent)' },
              { icon: '🎯', title: 'Shaxsiy URL', desc: 'devfolio.uz/u/sizning-ismingiz — professional link. Rezyumeyingizga, LinkedIn\'ga, email imzogizga qo\'ying.', color: 'var(--accent2)' },
              { icon: '📊', title: 'Kim ko\'rdi?', desc: 'Profilingizni nechi kishi ko\'rganini, qaysi shahardan kirganini real vaqtda kuzating.', color: 'var(--accent3)' },
              { icon: '🔐', title: 'OAuth kirish', desc: 'GitHub yoki Google bilan bir klikda kiring. Parol eslab qolish shart emas.', color: 'var(--accent)' },
              { icon: '🌐', title: 'Public / Private', desc: 'Profilingizni ochin yoki yoping. Faqat siz tanlagan odamlar ko\'rsin.', color: 'var(--accent2)' },
              { icon: '✏️', title: 'Oson tahrirlash', desc: 'Loyiha, tajriba, ta\'lim, ko\'nikmalar — barchasi qulay dashboard orqali bir joyda boshqariladi.', color: 'var(--accent3)' },
            ].map((f) => (
              <div key={f.title} className="card" style={{ transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '26px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: f.color }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preview ── */}
      <section id="preview" style={{ padding: '100px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '12px' }}>NAMUNA</p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '12px' }}>
              Portfolio <span style={{ color: 'var(--accent)' }}>shunday ko'rinadi</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
              Real profil, real ma'lumotlar — aynan shunday chiqadi
            </p>
          </div>

          {/* Mock profile */}
          <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
            {/* Browser chrome */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '12px 12px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, background: 'var(--bg2)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)', textAlign: 'center' }}>
                devfolio.uz/u/asilbek.dev
              </div>
            </div>

            {/* Profile content */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border2)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '28px', overflow: 'hidden' }}>

              {/* Hero card */}
              <div className="card" style={{ marginBottom: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--accent2), var(--accent3))', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                    👨‍💻
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{MOCK.name}</h3>
                      <span className="tag tag-accent" style={{ fontSize: '10px' }}>🟢 Ish qidirmoqda</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '10px' }}>{MOCK.headline}</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} />{MOCK.location}</span>
                      <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={11} />GitHub</a>
                      <a href="#" style={{ fontSize: '12px', color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><Link2 size={11} />LinkedIn</a>
                      <a href="#" style={{ fontSize: '12px', color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><Send size={11} />Telegram</a>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.65 }}>{MOCK.bio}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="card" style={{ marginBottom: '16px', padding: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>⚡ Ko'nikmalar</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {MOCK.skills.map(s => (
                    <span key={s.name} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '7px', padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: LEVEL_DOT[s.level], flexShrink: 0 }} />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>🚀 Loyihalar</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {MOCK.projects.map(p => (
                    <div key={p.title} className="card" style={{ padding: '16px' }}>
                      {p.featured && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                          <Star size={10} style={{ color: '#f59e0b' }} />
                          <span style={{ fontSize: '10px', color: '#f59e0b' }}>Featured</span>
                        </div>
                      )}
                      <h5 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{p.title}</h5>
                      <p style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '10px' }}>{p.description.slice(0, 80)}...</p>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {p.techs.slice(0, 3).map(t => <span key={t} className="tag tag-purple" style={{ fontSize: '9px' }}>{t}</span>)}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a href="#" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}><GitBranch size={10} />GitHub</a>
                        {p.demo && <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}><ExternalLink size={10} />Demo</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: '-18px', right: '32px', background: 'var(--accent)', color: '#000', fontSize: '11px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', fontFamily: 'var(--mono)', boxShadow: '0 4px 20px rgba(0,255,136,0.4)' }}>
              Powered by DevFolio
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/register" className="btn-big" style={{ textDecoration: 'none' }}>
              Shunday portfolio yarating →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '100px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '12px' }}>QANDAY ISHLAYDI</p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>
              3 qadamda <span style={{ color: 'var(--accent)' }}>tayyor</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { step: '01', title: 'Ro\'yxatdan o\'ting', desc: 'GitHub yoki Google bilan 30 soniyada. Email tasdiqlash ham yo\'q.', icon: '🔐' },
              { step: '02', title: 'Ma\'lumot kiriting', desc: 'Loyihalar, ko\'nikmalar, tajriba — hammasini qulay dashboard orqali.', icon: '✏️' },
              { step: '03', title: 'Ulashing!', desc: 'devfolio.uz/u/siz URL ni nusxa oling va har joyga joylashtiring.', icon: '🚀' },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  {item.icon}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', marginBottom: '8px', letterSpacing: '1px' }}>{item.step}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bottom ── */}
      <section style={{ padding: '80px 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '64px 40px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
          <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '16px' }}>HOZIROQ BOSHLANG</p>
          <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '14px', lineHeight: 1.15 }}>
            Portfolio sizning<br /><span style={{ color: 'var(--accent)' }}>raqamli yuzingiz</span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '15px', marginBottom: '36px', lineHeight: 1.6 }}>
            Recruiterlar CV emas, portfolio qidiradi. 3 daqiqada tayyor bo'ling.
          </p>
          <Link href="/register" className="btn-big" style={{ textDecoration: 'none' }}>
            Bepul ro'yxatdan o'tish →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700 }}>
          Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
        </span>
        <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
          © 2026 DevFolio — IT mutaxassislari uchun portfolio platforma
        </p>
      </footer>
    </>
  );
}
