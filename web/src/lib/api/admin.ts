import { api } from '@/lib/api';

export interface PendingPOIRequest {
  id: string;
  lat: number;
  lng: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  ownerId?: string;
  categoryId?: string;
  isActive: boolean;
  submittedAt: string;
  translations: Array<{ id: string; name: string; description?: string }>;
  owner?: { id: string; fullName?: string; email: string };
}

export interface PendingUserUpgrade {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  requestedRole: string;
  updatedAt: string;
}

export interface PendingRequestsResponse {
  pendingPOIs: number;
  pendingUsers: number;
  totalPending: number;
  details: {
    pois: PendingPOIRequest[];
    users: PendingUserUpgrade[];
  };
}

export const adminApi = {
  getPendingRequests: async () => {
    const response = await api.get('/moderation/admin/requests');
    return response.data;
  },

  requestUpgrade: async () => {
    const response = await api.post('/moderation/request-upgrade', {});
    return response.data;
  },

  approveRequest: async (id: string) => {
    const response = await api.post(`/moderation/admin/requests/${id}/approve`, {});
    return response.data;
  },

  rejectRequest: async (id: string) => {
    const response = await api.post(`/moderation/admin/requests/${id}/reject`, {});
    return response.data;
  },
};