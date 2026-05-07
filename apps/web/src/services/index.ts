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

export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  url?: string;
  fileUrl?: string;
  fileType?: string;
  order: number;
  createdAt: string;
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
  phone?: string;
  birthDate?: string;
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
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as Promise<any>;
  },
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

// ─── Certificates API ─────────────────────────────────────
export const certificatesApi = {
  getAll: () => api.get('/certificates') as Promise<any>,
  create: (data: {
    title: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    url?: string;
    file?: File;
  }) => {
    const form = new FormData();
    form.append('title', data.title);
    if (data.issuer) form.append('issuer', data.issuer);
    if (data.issueDate) form.append('issueDate', data.issueDate);
    if (data.expiryDate) form.append('expiryDate', data.expiryDate);
    if (data.url) form.append('url', data.url);
    if (data.file) form.append('file', data.file);
    return api.post('/certificates', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as Promise<any>;
  },
  update: (id: string, data: {
    title?: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    url?: string;
    file?: File;
  }) => {
    const form = new FormData();
    if (data.title) form.append('title', data.title);
    if (data.issuer) form.append('issuer', data.issuer);
    if (data.issueDate !== undefined) form.append('issueDate', data.issueDate);
    if (data.expiryDate !== undefined) form.append('expiryDate', data.expiryDate);
    if (data.url !== undefined) form.append('url', data.url);
    if (data.file) form.append('file', data.file);
    return api.put(`/certificates/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as Promise<any>;
  },
  delete: (id: string) => api.delete(`/certificates/${id}`) as Promise<any>,
};
