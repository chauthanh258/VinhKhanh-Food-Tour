'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, History, Upload, RefreshCw, Save } from 'lucide-react';
import { Card, Button, Input, Select } from '../../components/shared-components';

interface SystemSettings {
  geofenceRadius: number;
  minPoiDistance: number;
  debounceTime: number;
  ttsSpeed: number;
  viVoice: string;
  enVoice: string;
  language: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  geofenceRadius: 150,
  minPoiDistance: 50,
  debounceTime: 3,
  ttsSpeed: 1.0,
  viVoice: 'f1',
  enVoice: 'm1',
  language: 'vi'
};

const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
          <SettingsIcon size={32} />
          Cài đặt hệ thống
        </h1>
        <p className="text-muted-foreground mt-1">Quản lý cài đặt toàn bộ hệ thống</p>
      </div>

      {/* Geofence Settings */}
      <Card>
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          📍 Cài đặt địa điểm (Geofence)
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bán kính Geofence (mét)
            </label>
            <Input
              type="number"
              min="10"
              max="1000"
              step="10"
              value={settings.geofenceRadius}
              onChange={(e) => handleSettingChange('geofenceRadius', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Khoảng cách tối đa để phát hiện người dùng khi vào gần POI
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Khoảng cách tối thiểu giữa các POI (mét)
            </label>
            <Input
              type="number"
              min="10"
              max="500"
              step="10"
              value={settings.minPoiDistance}
              onChange={(e) => handleSettingChange('minPoiDistance', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Khoảng cách tối thiểu giữa hai POI để tránh trùng lặp
            </p>
          </div>
        </div>
      </Card>

      {/* Debounce Settings */}
      <Card>
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          ⏱️ Cài đặt hiệu suất
        </h2>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Thời gian debounce (giây)
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={settings.debounceTime}
            onChange={(e) => handleSettingChange('debounceTime', parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Thời gian chờ trước khi xử lý sự kiện (có thể giúp tiết kiệm pin)
          </p>
        </div>
      </Card>

      {/* TTS Settings */}
      <Card>
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          🔊 Cài đặt Text-to-Speech
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tốc độ TTS
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.ttsSpeed}
                onChange={(e) => handleSettingChange('ttsSpeed', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-foreground">{settings.ttsSpeed.toFixed(1)}x</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Giọng Tiếng Việt
              </label>
              <Select
                options={[
                  { label: 'Nữ 1', value: 'f1' },
                  { label: 'Nữ 2', value: 'f2' },
                  { label: 'Nam 1', value: 'm1' },
                  { label: 'Nam 2', value: 'm2' },
                ]}
                value={settings.viVoice}
                onChange={(val) => handleSettingChange('viVoice', val)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Giọng Tiếng Anh
              </label>
              <Select
                options={[
                  { label: 'Nữ 1', value: 'f1' },
                  { label: 'Nữ 2', value: 'f2' },
                  { label: 'Nam 1', value: 'm1' },
                  { label: 'Nam 2', value: 'm2' },
                ]}
                value={settings.enVoice}
                onChange={(val) => handleSettingChange('enVoice', val)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Language Settings */}
      <Card>
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          🌍 Cài đặt ngôn ngữ
        </h2>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Ngôn ngữ mặc định
          </label>
          <Select
            options={[
              { label: 'Tiếng Việt', value: 'vi' },
              { label: 'English', value: 'en' },
              { label: '中文', value: 'zh' },
              { label: '한국어', value: 'ko' },
              { label: '日本語', value: 'ja' },
            ]}
            value={settings.language}
            onChange={(val) => handleSettingChange('language', val)}
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 sticky bottom-6 bg-secondary p-4 rounded-lg border border-border">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Khôi phục mặc định
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSaved ? 'Đã lưu ✓' : 'Lưu cài đặt'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
