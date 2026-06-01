'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../../../services/auth.api';
import { useAuthStore } from '../../../store/auth.store';

const OTP_STYLES = `
  @keyframes otpFadeIn {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes successScale {
    0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
    60%  { transform: scale(1.18) rotate(4deg); }
    80%  { transform: scale(0.94) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes successGlow {
    0%   { box-shadow: 0 0 0 0 rgba(0,255,136,0.5); }
    70%  { box-shadow: 0 0 0 18px rgba(0,255,136,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,255,136,0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px); }
  }
  @keyframes digitPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.18); }
    100% { transform: scale(1); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(0,255,136,0.4); }
    100% { box-shadow: 0 0 0 8px rgba(0,255,136,0); }
  }
  .otp-card {
    animation: otpFadeIn 0.5s ease both;
  }
  .otp-input {
    width: 58px;
    height: 66px;
    text-align: center;
    font-size: 26px;
    font-family: var(--mono);
    font-weight: 700;
    border-radius: 14px;
    background: var(--bg2);
    border: 2px solid var(--border2);
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    caret-color: var(--accent);
  }
  .otp-input:focus {
    border-color: var(--accent);
    background: var(--surface);
    animation: pulse-ring 1s ease infinite;
  }
  .otp-input.filled {
    border-color: rgba(0,255,136,0.5);
    animation: digitPop 0.2s ease;
  }
  .otp-input.error {
    border-color: #ff6b6b !important;
    animation: shake 0.4s ease;
  }
  .success-icon {
    animation: successScale 0.5s cubic-bezier(0.34,1.56,0.64,1) both, successGlow 0.8s ease 0.3s;
  }
  .otp-resend-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 3px;
    transition: opacity 0.2s;
  }
  .otp-resend-btn:hover { opacity: 0.8; }
  @media (max-width: 480px) {
    .otp-input { width: 46px; height: 54px; font-size: 22px; border-radius: 10px; }
  }
`;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { setAuth } = useAuthStore();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [hasError, setHasError] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setTimeout(() => inputs.current[0]?.focus(), 300);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    setError('');
    setHasError(false);
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((c) => c) && val) handleVerify(next.join(''));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (pasted.length === 0) return;
    const next = [...pasted, '', '', '', '', ''].slice(0, 6) as string[];
    setCode(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputs.current[lastFilled]?.focus();
    if (next.every((c) => c)) handleVerify(next.join(''));
  };

  const handleVerify = async (fullCode?: string) => {
    const otp = fullCode || code.join('');
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.verifyEmail(email, otp);
      localStorage.setItem('refreshToken', res.refreshToken);
      const me = await authApi.getMe();
      setAuth(me.data, res.accessToken);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1600);
    } catch (err: any) {
      const msg = err?.message?.[0] || err?.message || 'Kod noto\'g\'ri';
      setError(msg);
      setHasError(true);
      setCode(['', '', '', '', '', '']);
      setTimeout(() => { setHasError(false); inputs.current[0]?.focus(); }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendOtp(email);
      setResendTimer(60);
      setError('');
      setCode(['', '', '', '', '', '']);
      setTimeout(() => inputs.current[0]?.focus(), 100);
    } catch {
      setError('Qayta yuborishda xato');
    }
  };

  return (
    <>
      <style>{OTP_STYLES}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.svg" width="28" height="28" alt="logo" />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
                Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div
            className="otp-card"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border2)',
              borderRadius: '24px',
              padding: '36px 32px 32px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            }}
          >
            {/* Top handle bar */}
            <div style={{ width: '36px', height: '4px', background: 'var(--border2)', borderRadius: '2px', margin: '0 auto 28px' }} />

            {/* Glow */}
            <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {success ? (
              /* ── Success state ── */
              <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
                <div
                  className="success-icon"
                  style={{
                    width: '72px', height: '72px', borderRadius: '18px',
                    background: 'rgba(0,255,136,0.1)',
                    border: '2px solid var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '32px',
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
                  Tasdiqlandi!
                </h2>
                <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.6 }}>
                  Email muvaffaqiyatli tasdiqlandi.<br />Dashboard ga yo'naltirilmoqda...
                </p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: `pulse-ring 1s ${i * 0.2}s ease infinite` }} />
                  ))}
                </div>
              </div>
            ) : (
              /* ── Input state ── */
              <>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                    Emailni tasdiqlang
                  </h1>
                  <p style={{ color: 'var(--text2)', fontSize: '13px', lineHeight: 1.65 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{email}</span> manziliga<br />
                    6 raqamli kod yuborildi
                  </p>
                </div>

                {/* OTP Inputs */}
                <div
                  style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}
                  onPaste={handlePaste}
                >
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputs.current[i] = el; }}
                      className={`otp-input ${digit ? 'filled' : ''} ${hasError ? 'error' : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#ff6b6b', textAlign: 'center', marginBottom: '20px' }}>
                    {error}
                  </div>
                )}

                {/* Verify button */}
                <button
                  onClick={() => handleVerify()}
                  className="btn-primary"
                  disabled={isLoading || code.some((c) => !c)}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', borderRadius: '12px', opacity: (isLoading || code.some((c) => !c)) ? 0.6 : 1, transition: 'all 0.2s' }}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                      Tekshirilmoqda...
                    </span>
                  ) : 'Tasdiqlash →'}
                </button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                {/* Resend */}
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text2)' }}>
                  Kod kelmadimi?{' '}
                  {resendTimer > 0 ? (
                    <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                      {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:{String(resendTimer % 60).padStart(2, '0')}
                    </span>
                  ) : (
                    <button onClick={handleResend} className="otp-resend-btn">Qayta yuborish</button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/login" style={{ color: 'var(--text3)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}
            >
              ← Kirish sahifasiga qaytish
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(0,255,136,0.2)', borderTop: '3px solid #00ff88', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
