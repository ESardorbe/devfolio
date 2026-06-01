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
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.7s ease;
  }
  html[data-theme="light"] .light-blob { opacity: 1; }
  html[data-theme="light"] canvas.particle-bg { opacity: 0.60 !important; }

  .light-blob-1 {
    width: 580px; height: 580px;
    top: -160px; left: -110px;
    background: radial-gradient(circle, rgba(79,70,229,0.38) 0%, rgba(99,102,241,0.12) 45%, transparent 70%);
    animation: lb1 20s ease-in-out infinite alternate;
  }
  .light-blob-2 {
    width: 500px; height: 500px;
    bottom: -110px; right: -90px;
    background: radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(5,150,105,0.10) 45%, transparent 70%);
    animation: lb2 24s ease-in-out infinite alternate;
  }
  .light-blob-3 {
    width: 420px; height: 420px;
    top: 32%; right: 4%;
    background: radial-gradient(circle, rgba(6,182,212,0.26) 0%, rgba(14,165,233,0.08) 45%, transparent 70%);
    animation: lb3 17s ease-in-out infinite alternate;
  }
  .light-blob-4 {
    width: 340px; height: 340px;
    top: 58%; left: 22%;
    background: radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(167,139,250,0.07) 45%, transparent 70%);
    animation: lb4 28s ease-in-out infinite alternate;
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

    const COUNT = 70;
    const MAX_DIST = 140;

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
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let raf: number;

    const draw = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const ACCENT = isLight ? '79, 70, 229' : '0, 255, 136';
      const opacityScale = isLight ? 0.9 : 1.0;
      const lineAlpha = isLight ? 0.09 : 0.12;

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
            ctx.lineWidth = 0.8;
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
      <canvas
        ref={canvasRef}
        className="particle-bg"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.7,
          transition: 'opacity 0.4s ease',
        }}
      />
    </>
  );
}
