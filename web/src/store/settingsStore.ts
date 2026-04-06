import { create } from 'zustand';
import { settingsApi, DEFAULT_SETTINGS, SystemSettings } from '@/lib/api/settings';

interface SettingsState {
  settings: SystemSettings;
  isLoaded: boolean;
  loadSettings: () => void;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  loadSettings: () => {
    const settings = settingsApi.get();
    set({ settings, isLoaded: true });
  },

  updateSetting: (key, value) => {
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    }));
    settingsApi.save(get().settings);
  },

  saveSettings: () => {
    settingsApi.save(get().settings);
  },

  resetSettings: () => {
    settingsApi.reset();
    set({ settings: DEFAULT_SETTINGS });
  },
}));
