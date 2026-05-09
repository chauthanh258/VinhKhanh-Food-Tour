'use client';

import { api } from '@/lib/api';
import { getAnalyticsSessionId } from '../session';

export interface TopPoi {
  poi_id: string;
  poi_name: string;
  visit_count: number;
}

export interface AvgListenTime {
  poi_id: string | null;
  avg_duration_seconds: number;
}

export interface OnlineUsers {
  online_count: number;
}

export const analyticsApi = {
  /**
   * Report current location (Heartbeat).
   */
  reportLocation: async (lat: number, lng: number) => {
    try {
      const sessionId = getAnalyticsSessionId();
      await api.post('/analytics/location', { sessionId, lat, lng });
    } catch (err) {
      // Silent fail
    }
  },

  /**
   * Report a listen event (Play count).
   */
  reportListen: async (poiId: string, durationSeconds: number = 0) => {
    try {
      const sessionId = getAnalyticsSessionId();
      await api.post('/analytics/listen', { sessionId, poiId, durationSeconds });
    } catch (err) {
      console.error('[Analytics] Failed to report listen event:', err);
    }
  },

  /**
   * Get online users count.
   */
  getOnlineUsers: async () => {
    const res = await api.get('/analytics/online-users');
    return res.data as OnlineUsers; // Expected { online_count: number }
  },

  /**
   * Get top-listened POIs.
   */
  getTopPois: async (limit: number = 5) => {
    const res = await api.get(`/analytics/top-pois?limit=${limit}`);
    return res.data as TopPoi[];
  },

  /**
   * Get average listen duration.
   */
  getAvgListenTime: async (poiId?: string) => {
    const res = await api.get(`/analytics/avg-listen-time${poiId ? `?poi_id=${poiId}` : ''}`);
    return res.data; // data contains { poi_id, avg_duration_seconds }
  },

  /**
   * Get QR scan statistics.
   */
  getQrStats: async () => {
    const res = await api.get('/analytics/qr-stats');
    return res.data; // data contains { totalScans, bySource, byPoi }
  },
  
  /**
   * Report a QR scan event.
   */
  reportQrScan: async (poiId: string, source: 'app' | 'external' = 'app') => {
    try {
      const sessionId = getAnalyticsSessionId();
      await api.post('/analytics/qr-scan', { sessionId, poiId, source });
    } catch (err) {
      console.error('[Analytics] Failed to report QR scan event:', err);
    }
  }
};
