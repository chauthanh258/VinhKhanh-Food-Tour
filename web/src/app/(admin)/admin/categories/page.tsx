'use client';

import React, { useState } from 'react';
import { Layers, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Card, Button, Input, Textarea, Badge, Dialog } from '../../components/shared-components';

interface Category {
  id: number;
  name: string;
  description: string;
  poiCount: number;
}

const initialCategories: Category[] = [
  { id: 1, name: 'Hải sản', description: 'Các món hải sản tươi sống', poiCount: 5 },
  { id: 2, name: 'Bánh', description: 'Bánh truyền thống', poiCount: 3 },
  { id: 3, name: 'Ăn vặt', description: 'Các món ăn vặt đường phố', poiCount: 8 },
  { id: 4, name: 'Nước giải khát', description: 'Trà sữa, nước mía, sinh tố', poiCount: 4 },
];

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEdit = () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      setCategories([...categories, {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        ...formData,
        poiCount: 0
      }]);
    }

    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setDeleteConfirm(null);
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
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
          <p className="text-muted-foreground mt-1">Tổng cộng {categories.length} danh mục</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleNewCategory} className="flex items-center gap-2">
          <Plus size={20} />
          Thêm danh mục
        </Button>
      </div>

      {/* Search */}
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>
            </div>

            <div className="mb-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">POI trong danh mục</span>
                <Badge variant="success">{category.poiCount}</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(category)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Sửa
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteConfirm(category.id)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Xoá
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
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

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleAddOrEdit}
              className="flex-1"
            >
              {editingCategory ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <Dialog
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Xác nhận xoá"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle size={24} className="text-red-500" />
              <div className="flex-1">
                <p className="font-medium text-red-500">
                  Bạn chắc chắn muốn xoá danh mục này?
                </p>
                <p className="text-sm text-red-400 mt-1">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1"
              >
                Xoá
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default CategoryManager;
