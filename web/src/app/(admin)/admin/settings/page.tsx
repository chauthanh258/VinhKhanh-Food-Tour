'use client';

import React, { useEffect } from 'react';
import { Settings as SettingsIcon, RefreshCw, Save } from 'lucide-react';
import { Card, Button, Input, Select } from '../../components/shared-components';
import { useSettingsStore, useAuditStore } from '@/store';
import { useToast } from '@/components/Toast';

const Settings = () => {
  const { addToast } = useToast();
  const { settings, isLoaded, loadSettings, updateSetting, saveSettings, resetSettings } = useSettingsStore();
  const { fetchLogs } = useAuditStore();

  useEffect(() => {
    if (!isLoaded) {
      loadSettings();
    }
  }, [isLoaded, loadSettings]);

  const handleSave = () => {
    try {
      saveSettings();
      fetchLogs({ force: true });
      addToast('Cài đặt đã được lưu thành công', 'success');
    } catch (err) {
      addToast('Lỗi khi lưu cài đặt. Vui lòng thử lại', 'error');
    }
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn khôi phục tất cả cài đặt về mặc định?')) {
      try {
        resetSettings();
        loadSettings();
        addToast('Cài đặt đã được khôi phục về mặc định', 'success');
      } catch (err) {
        addToast('Lỗi khi khôi phục cài đặt. Vui lòng thử lại', 'error');
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
          <SettingsIcon size={32} />
          Cài đặt hệ thống
        </h1>
        <p className="text-muted-foreground mt-1">Quản lý cài đặt toàn bộ hệ thống</p>
      </div>

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
              onChange={(e) => updateSetting('geofenceRadius', parseInt(e.target.value))}
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
              onChange={(e) => updateSetting('minPoiDistance', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Khoảng cách tối thiểu giữa hai POI để tránh trùng lặp
            </p>
          </div>
        </div>
      </Card>

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
            onChange={(e) => updateSetting('debounceTime', parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Thời gian chờ trước khi xử lý sự kiện (có thể giúp tiết kiệm pin)
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          🔊 Cài đặt Text-to-Speech
        </h2>

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
              onChange={(e) => updateSetting('ttsSpeed', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-foreground">{settings.ttsSpeed.toFixed(1)}x</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Điều chỉnh tốc độ phát âm của Text-to-Speech
          </p>
        </div>
      </Card>

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
            onChange={(val) => updateSetting('language', val)}
          />
        </div>
      </Card>

      <div className="flex gap-4 sticky bottom-6 z-10 bg-secondary/80 backdrop-blur-md p-4 rounded-lg border border-border shadow-lg">
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
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
};

export default Settings;
