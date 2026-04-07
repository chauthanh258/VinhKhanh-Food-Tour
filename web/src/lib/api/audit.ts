import { api } from '../api';

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  details?: string;
  createdAt: string;
  admin?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface AuditLogFilter {
  skip?: number;
  take?: number;
}

export const auditApi = {
  getAll: async (filter?: AuditLogFilter) => {
    const params = new URLSearchParams();
    if (filter?.skip !== undefined) params.append('skip', filter.skip.toString());
    if (filter?.take !== undefined) params.append('take', filter.take.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/admin/audit-logs${query}`);
    return response.data;
  },
};
