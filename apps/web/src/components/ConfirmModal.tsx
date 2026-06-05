'use client';

import { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CM_STYLES = `
  @keyframes cm-in {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "O'chirish",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      <style>{CM_STYLES}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      >
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border2)',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '380px',
            animation: 'cm-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,107,107,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={18} style={{ color: '#ff6b6b' }} />
            </div>
            <button
              onClick={onCancel}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: message ? '8px' : '24px' }}>{title}</h3>
          {message && (
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '24px' }}>{message}</p>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                border: '1px solid var(--border2)', background: 'transparent',
                cursor: 'pointer', color: 'var(--text2)', fontSize: '14px',
                fontFamily: 'var(--sans)',
              }}
            >
              Bekor qilish
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                background: 'rgba(255,107,107,0.12)',
                border: '1px solid rgba(255,107,107,0.4)',
                cursor: 'pointer', color: '#ff6b6b',
                fontSize: '14px', fontWeight: 600,
                fontFamily: 'var(--sans)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              <Trash2 size={13} />
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
