import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DevFolio — IT Mutaxassislari Uchun Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            background:
              'radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 65%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
          }}
        />

        {/* Logo wordmark */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 700,
            letterSpacing: '-3px',
            display: 'flex',
            marginBottom: '24px',
          }}
        >
          <span style={{ color: '#f0f0f8' }}>Dev</span>
          <span style={{ color: '#00ff88' }}>Folio</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            color: '#9090a8',
            letterSpacing: '2px',
            fontWeight: 400,
            marginBottom: '40px',
            fontFamily: 'monospace',
          }}
        >
          IT MUTAXASSISLARI UCHUN PORTFOLIO
        </div>

        {/* URL badge */}
        <div
          style={{
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: '100px',
            padding: '10px 32px',
            fontSize: '18px',
            color: '#00ff88',
            fontFamily: 'monospace',
          }}
        >
          devfolio.uz
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
