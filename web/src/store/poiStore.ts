import { create } from 'zustand';
import { poiApi, POI } from '@/lib/api/poi';
import { api } from '@/lib/api';

interface POIState {
  pois: POI[];
  loading: boolean;
  error: string | null;
  total: number;
  fetchPOIs: (filter?: { skip?: number; take?: number }) => Promise<void>;
  createPOI: (data: any) => Promise<void>;
  updatePOI: (id: string, data: any) => Promise<void>;
  uploadPOIMedia: (id: string, data: FormData) => Promise<void>;
  updatePOIStatus: (id: string, isActive: boolean) => Promise<void>;
  deletePOI: (id: string) => Promise<void>;
  getPOIName: (poi: POI) => string;
}

export const usePOIStore = create<POIState>((set, get) => ({
  pois: [],
  loading: false,
  error: null,
  total: 0,

  fetchPOIs: async (filter) => {
    set({ loading: true, error: null });
    try {
      const result = await poiApi.getAll(filter);
      const poisArray = Array.isArray(result) ? result : (result.pois || []);
      set({
        pois: poisArray,
        total: poisArray.length,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch POIs', loading: false });
    }
  },

  createPOI: async (data) => {
    set({ loading: true, error: null });
    try {
      await poiApi.create(data);
      await get().fetchPOIs();
    } catch (error: any) {
      set({ error: error.message || 'Failed to create POI', loading: false });
      throw error;
    }
  },

  updatePOI: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await poiApi.update(id, data);
      await get().fetchPOIs();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update POI', loading: false });
      throw error;
    }
  },

  uploadPOIMedia: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/pois/${id}/media`, data);
      await get().fetchPOIs();
    } catch (error: any) {
      set({ error: error.message || 'Failed to upload POI media', loading: false });
      throw error;
    }
  },

  updatePOIStatus: async (id, isActive) => {
    set({ loading: true, error: null });
    try {
      await poiApi.updateStatus(id, isActive);
      await get().fetchPOIs();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update POI', loading: false });
      throw error;
    }
  },

  deletePOI: async (id) => {
    set({ loading: true, error: null });
    try {
      await poiApi.delete(id);
      await get().fetchPOIs();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete POI', loading: false });
      throw error;
    }
  },

  getPOIName: (poi) => {
    const viTranslation = poi.translations?.find((t) => t.language === 'vi');
    return viTranslation?.name || poi.translations?.[0]?.name || 'Unknown';
  },
}));
