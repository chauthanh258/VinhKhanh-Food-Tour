'use client';

import { useState } from 'react';
import { Edit, Trash2, RefreshCw, Upload, MapIcon, Play, Save, Plus, Search } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Badge, Dialog } from '../../components/shared-components';
import { cn } from '../../components/shared-components';

// Types
interface POI {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  createdAt: string;
  geofence: {
    radius: number;
    triggerType: 'enter' | 'exit' | 'near';
  };
  media: Array<{
    name: string;
    type: 'image' | 'audio';
    url: string;
  }>;
  tts: {
    vi?: { script: string; voice: string; speed: number };
    en?: { script: string; voice: string; speed: number };
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

// Mock data
const initialCategories: Category[] = [
  { id: 1, name: 'Chùa', icon: '🏯' },
  { id: 2, name: 'Bảo tàng', icon: '🎨' },
  { id: 3, name: 'Công viên', icon: '🌳' },
  { id: 4, name: 'Nhà hát', icon: '🎭' },
];

const initialPois: POI[] = [
  {
    id: 1,
    name: 'Chùa Một Cột',
    description: 'Chùa cổ nhất Hà Nội',
    categoryId: 1,
    latitude: 21.0478,
    longitude: 105.8334,
    status: 'active',
    createdAt: '2024-01-15',
    geofence: { radius: 100, triggerType: 'enter' },
    media: [
      { name: 'image1.jpg', type: 'image', url: 'https://via.placeholder.com/150' }
    ],
    tts: {
      vi: { script: 'Chùa Một Cột là chùa cổ xưa nhất ở Hà Nội', voice: 'male1', speed: 1.0 }
    }
  },
  {
    id: 2,
    name: 'Bảo tàng Lịch sử',
    description: 'nơi lưu giữ di vật lịch sử',
    categoryId: 2,
    latitude: 21.0386,
    longitude: 105.8481,
    status: 'active',
    createdAt: '2024-01-16',
    geofence: { radius: 150, triggerType: 'enter' },
    media: [],
    tts: { vi: { script: 'Bảo tàng lịch sử Việt Nam', voice: 'female1', speed: 1.0 } }
  },
];

const mockApi = {
  success: (msg: string) => console.log('✓', msg),
  error: (msg: string) => console.error('✗', msg),
};

const Tabs = ({ tabs, activeTab, onTabChange }: any) => (
  <div className="flex gap-2 border-b border-border mb-6 -mx-6 px-6">
    {tabs.map((tab: any) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const Slider = ({ label, min, max, step, value, unit, onChange }: any) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{label}</label>
      <span className="text-sm font-semibold text-primary">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-primary"
    />
  </div>
);

const PoiManager = () => {
  const [pois, setPois] = useState<POI[]>(initialPois);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoi, setEditingPoi] = useState<POI | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPois = pois.filter(poi =>
    poi.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === 'all' || poi.categoryId === Number(categoryFilter)) &&
    (statusFilter === 'all' || poi.status === statusFilter)
  );

  const handleNewPoi = () => {
    setEditingPoi({
      id: Math.max(0, ...pois.map(p => p.id)) + 1,
      name: '',
      description: '',
      categoryId: 1,
      latitude: 21.0285,
      longitude: 105.8542,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      geofence: { radius: 100, triggerType: 'enter' },
      media: [],
      tts: {}
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleEditPoi = (poi: POI) => {
    setEditingPoi({ ...poi });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingPoi) return;
    if (!editingPoi.name.trim()) {
      mockApi.error('Tên POI không được để trống');
      return;
    }

    if (pois.find(p => p.id === editingPoi.id && p.id !== editingPoi.id)) {
      setPois(pois.map(p => p.id === editingPoi.id ? editingPoi : p));
      mockApi.success('Đã cập nhật POI thành công');
    } else if (pois.find(p => p.id === editingPoi.id)) {
      setPois(pois.map(p => p.id === editingPoi.id ? editingPoi : p));
      mockApi.success('Đã cập nhật POI thành công');
    } else {
      setPois([...pois, editingPoi]);
      mockApi.success('Đã tạo POI mới thành công');
    }
    setIsModalOpen(false);
    setEditingPoi(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa POI này?')) {
      setPois(pois.map(p => p.id === id ? { ...p, status: 'inactive' } : p));
      mockApi.success('Đã xóa POI');
    }
  };

  const handleRestore = (id: number) => {
    setPois(pois.map(p => p.id === id ? { ...p, status: 'active' } : p));
    mockApi.success('Đã khôi phục POI');
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      window.speechSynthesis.speak(utterance);
      mockApi.success('Đang phát âm thanh...');
    } else {
      mockApi.error('Trình duyệt không hỗ trợ TTS');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Địa điểm du lịch (POI)</h2>
        <Button onClick={handleNewPoi}><Plus size={18} className="mr-2" /> Thêm POI mới</Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm kiếm theo tên POI..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={[
              { label: 'Tất cả danh mục', value: 'all' },
              ...initialCategories.map(c => ({ label: c.name, value: c.id.toString() }))
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <Select
            options={[
              { label: 'Tất cả trạng thái', value: 'all' },
              { label: 'Hoạt động', value: 'active' },
              { label: 'Tạm ngưng', value: 'inactive' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tên</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4">Tọa độ</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPois.map(poi => (
              <tr key={poi.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">#{poi.id}</td>
                <td className="px-6 py-4 font-medium">{poi.name}</td>
                <td className="px-6 py-4">
                  {initialCategories.find(c => c.id === poi.categoryId)?.name}
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={poi.status === 'active' ? 'success' : 'danger'}>
                    {poi.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{poi.createdAt}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPoi(poi)}>
                    <Edit size={16} />
                  </Button>
                  {poi.status === 'active' ? (
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(poi.id)}>
                      <Trash2 size={16} />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="text-primary" onClick={() => handleRestore(poi.id)}>
                      <RefreshCw size={16} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPoi?.id && pois.find(p => p.id === editingPoi.id) ? "Sửa POI" : "Thêm POI mới"}
      >
        <Tabs
          tabs={[
            { id: 'basic', label: 'Cơ bản' },
            { id: 'geofence', label: 'Geofence' },
            { id: 'media', label: 'Media' },
            { id: 'tts', label: 'TTS' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="space-y-6">
          {activeTab === 'basic' && editingPoi && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên POI</label>
                  <Input
                    value={editingPoi.name}
                    onChange={(e) => setEditingPoi({ ...editingPoi, name: e.target.value })}
                    placeholder="Nhập tên POI..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Danh mục</label>
                  <Select
                    options={initialCategories.map(c => ({ label: c.name, value: c.id }))}
                    value={editingPoi.categoryId}
                    onChange={(val) => setEditingPoi({ ...editingPoi, categoryId: Number(val) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả</label>
                <Textarea
                  value={editingPoi.description}
                  onChange={(e) => setEditingPoi({ ...editingPoi, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về địa điểm..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vĩ độ (Lat)</label>
                  <Input
                    type="number"
                    value={editingPoi.latitude}
                    onChange={(e) => setEditingPoi({ ...editingPoi, latitude: parseFloat(e.target.value) })}
                    placeholder="10.7626"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kinh độ (Lng)</label>
                  <Input
                    type="number"
                    value={editingPoi.longitude}
                    onChange={(e) => setEditingPoi({ ...editingPoi, longitude: parseFloat(e.target.value) })}
                    placeholder="106.6601"
                  />
                </div>
              </div>
              <div
                className="h-40 bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setEditingPoi({ ...editingPoi, latitude: 10.762622, longitude: 106.660172 });
                  mockApi.success('Đã lấy tọa độ từ bản đồ');
                }}
              >
                <MapIcon className="text-muted-foreground mb-2" size={32} />
                <p className="text-sm text-muted-foreground font-medium">Click để chọn tọa độ từ bản đồ</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trạng thái hoạt động</span>
                <input
                  type="checkbox"
                  checked={editingPoi.status === 'active'}
                  onChange={(e) => setEditingPoi({ ...editingPoi, status: e.target.checked ? 'active' : 'inactive' })}
                  className="w-4 h-4 accent-primary rounded"
                />
              </div>
            </div>
          )}

          {activeTab === 'geofence' && editingPoi && (
            <div className="space-y-6">
              <Slider
                label="Bán kính kích hoạt"
                min={50}
                max={500}
                step={10}
                value={editingPoi.geofence.radius}
                unit="m"
                onChange={(val: number) => setEditingPoi({ ...editingPoi, geofence: { ...editingPoi.geofence, radius: val } })}
              />
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded" />
                <label className="text-sm">Dùng tọa độ POI làm tâm</label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Loại kích hoạt (Trigger Type)</label>
                <Select
                  options={[
                    { label: 'Khi đi vào (Enter)', value: 'enter' },
                    { label: 'Khi đi ra (Exit)', value: 'exit' },
                    { label: 'Khi ở gần (Near)', value: 'near' },
                  ]}
                  value={editingPoi.geofence.triggerType}
                  onChange={(val) => setEditingPoi({ ...editingPoi, geofence: { ...editingPoi.geofence, triggerType: val as any } })}
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && editingPoi && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => mockApi.success('Mở trình chọn ảnh...')}>
                  <Upload size={20} />
                  <span>Upload Ảnh</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => mockApi.success('Mở trình chọn audio...')}>
                  <Upload size={20} />
                  <span>Upload Audio</span>
                </Button>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Danh sách media ({editingPoi.media.length})</h4>
                <div className="grid grid-cols-1 gap-2">
                  {editingPoi.media.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-background rounded overflow-hidden flex items-center justify-center text-2xl">
                          {m.type === 'image' ? '🖼️' : '🔊'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">{m.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => {
                          const newMedia = editingPoi.media.filter((_, idx) => idx !== i);
                          setEditingPoi({ ...editingPoi, media: newMedia });
                          mockApi.success('Đã xóa file');
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  {editingPoi.media.length === 0 && (
                    <p className="text-xs text-center text-muted-foreground py-4">Chưa có media nào</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tts' && editingPoi && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngôn ngữ</label>
                  <Select
                    options={[
                      { label: 'Tiếng Việt', value: 'vi' },
                      { label: 'English', value: 'en' },
                    ]}
                    value="vi"
                    onChange={() => { }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giọng đọc</label>
                  <Select
                    options={[
                      { label: 'Nam (Mạnh Tùng)', value: 'male1' },
                      { label: 'Nữ (Hoài My)', value: 'female1' },
                    ]}
                    value={editingPoi.tts.vi?.voice || 'male1'}
                    onChange={(val) => {
                      const newTts = { ...editingPoi.tts };
                      if (!newTts.vi) newTts.vi = { script: '', voice: 'male1', speed: 1.0 };
                      newTts.vi.voice = val;
                      setEditingPoi({ ...editingPoi, tts: newTts });
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nội dung thuyết minh</label>
                <Textarea
                  className="h-32"
                  placeholder="Nhập nội dung để chuyển thành giọng đọc..."
                  value={editingPoi.tts.vi?.script || ''}
                  onChange={(e) => {
                    const newTts = { ...editingPoi.tts };
                    if (!newTts.vi) newTts.vi = { script: '', voice: 'male1', speed: 1.0 };
                    newTts.vi.script = e.target.value;
                    setEditingPoi({ ...editingPoi, tts: newTts });
                  }}
                />
              </div>
              <div className="space-y-4">
                <Slider
                  label="Tốc độ đọc"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={editingPoi.tts.vi?.speed || 1.0}
                  unit="x"
                  onChange={(val: number) => {
                    const newTts = { ...editingPoi.tts };
                    if (!newTts.vi) newTts.vi = { script: '', voice: 'male1', speed: 1.0 };
                    newTts.vi.speed = val;
                    setEditingPoi({ ...editingPoi, tts: newTts });
                  }}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => handleSpeak(editingPoi.tts.vi?.script || 'Chào mừng bạn đến với Vĩnh Khánh')}>
                  <Play size={18} className="mr-2" /> Nghe thử
                </Button>
                <Button className="flex-1" onClick={() => mockApi.success('Đã lưu cấu hình TTS')}>
                  <Save size={18} className="mr-2" /> Lưu cấu hình
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default PoiManager;