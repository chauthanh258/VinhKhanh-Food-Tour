import { api } from '../api';

export interface POITranslation {
  id: string;
  name: string;
  description?: string;
  specialties?: string;
  priceRange?: string;
  language: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface POIOwner {
  id: string;
  email: string;
  fullName?: string;
}

export interface POI {
  id: string;
  lat: number;
  lng: number;
  rating: number;
  ownerId?: string;
  categoryId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: POIOwner;
  translations: POITranslation[];
  category?: {
    id: string;
    translations: Array<{ name: string; language: string }>;
  };
}

export interface POIFilter {
  skip?: number;
  take?: number;
}

export const poiApi = {
  getAll: async (filter?: POIFilter) => {
    const params = new URLSearchParams();
    if (filter?.skip !== undefined) params.append('skip', filter.skip.toString());
    if (filter?.take !== undefined) params.append('take', filter.take.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/admin/pois${query}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/admin/pois/${id}`);
    return response.data;
  },

  create: async (data: {
    lat: number;
    lng: number;
    categoryId?: string;
    isActive?: boolean;
    translations: Array<{
      name: string;
      description?: string;
      specialties?: string;
      priceRange?: string;
      language: string;
      audioUrl?: string;
      imageUrl?: string;
    }>;
  }) => {
    const response = await api.post('/admin/pois', data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      lat?: number;
      lng?: number;
      categoryId?: string;
      isActive?: boolean;
      translations?: Array<{
        name: string;
        description?: string;
        specialties?: string;
        priceRange?: string;
        language: string;
        audioUrl?: string;
        imageUrl?: string;
      }>;
    }
  ) => {
    const response = await api.put(`/admin/pois/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/pois/${id}/status`, { isActive });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/admin/pois/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};
