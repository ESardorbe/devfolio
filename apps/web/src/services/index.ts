import api from '@/src/lib/api';

// ─── Types ────────────────────────────────────────────────
export interface Skill {
  id: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  category?: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techs: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  order: number;
}

export interface UpdateProfileDto {
  name?: string;
  username?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  telegram?: string;
  twitter?: string;
  isPublic?: boolean;
  isOpenToWork?: boolean;
}

// ─── Users API ────────────────────────────────────────────
export const usersApi = {
  getMe: () => api.get('/users/me') as Promise<any>,
  getPublicProfile: (username: string) =>
    api.get(`/users/${username}`) as Promise<any>,
  updateProfile: (data: UpdateProfileDto) =>
    api.put('/users/me', data) as Promise<any>,
  getViews: () => api.get('/users/me/views') as Promise<any>,
};

// ─── Skills API ───────────────────────────────────────────
export const skillsApi = {
  getAll: () => api.get('/skills') as Promise<any>,
  create: (data: { name: string; level: string; category?: string }) =>
    api.post('/skills', data) as Promise<any>,
  update: (id: string, data: Partial<Skill>) =>
    api.put(`/skills/${id}`, data) as Promise<any>,
  delete: (id: string) => api.delete(`/skills/${id}`) as Promise<any>,
  reorder: (orderedIds: string[]) =>
    api.patch('/skills/reorder', { orderedIds }) as Promise<any>,
};

// ─── Projects API ─────────────────────────────────────────
export const projectsApi = {
  getAll: () => api.get('/projects') as Promise<any>,
  create: (data: any) => api.post('/projects', data) as Promise<any>,
  update: (id: string, data: any) =>
    api.put(`/projects/${id}`, data) as Promise<any>,
  delete: (id: string) => api.delete(`/projects/${id}`) as Promise<any>,
};

// ─── Experiences API ──────────────────────────────────────
export const experiencesApi = {
  getAll: () => api.get('/experiences') as Promise<any>,
  create: (data: any) => api.post('/experiences', data) as Promise<any>,
  update: (id: string, data: any) =>
    api.put(`/experiences/${id}`, data) as Promise<any>,
  delete: (id: string) => api.delete(`/experiences/${id}`) as Promise<any>,
};

// ─── Educations API ───────────────────────────────────────
export const educationsApi = {
  getAll: () => api.get('/educations') as Promise<any>,
  create: (data: any) => api.post('/educations', data) as Promise<any>,
  update: (id: string, data: any) =>
    api.put(`/educations/${id}`, data) as Promise<any>,
  delete: (id: string) => api.delete(`/educations/${id}`) as Promise<any>,
};