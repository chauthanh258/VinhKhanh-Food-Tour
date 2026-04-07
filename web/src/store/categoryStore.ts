import { create } from 'zustand';
import { categoryApi, Category } from '@/lib/api/category';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: (includeInactive?: boolean) => Promise<void>;
  createCategory: (data: {
    translations: Array<{ name: string; description?: string; language: string }>;
    isActive?: boolean;
  }) => Promise<void>;
  updateCategory: (
    id: string,
    data: {
      translations?: Array<{ name: string; description?: string; language: string }>;
      isActive?: boolean;
    }
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  restoreCategory: (id: string) => Promise<void>;
  getCategoryName: (categoryId?: string | null) => string;
  getCategoryOptions: () => Array<{ label: string; value: string }>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (includeInactive = false) => {
    set({ loading: true, error: null });
    try {
      const result = await categoryApi.getAll(includeInactive);
      const categoriesArray = Array.isArray(result) ? result : (result.categories || []);
      set({ categories: categoriesArray, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', loading: false });
    }
  },

  createCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      await categoryApi.create(data);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.message || 'Failed to create category', loading: false });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await categoryApi.update(id, data);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update category', loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await categoryApi.delete(id);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete category', loading: false });
      throw error;
    }
  },

  restoreCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await categoryApi.restore(id);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.message || 'Failed to restore category', loading: false });
      throw error;
    }
  },

  getCategoryName: (categoryId) => {
    if (!categoryId) return '';
    const category = get().categories.find((c) => c.id === categoryId);
    if (!category) return '';
    const translation = category.translations.find((t) => t.language === 'vi');
    return translation?.name || category.translations[0]?.name || '';
  },

  getCategoryOptions: () => {
    return get()
      .categories.filter((c) => c.isActive)
      .map((c) => {
        const translation = c.translations.find((t) => t.language === 'vi');
        return {
          label: translation?.name || c.translations[0]?.name || 'Unknown',
          value: c.id,
        };
      });
  },
}));
