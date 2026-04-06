import { create } from 'zustand';
import { auditApi, AuditLog } from '@/lib/api/audit';

interface AuditState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  total: number;
  lastFetchTime: number;
  fetchLogs: (filter?: { skip?: number; take?: number; force?: boolean }) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  total: 0,
  lastFetchTime: 0,

  fetchLogs: async (filter = {}) => {
    const { force = false } = filter;
    const now = Date.now();
    const timeSinceLastFetch = now - get().lastFetchTime;
    
    if (!force && timeSinceLastFetch < 5000 && get().logs.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const result = await auditApi.getAll({
        skip: filter.skip,
        take: filter.take,
      });
      
      // Handle response: { logs, total } format
      let logsArray: AuditLog[] = [];
      let totalCount = 0;
      
      if (Array.isArray(result)) {
        logsArray = result;
        totalCount = result.length;
      } else if (result && result.logs && Array.isArray(result.logs)) {
        logsArray = result.logs;
        totalCount = result.total || result.logs.length;
      }
      
      set({
        logs: logsArray,
        total: totalCount,
        loading: false,
        lastFetchTime: now,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch audit logs', loading: false });
    }
  },
}));
