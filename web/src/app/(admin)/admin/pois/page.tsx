'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, RefreshCw, Search, Plus, X } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Badge, Dialog } from '../../components/shared-components';
import { cn } from '../../components/shared-components';
import dynamic from 'next/dynamic';
import { useCategoryStore, usePOIStore, useAuditStore } from '@/store';
import { useToast } from '@/components/Toast';

const MapPicker = dynamic(() => import('./components/MapPicker'), { ssr: false });

const DEFAULT_LAT = 10.7629;
const DEFAULT_LNG = 106.6630;

const POIManager = () => {
  const { addToast } = useToast();
  const { categories, fetchCategories, getCategoryName, getCategoryOptions } = useCategoryStore();
  const { pois, loading, error, fetchPOIs, createPOI, updatePOI, updatePOIStatus, deletePOI, getPOIName } = usePOIStore();
  const { fetchLogs } = useAuditStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPOI, setEditingPOI] = useState<any>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specialties: '',
    priceRange: '',
    categoryId: '',
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });

  useEffect(() => {
    fetchCategories();
    fetchPOIs();
  }, []);

  const filteredPOIs = pois.filter((poi) => {
    const name = getPOIName(poi).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || poi.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && poi.isActive) ||
      (statusFilter === 'inactive' && !poi.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddPOI = () => {
    setEditingPOI(null);
    setIsCreateMode(true);
    setFormData({
      name: '',
      description: '',
      specialties: '',
      priceRange: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
    });
    setIsModalOpen(true);
  };

  const handleEditPOI = (poi: any) => {
    setEditingPOI(poi);
    setIsCreateMode(false);
    const translation = poi.translations?.[0] || {};
    setFormData({
      name: translation.name || '',
      description: translation.description || '',
      specialties: translation.specialties || '',
      priceRange: translation.priceRange || '',
      categoryId: poi.categoryId || '',
      lat: poi.lat,
      lng: poi.lng,
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      addToast('Vui lòng nhập tên POI', 'error');
      return;
    }

    try {
      if (isCreateMode) {
        await createPOI({
          lat: formData.lat,
          lng: formData.lng,
          categoryId: formData.categoryId || null,
          isActive: true,
          translations: [{
            name: formData.name,
            description: formData.description,
            specialties: formData.specialties,
            priceRange: formData.priceRange,
            language: 'vi',
          }],
        });
        addToast('POI mới đã được tạo thành công', 'success');
      } else if (editingPOI) {
        await updatePOI(editingPOI.id, {
          lat: formData.lat,
          lng: formData.lng,
          categoryId: formData.categoryId || null,
          translations: [{
            name: formData.name,
            description: formData.description,
            specialties: formData.specialties,
            priceRange: formData.priceRange,
            language: 'vi',
          }],
        });
        addToast('POI đã được cập nhật thành công', 'success');
      }
      await fetchLogs({ force: true });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save POI:', err);
      addToast('Lỗi khi lưu POI. Vui lòng thử lại', 'error');
    }
  };

  const handleToggleStatus = async (poi: any) => {
    try {
      await updatePOIStatus(poi.id, !poi.isActive);
      await fetchLogs({ force: true });
      addToast(`POI đã được ${!poi.isActive ? 'kích hoạt' : 'vô hiệu hóa'} thành công`, 'success');
    } catch (err) {
      console.error('Failed to update POI status:', err);
      addToast('Lỗi khi cập nhật trạng thái POI. Vui lòng thử lại', 'error');
    }
  };

  const handleDeletePOI = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa POI này?')) {
      try {
        await deletePOI(id);
        await fetchLogs({ force: true });
        addToast('POI đã được xóa thành công', 'success');
      } catch (err) {
        console.error('Failed to delete POI:', err);
        addToast('Lỗi khi xóa POI. Vui lòng thử lại', 'error');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Địa điểm du lịch (POI)</h2>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleAddPOI}>
            <Plus size={18} className="mr-2" />
            Thêm POI
          </Button>
        </div>
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
              ...getCategoryOptions(),
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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

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
            {filteredPOIs.map((poi) => (
              <tr key={poi.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">#{poi.id.slice(0, 8)}</td>
                <td className="px-6 py-4 font-medium">{getPOIName(poi)}</td>
                <td className="px-6 py-4">
                  {poi.category ? getCategoryName(poi.categoryId) : '-'}
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={poi.isActive ? 'success' : 'danger'}>
                    {poi.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{formatDate(poi.createdAt)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPOI(poi)}>
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={poi.isActive ? 'text-red-500' : 'text-green-500'}
                    onClick={() => handleToggleStatus(poi)}
                  >
                    {poi.isActive ? <Trash2 size={16} /> : <RefreshCw size={16} />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPOIs.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Không tìm thấy POI nào</p>
        </Card>
      )}

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreateMode ? 'Thêm POI mới' : 'Chi tiết POI'}
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên POI</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên POI"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Danh mục</label>
              <Select
                options={getCategoryOptions()}
                value={formData.categoryId}
                onChange={(value) => setFormData({ ...formData, categoryId: value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              className="h-20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vĩ độ (Lat)</label>
              <Input 
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kinh độ (Lng)</label>
              <Input 
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vị trí trên bản đồ</label>
            <MapPicker
              latitude={formData.lat}
              longitude={formData.lng}
              onLocationSelect={(lat, lng) => setFormData({ ...formData, lat, lng })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Đặc sản</label>
            <Input 
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              placeholder="Nhập đặc sản"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Khoảng giá</label>
            <Input 
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
              placeholder="Ví dụ: 50.000đ - 200.000đ"
            />
          </div>

          {!isCreateMode && editingPOI && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Chủ sở hữu</label>
              <Input
                value={editingPOI.owner?.fullName || editingPOI.owner?.email || 'N/A'}
                disabled
              />
            </div>
          )}

          {!isCreateMode && editingPOI && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Trạng thái</span>
              <Badge variant={editingPOI.isActive ? 'success' : 'danger'}>
                {editingPOI.isActive ? 'Hoạt động' : 'Tạm ngưng'}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {isCreateMode ? 'Thêm' : 'Lưu'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default POIManager;
