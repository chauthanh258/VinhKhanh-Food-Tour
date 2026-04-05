import { api } from '../api';

export interface CategoryTranslation {
  id: string;
  name: string;
  description?: string;
  language: string;
}

export interface Category {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations: CategoryTranslation[];
  _count?: {
    pois: number;
  };
}

export const categoryApi = {
  getAll: async (includeInactive = false) => {
    const response = await api.get(`/admin/categories?includeInactive=${includeInactive}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },

  create: async (data: {
    isActive?: boolean;
    translations: Array<{
      name: string;
      description?: string;
      language: string;
    }>;
  }) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      isActive?: boolean;
      translations?: Array<{
        name: string;
        description?: string;
        language: string;
      }>;
    }
  ) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.post(`/admin/categories/${id}/restore`, {});
    return response.data;
  },
};
