'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../../../services/auth.api';
import { useAuthStore } from '../../../store/auth.store';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { setAuth } = useAuthStore();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    // Avtomatik submit
    if (next.every((c) => c) && val) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasted.every((c) => /\d/.test(c))) {
      const next = [...pasted, '', '', '', '', ''].slice(0, 6) as string[];
      setCode(next);
      inputs.current[5]?.focus();
      if (next.every((c) => c)) handleVerify(next.join(''));
    }
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
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message?.[0] || err?.message || 'Kod noto\'g\'ri');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendOtp(email);
      setResendTimer(60);
      setError('');
    } catch {
      setError('Qayta yuborishda xato');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 700 }}>
            Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
          </span>
        </Link>

        <div className="card" style={{ padding: '40px 32px', marginTop: '32px' }}>
          {/* Icon */}
          <div style={{
            width: '64px', height: '64px',
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '28px',
          }}>
            📧
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Emailni tasdiqlang
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
            <span style={{ color: 'var(--accent)' }}>{email}</span> manziliga
            6 raqamli kod yuborildi
          </p>

          {error && (
            <div style={{
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              color: '#ff6b6b',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* OTP inputs */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: '52px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  background: 'var(--bg2)',
                  border: `1px solid ${digit ? 'var(--accent)' : 'var(--border2)'}`,
                  borderRadius: '10px',
                  color: 'var(--text)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            className="btn-primary"
            disabled={isLoading || code.some((c) => !c)}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash →'}
          </button>

          <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text2)' }}>
            Kod kelmadimi?{' '}
            {resendTimer > 0 ? (
              <span style={{ color: 'var(--text3)' }}>{resendTimer}s kutib turing</span>
            ) : (
              <button
                onClick={handleResend}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px' }}
              >
                Qayta yuborish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yuklanmoqda...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}