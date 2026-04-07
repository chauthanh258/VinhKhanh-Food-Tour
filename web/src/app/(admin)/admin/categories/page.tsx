'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, Button, Input, Textarea, Badge, Dialog } from '../../components/shared-components';
import { useCategoryStore, useAuditStore } from '@/store';
import { useToast } from '@/components/Toast';

const CategoryManager = () => {
  const { addToast } = useToast();
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
  } = useCategoryStore();
  const { fetchLogs } = useAuditStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'vi',
    isActive: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchCategories(showInactive);
  }, [showInactive]);

  const filteredCategories = categories.filter((cat) => {
    const name = cat.translations?.[0]?.name?.toLowerCase() || '';
    const desc = cat.translations?.[0]?.description?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      addToast('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          translations: [{
            name: formData.name,
            description: formData.description,
            language: formData.language,
          }],
          isActive: formData.isActive,
        });
        addToast('Danh mục đã được cập nhật thành công', 'success');
      } else {
        await createCategory({
          translations: [{
            name: formData.name,
            description: formData.description,
            language: formData.language,
          }],
          isActive: true,
        });
        addToast('Danh mục mới đã được tạo thành công', 'success');
      }
      await fetchLogs({ force: true });
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', language: 'vi', isActive: true });
    } catch (err) {
      console.error('Failed to save category:', err);
      addToast('Lỗi khi lưu danh mục. Vui lòng thử lại', 'error');
    }
  };

  const handleEdit = (category: any) => {
    const translation = category.translations?.find((t: any) => t.language === 'vi') || category.translations?.[0];
    setEditingCategory(category);
    setFormData({
      name: translation?.name || '',
      description: translation?.description || '',
      language: translation?.language || 'vi',
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteCategory(deleteConfirm);
      await fetchLogs({ force: true });
      setDeleteConfirm(null);
      addToast('Danh mục đã được xóa thành công', 'success');
    } catch (err) {
      console.error('Failed to delete category:', err);
      addToast('Lỗi khi xóa danh mục. Vui lòng thử lại', 'error');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreCategory(id);
      await fetchLogs({ force: true });
      addToast('Danh mục đã được khôi phục thành công', 'success');
    } catch (err) {
      console.error('Failed to restore category:', err);
      addToast('Lỗi khi khôi phục danh mục. Vui lòng thử lại', 'error');
    }
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', language: 'vi', isActive: true });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
            <Layers size={32} />
            Quản lý danh mục
          </h1>
          <p className="text-muted-foreground mt-1">
            Tổng cộng {categories.length} danh mục
            {showInactive && <span className="text-amber-500 ml-2">(Bao gồm đã xóa)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'Ẩn đã xóa' : 'Hiện đã xóa'}
          </Button>
          <Button variant="primary" size="lg" onClick={handleNewCategory}>
            <Plus size={20} />
            Thêm danh mục
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const translation = category.translations?.find((t) => t.language === 'vi') || category.translations?.[0];
          const poiCount = category._count?.pois || 0;
          
          return (
            <Card key={category.id} className="hover:shadow-md hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{translation?.name}</h3>
                    {!category.isActive && (
                      <Badge variant="danger">Đã xóa</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{translation?.description}</p>
                </div>
              </div>

              <div className="mb-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">POI trong danh mục</span>
                  <span className="text-sm font-medium">{poiCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 font-semibold"
                >
                  <Edit size={18} />
                  Sửa
                </Button>
                {category.isActive ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Trash2 size={18} />
                    Xóa
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRestore(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 font-semibold"
                  >
                    <RefreshCw size={18} />
                    Khôi phục
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Không tìm thấy danh mục nào</p>
        </Card>
      )}

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tên danh mục</label>
            <Input
              placeholder="Ví dụ: Hải sản"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mô tả</label>
            <Textarea
              placeholder="Mô tả danh mục..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {editingCategory && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              <label htmlFor="isActive" className="text-sm">Hoạt động</label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit} className="flex-1" disabled={loading}>
              {editingCategory ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </div>
      </Dialog>

      {deleteConfirm && (
        <Dialog isOpen={true} onClose={() => setDeleteConfirm(null)} title="Xác nhận xóa">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle size={24} className="text-red-500" />
              <div className="flex-1">
                <p className="font-medium text-red-500">Bạn chắc chắn muốn xóa danh mục này?</p>
                <p className="text-sm text-red-400 mt-1">Hành động này có thể khôi phục được.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
                Hủy
              </Button>
              <Button variant="danger" onClick={handleDelete} className="flex-1" disabled={loading}>
                Xóa
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default CategoryManager;
