import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '512px',
          height: '512px',
          background: '#0a0a0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '96px',
          border: '3px solid rgba(0,255,136,0.25)',
        }}
      >
        <div
          style={{
            fontSize: '260px',
            fontWeight: 700,
            color: '#00ff88',
            fontFamily: 'monospace',
            lineHeight: 1,
            display: 'flex',
          }}
        >
          D
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
