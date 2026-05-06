'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../services/auth.api';
import { Eye, EyeOff } from 'lucide-react';

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleVerifyOtp = async () => {
    if (!otp) { setError('Kodni kiriting'); return; }
    setLoading(true); setError('');
    try {
      const res = await authApi.verifyResetOtp(email, otp);
      setResetToken(res.resetToken);
      setSuccess('');
      setStep('reset');
    } catch (err: any) {
      const msg = err?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Kod noto\'g\'ri yoki muddati o\'tgan');
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

  const stepTitles: Record<Step, string> = {
    email: 'Parolni tiklash',
    otp: 'Kodni tasdiqlash',
    reset: 'Yangi parol o\'rnatish',
  };

  const stepDescs: Record<Step, string> = {
    email: 'Emailingizni kiriting, tasdiqlash kodi yuboramiz',
    otp: `${email} manziliga yuborilgan kodni kiriting`,
    reset: 'Yangi parolingizni kiriting',
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
      <div style={{
        position: 'fixed',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 700 }}>
              Dev<span style={{ color: 'var(--accent)' }}>Folio</span>
            </span>
          </Link>
          <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '8px' }}>
            {stepDescs[step]}
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {(['email', 'otp', 'reset'] as Step[]).map((s, i) => (
              <div key={s} style={{
                flex: 1, height: '3px', borderRadius: '2px',
                background: i <= (['email', 'otp', 'reset'] as Step[]).indexOf(step)
                  ? 'var(--accent)'
                  : 'var(--border2)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>
            {stepTitles[step]}
          </h1>

          {error && (
            <div style={{
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              color: '#ff6b6b',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'var(--accent)',
              marginBottom: '20px',
            }}>
              {success}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                />
              </div>
              <button
                onClick={handleSendEmail}
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Yuborilmoqda...' : 'Kod yuborish →'}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                  Tasdiqlash kodi
                </label>
                <input
                  className="input"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  style={{ fontFamily: 'var(--mono)', letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash →'}
              </button>
              <button
                onClick={() => { setError(''); handleSendEmail(); }}
                style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Kodni qayta yuborish
              </button>
            </div>
          )}

          {/* Step 3: New password */}
          {step === 'reset' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                  Yangi parol
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type={showPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                  Parolni tasdiqlang
                </label>
                <input
                  className="input"
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                />
              </div>
              <button
                onClick={handleResetPassword}
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Saqlanmoqda...' : 'Parolni o\'zgartirish →'}
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text2)', marginTop: '24px' }}>
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              ← Kirishga qaytish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
