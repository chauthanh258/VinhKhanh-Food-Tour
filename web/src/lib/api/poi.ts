import { api } from '../api';

export interface POITranslation {
  id: string;
  name: string;
  description?: string;
  specialties?: string;
  priceRange?: string;
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
    ownerId?: string;
    isActive?: boolean;
    translations: Array<{
      name: string;
      description?: string;
      specialties?: string;
      priceRange?: string;
      language: string;
    }>;
  }) => {
    // Both Admin and Owner use the base /pois endpoint for creation
    // The backend handles moderation for Owners
    const response = await api.post('/pois', data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      lat?: number;
      lng?: number;
      categoryId?: string;
      ownerId?: string | null;
      isActive?: boolean;
      translations?: Array<{
        name?: string;
        description?: string;
        specialties?: string;
        priceRange?: string;
        language: string;
      }>;
    }
  ) => {
    // Both Admin and Owner use the base /pois/:id endpoint for updates
    const response = await api.put(`/pois/${id}`, data);
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

  getByOwner: async (ownerId: string) => {
    const response = await api.get(`/owners/${ownerId}/pois`);
    return response.data;
  },

  requestDelete: async (id: string) => {
    const response = await api.post(`/pois/${id}/request-delete`, {});
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};
