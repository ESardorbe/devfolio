'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../services/auth.api';
import { Eye, EyeOff } from 'lucide-react';

const FP_STYLES = `
  @keyframes fpFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes otpShake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-7px); }
    40%     { transform: translateX(7px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  @keyframes otpPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes otpPulse {
    0%   { box-shadow: 0 0 0 0 rgba(0,255,136,0.35); }
    100% { box-shadow: 0 0 0 7px rgba(0,255,136,0); }
  }
  @keyframes successBounce {
    0%   { transform: scale(0); opacity: 0; }
    55%  { transform: scale(1.2); }
    75%  { transform: scale(0.92); }
    100% { transform: scale(1); opacity: 1; }
  }
  .fp-card { animation: fpFadeIn 0.45s ease both; }
  .fp-otp-box {
    width: 52px;
    height: 60px;
    text-align: center;
    font-size: 24px;
    font-family: var(--mono);
    font-weight: 700;
    border-radius: 12px;
    background: var(--bg2);
    border: 2px solid var(--border2);
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    caret-color: var(--accent);
  }
  .fp-otp-box:focus {
    border-color: var(--accent);
    background: var(--surface);
    animation: otpPulse 1s ease infinite;
  }
  .fp-otp-box.has-digit {
    border-color: rgba(0,255,136,0.45);
    animation: otpPop 0.18s ease;
  }
  .fp-otp-box.shake {
    animation: otpShake 0.4s ease;
    border-color: #ff6b6b !important;
  }
  .fp-success-icon {
    animation: successBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @media (max-width: 400px) {
    .fp-otp-box { width: 42px; height: 50px; font-size: 20px; border-radius: 9px; }
  }
`;

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [shaking, setShaking] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputs.current[0]?.focus(), 200);
    }
  }, [step]);

  const handleSendEmail = async () => {
    if (!email) { setError('Emailni kiriting'); return; }
    setLoading(true); setError('');
    try {
      await authApi.forgotPassword(email);
      setSuccess('Tasdiqlash kodi emailingizga yuborildi');
      setStep('otp');
    } catch (err: any) {
      const msg = err?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    setError('');
    const next = [...otpDigits];
    next[i] = val.slice(-1);
    setOtpDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((d) => d) && val) handleVerifyOtp(next.join(''));
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (!pasted.length) return;
    const next = [...pasted, '', '', '', '', ''].slice(0, 6) as string[];
    setOtpDigits(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    if (next.every((d) => d)) handleVerifyOtp(next.join(''));
  };

  const handleVerifyOtp = async (code?: string) => {
    const otp = code || otpDigits.join('');
    if (otp.length !== 6) return;
    setLoading(true); setError('');
    try {
      const res = await authApi.verifyResetOtp(email, otp);
      setResetToken(res.resetToken);
      setOtpSuccess(true);
      setTimeout(() => { setSuccess(''); setStep('reset'); }, 1200);
    } catch (err: any) {
      const msg = err?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Kod noto\'g\'ri yoki muddati o\'tgan');
      setShaking(true);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => { setShaking(false); inputs.current[0]?.focus(); }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) { setError('Parollar mos kelmaydi'); return; }
    if (newPassword.length < 6) { setError('Parol kamida 6 ta belgi bo\'lishi kerak'); return; }
    setLoading(true); setError('');
    try {
      await authApi.resetPassword(resetToken, newPassword);
      router.push('/login?reset=success');
    } catch (err: any) {
      const msg = err?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const STEPS: Step[] = ['email', 'otp', 'reset'];
  const stepIdx = STEPS.indexOf(step);

  const STEP_TITLES: Record<Step, string> = {
    email: 'Parolni tiklash',
    otp:   'Kodni tasdiqlash',
    reset: 'Yangi parol',
  };
  const STEP_DESCS: Record<Step, string> = {
    email: 'Emailingizni kiriting, kod yuboramiz',
    otp:   `${email} manziliga yuborilgan kodni kiriting`,
    reset: 'Yangi parolingizni o\'rnating',
  };

  return (
    <>
      <style>{FP_STYLES}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>

        {/* Glow */}
        <div style={{ position: 'fixed', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.svg" width="26" height="26" alt="logo" />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
                Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '8px' }}>{STEP_DESCS[step]}</p>
          </div>

          {/* Card */}
          <div
            className="fp-card"
            style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '22px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden' }}
          >
            {/* Top handle */}
            <div style={{ width: '32px', height: '4px', background: 'var(--border2)', borderRadius: '2px', margin: '0 auto 24px' }} />

            {/* Glow inside card */}
            <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Step progress */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= stepIdx ? 'var(--accent)' : 'var(--border2)', transition: 'background 0.4s' }} />
              ))}
            </div>

            <h1 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '20px' }}>{STEP_TITLES[step]}</h1>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#ff6b6b', marginBottom: '18px' }}>
                {error}
              </div>
            )}
            {/* Success notification */}
            {success && (
              <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--accent)', marginBottom: '18px' }}>
                ✓ {success}
              </div>
            )}

            {/* ── Step 1: Email ── */}
            {step === 'email' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                    autoFocus
                  />
                </div>
                <button onClick={handleSendEmail} className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', borderRadius: '11px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Yuborilmoqda...' : 'Kod yuborish →'}
                </button>
              </div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 'otp' && (
              <div>
                {otpSuccess ? (
                  /* Success state */
                  <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
                    <div className="fp-success-icon" style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>
                      ✓
                    </div>
                    <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '15px' }}>Tasdiqlandi!</p>
                    <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px' }}>Yangi parol sahifasiga o'tmoqda...</p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '18px', textAlign: 'center' }}>
                      6 ta raqamli kodni kiriting
                    </p>

                    {/* 6-box OTP */}
                    <div
                      style={{ display: 'flex', gap: '7px', justifyContent: 'center', marginBottom: '22px' }}
                      onPaste={handleOtpPaste}
                    >
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { inputs.current[i] = el; }}
                          className={`fp-otp-box${digit ? ' has-digit' : ''}${shaking ? ' shake' : ''}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          autoComplete="one-time-code"
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleVerifyOtp()}
                      className="btn-primary"
                      disabled={loading || otpDigits.some((d) => !d)}
                      style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', borderRadius: '11px', opacity: (loading || otpDigits.some((d) => !d)) ? 0.6 : 1 }}
                    >
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                          Tekshirilmoqda...
                        </span>
                      ) : 'Tasdiqlash →'}
                    </button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                    <button
                      onClick={() => { setError(''); setOtpDigits(['','','','','','']); handleSendEmail(); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '12px', cursor: 'pointer', width: '100%', textAlign: 'center', marginTop: '14px', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
                    >
                      Kodni qayta yuborish
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── Step 3: New password ── */}
            {step === 'reset' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Yangi parol</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type={showPwd ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Kamida 6 belgi"
                      style={{ paddingRight: '44px' }}
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>Parolni tasdiqlang</label>
                  <input
                    className="input"
                    type={showPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Takrorlang"
                    onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                  />
                </div>
                <button onClick={handleResetPassword} className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', borderRadius: '11px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Saqlanmoqda...' : 'Parolni o\'zgartirish →'}
                </button>
              </div>
            )}

            {/* Back link */}
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text2)', marginTop: '22px' }}>
              <Link href="/login" style={{ color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}
              >
                ← Kirishga qaytish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
