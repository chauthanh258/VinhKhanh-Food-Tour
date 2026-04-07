export interface SystemSettings {
  geofenceRadius: number;
  minPoiDistance: number;
  debounceTime: number;
  ttsSpeed: number;
  viVoice: string;
  enVoice: string;
  language: string;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  geofenceRadius: 150,
  minPoiDistance: 50,
  debounceTime: 3,
  ttsSpeed: 1.0,
  viVoice: 'f1',
  enVoice: 'm1',
  language: 'vi'
};

const SETTINGS_KEY = 'system_settings';

export const settingsApi = {
  get: (): SystemSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  },

  save: (settings: SystemSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  reset: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SETTINGS_KEY);
  },
};
