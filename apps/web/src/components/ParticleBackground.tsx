'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const BLOB_STYLES = `
  .light-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.7s ease;
  }
  html[data-theme="light"] .light-blob { opacity: 1; }
  html[data-theme="light"] canvas.particle-bg { opacity: 0.35 !important; }

  .light-blob-1 {
    width: 560px; height: 560px;
    top: -140px; left: -100px;
    background: radial-gradient(circle, rgba(79,70,229,0.20) 0%, rgba(99,102,241,0.07) 45%, transparent 70%);
    animation: lb1 20s ease-in-out infinite alternate;
  }
  .light-blob-2 {
    width: 480px; height: 480px;
    bottom: -100px; right: -80px;
    background: radial-gradient(circle, rgba(16,185,129,0.16) 0%, rgba(5,150,105,0.05) 45%, transparent 70%);
    animation: lb2 24s ease-in-out infinite alternate;
  }
  .light-blob-3 {
    width: 400px; height: 400px;
    top: 32%; right: 4%;
    background: radial-gradient(circle, rgba(6,182,212,0.14) 0%, rgba(14,165,233,0.04) 45%, transparent 70%);
    animation: lb3 17s ease-in-out infinite alternate;
  }
  .light-blob-4 {
    width: 320px; height: 320px;
    top: 58%; left: 22%;
    background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(167,139,250,0.04) 45%, transparent 70%);
    animation: lb4 28s ease-in-out infinite alternate;
  }

  .dark-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.7s ease;
  }
  html:not([data-theme="light"]) .dark-blob { opacity: 1; }

  .dark-blob-1 {
    width: 600px; height: 600px;
    top: -180px; left: -120px;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(109,40,217,0.04) 50%, transparent 70%);
    animation: lb1 22s ease-in-out infinite alternate;
  }
  .dark-blob-2 {
    width: 500px; height: 500px;
    bottom: -120px; right: -100px;
    background: radial-gradient(circle, rgba(0,200,100,0.08) 0%, rgba(0,180,80,0.03) 50%, transparent 70%);
    animation: lb2 26s ease-in-out infinite alternate;
  }
  .dark-blob-3 {
    width: 380px; height: 380px;
    top: 40%; right: 8%;
    background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, rgba(14,165,233,0.02) 50%, transparent 70%);
    animation: lb3 19s ease-in-out infinite alternate;
  }

  @keyframes lb1 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(65px, 55px) scale(1.16); }
  }
  @keyframes lb2 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-55px, -65px) scale(0.87); }
  }
  @keyframes lb3 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-45px, 75px) scale(1.11); }
  }
  @keyframes lb4 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(50px, -45px) scale(1.09); }
  }
`;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 48;
    const MAX_DIST = 130;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.4 + 0.5,
        opacity: Math.random() * 0.45 + 0.15,
      });
    }

    let raf: number;

    const draw = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const ACCENT = isLight ? '99, 102, 241' : '0, 210, 110';
      const opacityScale = isLight ? 0.55 : 0.70;
      const lineAlpha = isLight ? 0.07 : 0.09;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, ${p.opacity * opacityScale})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * lineAlpha;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{BLOB_STYLES}</style>
      <div className="light-blob light-blob-1" />
      <div className="light-blob light-blob-2" />
      <div className="light-blob light-blob-3" />
      <div className="light-blob light-blob-4" />
      <div className="dark-blob dark-blob-1" />
      <div className="dark-blob dark-blob-2" />
      <div className="dark-blob dark-blob-3" />
      <canvas
        ref={canvasRef}
        className="particle-bg"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.45,
          transition: 'opacity 0.4s ease',
        }}
      />
    </>
  );
}
