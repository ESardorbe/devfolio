'use client';

import { useState, createElement } from 'react';
import { X, Download, FileText, File } from 'lucide-react';
import type { ExportProfile } from '@/src/lib/export/pdf-templates';

type Template = 'classic' | 'modern' | 'minimal';
type Format = 'pdf' | 'docx';

const TEMPLATES: { id: Template; name: string; desc: string; preview: React.ReactNode }[] = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Professional, ikki ustunli',
    preview: (
      <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 4, overflow: 'hidden', fontFamily: 'sans-serif' }}>
        {/* header */}
        <div style={{ background: '#1e3a5f', padding: '6px 8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', height: 6, borderRadius: 2, width: '70%', marginBottom: 3 }} />
          <div style={{ background: 'rgba(147,197,253,0.8)', height: 3, borderRadius: 2, width: '50%', marginBottom: 4 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[40, 55, 45].map((w, i) => (
              <div key={i} style={{ background: 'rgba(203,213,225,0.6)', height: 2, borderRadius: 1, width: `${w}%` }} />
            ))}
          </div>
        </div>
        {/* body */}
        <div style={{ display: 'flex', flex: 1, height: 'calc(100% - 42px)' }}>
          <div style={{ width: '38%', background: '#f8fafc', padding: '5px 4px', borderRight: '1px solid #e2e8f0' }}>
            <div style={{ background: '#bfdbfe', height: 2, borderRadius: 1, marginBottom: 4 }} />
            {[70, 60, 80, 55, 75].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 2.5 }}>
                <div style={{ flex: 1, background: '#e2e8f0', height: 2, borderRadius: 1 }} />
                <div style={{ display: 'flex', gap: 1, marginLeft: 3 }}>
                  {[0,1,2,3].map(d => (
                    <div key={d} style={{ width: 3, height: 3, borderRadius: '50%', background: d < (i % 3 + 2) ? '#2563eb' : '#e2e8f0' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '5px 6px' }}>
            <div style={{ background: '#bfdbfe', height: 2, borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3].map(i => (
              <div key={i} style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5 }}>
                  <div style={{ background: '#1e40af', height: 2.5, borderRadius: 1, width: '45%' }} />
                  <div style={{ background: '#e2e8f0', height: 2, borderRadius: 1, width: '25%' }} />
                </div>
                {[90, 70, 60].map((w, j) => (
                  <div key={j} style={{ background: '#e2e8f0', height: 1.5, borderRadius: 1, width: `${w}%`, marginBottom: 1.5 }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    name: 'Modern Dark',
    desc: 'Developer uslubi, qorong\'i',
    preview: (
      <div style={{ width: '100%', height: '100%', background: '#0d1117', borderRadius: 4, overflow: 'hidden' }}>
        {/* header */}
        <div style={{ background: '#161b22', padding: '6px 8px', borderBottom: '1.5px solid #00ff88' }}>
          <div style={{ background: 'rgba(255,255,255,0.85)', height: 6, borderRadius: 2, width: '65%', marginBottom: 3 }} />
          <div style={{ background: 'rgba(0,255,136,0.7)', height: 3, borderRadius: 2, width: '45%', marginBottom: 4 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[35, 48, 38].map((w, i) => (
              <div key={i} style={{ background: 'rgba(125,133,144,0.5)', height: 2, borderRadius: 1, width: `${w}%` }} />
            ))}
          </div>
        </div>
        {/* body */}
        <div style={{ display: 'flex', height: 'calc(100% - 42px)' }}>
          <div style={{ width: '34%', background: '#161b22', padding: '5px 4px', borderRight: '1px solid #21262d' }}>
            <div style={{ background: 'rgba(0,255,136,0.4)', height: 1.5, marginBottom: 4 }} />
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: '#00ff88', marginRight: 4 }} />
                <div style={{ flex: 1, background: '#21262d', height: 2, borderRadius: 1 }} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '5px 6px' }}>
            <div style={{ background: 'rgba(0,255,136,0.4)', height: 1.5, marginBottom: 4 }} />
            {[1,2].map(i => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ background: 'rgba(0,255,136,0.7)', height: 2.5, borderRadius: 1, width: '55%', marginBottom: 1.5 }} />
                <div style={{ background: 'rgba(230,237,243,0.7)', height: 2, borderRadius: 1, width: '70%', marginBottom: 1.5 }} />
                {[85, 65, 75].map((w, j) => (
                  <div key={j} style={{ background: '#21262d', height: 1.5, borderRadius: 1, width: `${w}%`, marginBottom: 1.5 }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Toza, oddiy, zamonaviy',
    preview: (
      <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 4, padding: '8px 10px', overflow: 'hidden' }}>
        <div style={{ background: '#111827', height: 7, borderRadius: 2, width: '55%', marginBottom: 3 }} />
        <div style={{ background: '#9ca3af', height: 3, borderRadius: 2, width: '45%', marginBottom: 6 }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {[30, 38, 26].map((w, i) => (
            <div key={i} style={{ background: '#e5e7eb', height: 2, borderRadius: 1, width: `${w}%` }} />
          ))}
        </div>
        <div style={{ height: 0.5, background: '#e5e7eb', marginBottom: 8 }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ width: 2, height: 10, background: '#00ff88', borderRadius: 1, marginRight: 5 }} />
              <div style={{ background: '#111827', height: 3, borderRadius: 1, width: '35%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5 }}>
              <div style={{ background: '#374151', height: 2, borderRadius: 1, width: '45%' }} />
              <div style={{ background: '#9ca3af', height: 1.5, borderRadius: 1, width: '22%' }} />
            </div>
            {[80, 65].map((w, j) => (
              <div key={j} style={{ background: '#e5e7eb', height: 1.5, borderRadius: 1, width: `${w}%`, marginBottom: 1.5 }} />
            ))}
          </div>
        ))}
      </div>
    ),
  },
];

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ExportProfile;
}

export function ExportModal({ isOpen, onClose, profile }: ExportModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('classic');
  const [format, setFormat] = useState<Format>('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toBase64 = (url: string): Promise<string> =>
    fetch(url)
      .then(r => r.blob())
      .then(b => new Promise(res => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.readAsDataURL(b);
      }));

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      let avatarBase64: string | undefined;
      if (profile.avatarUrl) {
        try { avatarBase64 = await toBase64(profile.avatarUrl); } catch { /* ignore */ }
      }
      const profileWithAvatar = { ...profile, avatarUrl: avatarBase64 };

      if (format === 'pdf') {
        const [{ pdf }, templates] = await Promise.all([
          import('@react-pdf/renderer'),
          import('@/src/lib/export/pdf-templates'),
        ]);
        const map = {
          classic: templates.ClassicTemplate,
          modern: templates.ModernTemplate,
          minimal: templates.MinimalTemplate,
        };
        const TemplateComp = map[selectedTemplate];
        const el = createElement(TemplateComp, { profile: profileWithAvatar }) as any;
        const blob = await pdf(el).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.username}-portfolio-${selectedTemplate}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const { downloadDocx } = await import('@/src/lib/export/docx-export');
        await downloadDocx(profileWithAvatar);
      }
    } catch (e) {
      console.error(e);
      setError('Yuklab olishda xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

      {/* Modal */}
      <div
        style={{ position: 'relative', width: '100%', maxWidth: '600px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '16px', padding: '28px', zIndex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Portfolio yuklab olish</h2>
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>Format va dizayn tanlang</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Format tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {([
            { id: 'pdf', label: 'PDF', icon: FileText },
            { id: 'docx', label: 'DOCX (Word)', icon: File },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFormat(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
                background: format === id ? 'var(--accent)' : 'var(--surface2)',
                color: format === id ? '#000' : 'var(--text2)',
                border: `1px solid ${format === id ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Template selection (only for PDF) */}
        {format === 'pdf' && (
          <>
            <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px', fontWeight: 500 }}>Shablon tanlang:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                    outline: 'none',
                  }}
                >
                  <div style={{
                    border: `2px solid ${selectedTemplate === t.id ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '10px', overflow: 'hidden',
                    transition: 'all 0.15s',
                    boxShadow: selectedTemplate === t.id ? '0 0 0 3px rgba(0,255,136,0.15)' : 'none',
                  }}>
                    {/* Preview */}
                    <div style={{ height: '110px', overflow: 'hidden' }}>
                      {t.preview}
                    </div>
                    {/* Label */}
                    <div style={{
                      padding: '8px 10px',
                      background: selectedTemplate === t.id ? 'rgba(0,255,136,0.08)' : 'var(--surface2)',
                      borderTop: `1px solid ${selectedTemplate === t.id ? 'rgba(0,255,136,0.2)' : 'var(--border)'}`,
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: selectedTemplate === t.id ? 'var(--accent)' : 'var(--text)', marginBottom: '1px' }}>{t.name}</p>
                      <p style={{ fontSize: '10px', color: 'var(--text3)' }}>{t.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {format === 'docx' && (
          <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <File size={28} style={{ color: '#2563eb', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Microsoft Word (.docx)</p>
              <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
                Professional CV formati — Word, Google Docs yoki LibreOffice da tahrirlash mumkin
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#ef4444', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost" style={{ fontSize: '13px' }}>
            Bekor
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="btn-primary"
            style={{ fontSize: '13px', minWidth: '160px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Tayyorlanmoqda...
              </>
            ) : (
              <><Download size={14} /> {format.toUpperCase()} yuklab olish</>
            )}
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
