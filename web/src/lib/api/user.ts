import { api } from '../api';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  skip?: number;
  take?: number;
  search?: string;
  role?: string;
}

export const userApi = {
  getAll: async (filter?: UserFilter) => {
    const params = new URLSearchParams();
    if (filter?.skip !== undefined) params.append('skip', filter.skip.toString());
    if (filter?.take !== undefined) params.append('take', filter.take.toString());
    if (filter?.search) params.append('search', filter.search);
    if (filter?.role && filter.role !== 'all') params.append('role', filter.role);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/admin/users${query}`);
    return response.data;
  },


  getById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateRole: async (userId: string, role: string) => {
    const response = await api.put('/admin/users/role', { userId, role });
    return response.data;
  },

  update: async (id: string, data: { fullName?: string; email?: string; role?: string; isActive?: boolean }) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};
