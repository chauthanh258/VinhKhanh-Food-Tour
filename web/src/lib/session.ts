'use client';

const SESSION_KEY = 'vk_analytics_session_id';

/**
 * Get or create a persistent anonymous session ID.
 */
export const getAnalyticsSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};
