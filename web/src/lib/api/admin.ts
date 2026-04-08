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
    const response = await api.get('/admin/pending-requests');
    return response.data as PendingRequestsResponse;
  },

  approvePOI: async (id: string) => {
    const response = await api.patch(`/admin/pois/${id}/approve`, { status: 'APPROVED' });
    return response.data;
  },

  rejectPOI: async (id: string) => {
    const response = await api.patch(`/admin/pois/${id}/approve`, { status: 'REJECTED' });
    return response.data;
  },

  approveUserUpgrade: async (id: string) => {
    const response = await api.post(`/admin/requests/user/${id}/approve`, {});
    return response.data;
  },

  rejectUserUpgrade: async (id: string, rejectionReason: string) => {
    const response = await api.post(`/admin/requests/user/${id}/reject`, { rejectionReason });
    return response.data;
  },
};