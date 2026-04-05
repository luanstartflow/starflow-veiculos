import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (tenantSlug: string, email: string, password: string) =>
    api.post(`/auth/${tenantSlug}/login`, { email, password }).then((r) => r.data),
  register: (data: { tenantName: string; tenantSlug: string; email: string; name: string; password: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
};

// ── Boards ────────────────────────────────────────────────────────────────────

export const boardsApi = {
  list: () => api.get('/boards').then((r) => r.data),
  get: (id: string) => api.get(`/boards/${id}`).then((r) => r.data),
  create: (name: string) => api.post('/boards', { name }).then((r) => r.data),
  addColumn: (boardId: string, data: { name: string; color?: string }) =>
    api.post(`/boards/${boardId}/columns`, data).then((r) => r.data),
  updateColumn: (boardId: string, columnId: string, data: { name?: string; position?: number; color?: string }) =>
    api.patch(`/boards/${boardId}/columns/${columnId}`, data).then((r) => r.data),
  removeColumn: (boardId: string, columnId: string) =>
    api.delete(`/boards/${boardId}/columns/${columnId}`).then((r) => r.data),
};

// ── Cards ─────────────────────────────────────────────────────────────────────

export const cardsApi = {
  list: (columnId?: string, chatwootConversationId?: number) =>
    api.get('/cards', { params: { columnId, chatwootConversationId } }).then((r) => r.data),
  get: (id: string) => api.get(`/cards/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post('/cards', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/cards/${id}`, data).then((r) => r.data),
  move: (id: string, columnId: string, position: number) =>
    api.patch(`/cards/${id}/move`, { columnId, position }).then((r) => r.data),
  remove: (id: string) => api.delete(`/cards/${id}`).then((r) => r.data),
};

// ── Contacts ──────────────────────────────────────────────────────────────────

export const contactsApi = {
  list: (search?: string) => api.get('/contacts', { params: { search } }).then((r) => r.data),
  get: (id: string) => api.get(`/contacts/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post('/contacts', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/contacts/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/contacts/${id}`).then((r) => r.data),
};

// ── Vehicles ──────────────────────────────────────────────────────────────────

export const vehiclesApi = {
  list: (status?: string, search?: string) =>
    api.get('/vehicles', { params: { status, search } }).then((r) => r.data),
  get: (id: string) => api.get(`/vehicles/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post('/vehicles', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/vehicles/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/vehicles/${id}`).then((r) => r.data),
};

// ── Contracts ─────────────────────────────────────────────────────────────────

export const contractsApi = {
  list: (cardId?: string) => api.get('/contracts', { params: { cardId } }).then((r) => r.data),
  get: (id: string) => api.get(`/contracts/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post('/contracts', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/contracts/${id}`, data).then((r) => r.data),
  pdfUrl: (id: string) => `/api/contracts/${id}/pdf`,
};

export const uploadsApi = {
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post<{ filename: string; url: string; mimetype: string; size: number }>(
      '/uploads',
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ).then((r) => r.data);
  },
};

// ── Tenant ────────────────────────────────────────────────────────────────────

export const tenantApi = {
  me: () => api.get('/tenant').then((r) => r.data),
  stats: () => api.get('/tenant/stats').then((r) => r.data),
};
