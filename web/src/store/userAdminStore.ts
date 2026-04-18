import { create } from 'zustand';
import { userApi, User } from '@/lib/api/user';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  fetchUsers: (filter?: any) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  updateUserStatus: (id: string, isActive: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserAdminStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  total: 0,

  fetchUsers: async (filter) => {
    set({ loading: true, error: null });
    try {
      const result = await userApi.getAll(filter);
      // Result is { data: users, total }
      const usersArray = result.data || [];
      const totalCount = result.total || usersArray.length;
      
      set({
        users: usersArray,
        total: totalCount,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch users', loading: false });
    }
  },



  updateUserRole: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      await userApi.updateRole(userId, role);
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update user role', loading: false });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await userApi.update(id, data);
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update user', loading: false });
      throw error;
    }
  },

  updateUserStatus: async (id, isActive) => {
    set({ loading: true, error: null });
    try {
      await userApi.updateStatus(id, isActive);
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update user status', loading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userApi.delete(id);
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete user', loading: false });
      throw error;
    }
  },
}));
