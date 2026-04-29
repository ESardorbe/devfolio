import api from '@/src/lib/api';

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = {
  register: (dto: RegisterDto) =>
    api.post('/auth/register', dto) as Promise<{ message: string; email: string }>,

  verifyEmail: (email: string, code: string) =>
    api.post('/auth/verify-email', { email, code }) as Promise<{
      accessToken: string;
      refreshToken: string;
    }>,

  resendOtp: (email: string) =>
    api.post('/auth/resend-otp', { email }) as Promise<{ message: string }>,

  login: (dto: LoginDto) =>
    api.post('/auth/login', dto) as Promise<{
      accessToken: string;
      refreshToken: string;
    }>,

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }) as Promise<{ message: string }>,

  verifyResetOtp: (email: string, code: string) =>
    api.post('/auth/verify-reset-otp', { email, code }) as Promise<{ resetToken: string }>,

  resetPassword: (resetToken: string, newPassword: string) =>
    api.post('/auth/reset-password', { resetToken, newPassword }) as Promise<{ message: string }>,

  getMe: () => api.get('/auth/me') as Promise<any>,
};