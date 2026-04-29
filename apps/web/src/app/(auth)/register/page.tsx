'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../../services/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { Eye, EyeOff} from 'lucide-react';

const schema = z.object({
  email: z.string().email('Email noto\'g\'ri'),
  password: z.string().min(1, 'Parolni kiriting'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.login(data);
      localStorage.setItem('refreshToken', res.refreshToken);

      // Me ni olamiz
      const me = await authApi.getMe();
      setAuth(me.data, res.accessToken);

      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Email yoki parol noto\'g\'ri');
    } finally {
      setIsLoading(false);
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
            Portfoliongizga kiring
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
            Tizimga kirish
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

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input {...register('email')} type="email" className="input" placeholder="john@example.com" />
              {errors.email && <p style={{ fontSize: '12px', color: '#ff6b6b', marginTop: '4px' }}>{errors.email.message}</p>}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text2)' }}>Parol</label>
                <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
                  Parolni unutdingizmi?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  style={{ paddingRight: '44px' }}
                  placeholder="Parolingiz"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '12px', color: '#ff6b6b', marginTop: '4px' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '8px', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Yuklanmoqda...' : 'Kirish →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>yoki</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '12px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
</svg>
            GitHub orqali kirish
          </a>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text2)', marginTop: '24px' }}>
            Hisobingiz yo'qmi?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}