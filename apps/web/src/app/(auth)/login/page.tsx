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
  email: z.string().email({ message: 'Email noto\'g\'ri' }),
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
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.login(data);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      const me = await authApi.getMe();
      setAuth(me, res.accessToken);

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
                <Link href={"/forgot-password" as any} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
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
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '12px', marginBottom: '10px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
</svg>
            GitHub orqali kirish
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '12px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google orqali kirish
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