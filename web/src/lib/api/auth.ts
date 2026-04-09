import { api } from './api';

export const authApi = {
  requestOwnerUpgrade: async () => {
    const response = await api.post('/auth/request-owner-upgrade');
    return response.data;
  },
};