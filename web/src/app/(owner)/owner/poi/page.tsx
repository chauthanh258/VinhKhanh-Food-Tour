"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MapPin,
  Star,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";
import dynamic from 'next/dynamic';
import { Button, Input, Textarea, Select, Badge } from "@/app/(admin)/components/shared-components";
import { Modal } from "../../components/Modal";
import { poiApi } from '@/lib/api/poi';
import { moderationApi } from '@/lib/api/moderation';
import { categoryApi, Category } from '@/lib/api/category';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/Toast';

const MapPicker = dynamic(() => import('@/app/(admin)/admin/pois/components/MapPicker'), { ssr: false });

const DEFAULT_LAT = 10.7629;
const DEFAULT_LNG = 106.6630;

interface POIItem {
  id: string;
  lat: number;
  lng: number;
  rating: number;
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  categoryId?: string;
  translations: Array<{
    name: string;
    description?: string;
    specialties?: string;
    priceRange?: string;
    imageUrl?: string;
  }>;
  category?: {
    id: string;
    translations: Array<{ name: string; language: string }>;
  };
}

export default function POIManagement() {
  const { user } = useUserStore();
  const { addToast } = useToast();
  
  const [pois, setPois] = useState<POIItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedPoi, setSelectedPoi] = useState<POIItem | null>(null);

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
    if (user?.id) {
      fetchData();
      fetchCategories();
    }
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [poiData, requestData] = await Promise.all([
        poiApi.getByOwner(user!.id),
        moderationApi.getMyRequests()
      ]);
      setPois(poiData);
      setMyRequests(requestData);
    } catch (err) {
      console.error("Failed to fetch POIs:", err);
      addToast("Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      specialties: '',
      priceRange: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
    });
  };

  const handleOpenModal = (mode: "add" | "edit" | "view" | "delete", poi?: POIItem) => {
    setModalMode(mode);
    setSelectedPoi(poi || null);
    
    if (mode === "add") {
      resetForm();
    } else if (poi) {
      const translation = poi.translations[0] || {};
      setFormData({
        name: translation.name || '',
        description: translation.description || '',
        specialties: translation.specialties || '',
        priceRange: translation.priceRange || '',
        categoryId: poi.categoryId || '',
        lat: poi.lat,
        lng: poi.lng,
      });
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPoi(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      addToast("Vui lòng nhập tên địa điểm", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        lat: formData.lat,
        lng: formData.lng,
        categoryId: formData.categoryId || undefined,
        ownerId: user!.id,
        translations: [{
          name: formData.name,
          description: formData.description,
          specialties: formData.specialties,
          priceRange: formData.priceRange,
          language: 'vi'
        }]
      };

      if (modalMode === "add") {
        await poiApi.create(payload);
        addToast("Địa điểm đã được gửi yêu cầu phê duyệt", "success");
      } else if (selectedPoi) {
        await poiApi.update(selectedPoi.id, payload);
        addToast("Yêu cầu cập nhật đã được gửi", "success");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save POI:", err);
      addToast("Lỗi khi lưu thông tin", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = async (poiId: string) => {
    try {
      await poiApi.requestDelete(poiId);
      addToast("Yêu cầu xóa đã được gửi cho Admin", "success");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      addToast(err?.response?.data?.message || "Lỗi khi gửi yêu cầu xóa", "error");
    }
  };

  const getStatusBadge = (poi: POIItem) => {
    const hasDeleteRequest = myRequests.some(r => r.targetId === poi.id && r.type === 'POI_DELETE' && r.status === 'PENDING');
    
    if (hasDeleteRequest) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
          <Clock className="w-3.5 h-3.5" />
          Đang chờ xóa
        </span>
      );
    }

    if (poi.status === 'PENDING') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
          <Clock className="w-3.5 h-3.5" />
          Chờ duyệt
        </span>
      );
    }

    if (poi.status === 'REJECTED') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
          <XCircle className="w-3.5 h-3.5" />
          Bị từ chối
        </span>
      );
    }

    if (poi.isActive) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Hoạt động
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-100">
        <Eye className="w-3.5 h-3.5" />
        Đã ẩn
      </span>
    );
  };

  const categoryOptions = categories.map(cat => ({
    label: cat.translations.find(t => t.language === 'vi')?.name || cat.translations[0]?.name || 'Không tên',
    value: cat.id
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-100/50 dark:shadow-none">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Cửa hàng của <span className="text-orange-500">Tôi</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            Quản lý địa điểm và theo dõi trạng thái phê duyệt từ Admin.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all hover:-translate-y-1 active:translate-y-0 text-lg"
        >
          <Plus className="w-6 h-6" />
          Thêm địa điểm mới
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <RefreshCw className="w-10 h-10 text-orange-500 animate-spin mb-4" />
          <p className="text-zinc-500 font-medium">Đang đồng bộ dữ liệu...</p>
        </div>
      ) : pois.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-zinc-300" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Bạn chưa có địa điểm nào</h2>
          <p className="text-zinc-500 mt-2 max-w-sm text-center">Hãy thêm cửa hàng của bạn để bắt đầu tiếp cận khách du lịch tại Vĩnh Khánh.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pois.map((poi) => {
            const translation = poi.translations[0] || {};
            return (
              <div
                key={poi.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={translation.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500"}
                      alt={translation.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(poi)}
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                            {translation.name || "Địa điểm không tên"}
                          </h3>
                          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-black">{poi.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}</span>
                          </div>
                          <span>•</span>
                          <span className="font-semibold text-orange-500">{poi.category?.translations?.[0]?.name || "Chưa phân loại"}</span>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {translation.description || "Không có mô tả chi tiết."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal("view", poi)}
                            className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-100 transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal("edit", poi)}
                            className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-all"
                            title="Chỉnh sửa (yêu cầu duyệt)"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleOpenModal("delete", poi)}
                          className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                          Xóa địa điểm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "add" ? "Thêm Địa Điểm Mới" : 
          modalMode === "edit" ? "Chỉnh sửa Địa Điểm" : 
          modalMode === "delete" ? "Yêu cầu xóa địa điểm" : "Chi tiết Địa Điểm"
        }
        size={modalMode === "delete" ? "sm" : "lg"}
      >
        {modalMode === "delete" ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Xác nhận yêu cầu xóa?</h3>
              <p className="text-zinc-500">
                Yêu cầu xóa địa điểm <span className="font-bold text-zinc-900">"{selectedPoi?.translations[0]?.name}"</span> sẽ được gửi đến Ban quản trị để phê duyệt.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={handleCloseModal} 
                className="flex-1 py-4 rounded-2xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-sm"
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleRequestDelete(selectedPoi!.id)}
                className="flex-1 py-4"
              >
                Gửi yêu cầu xóa
              </Button>
            </div>
          </div>
        ) : modalMode === "view" ? (
          <div className="space-y-6 py-4 px-2">
            <p className="text-zinc-500">Xem thông tin chi tiết địa điểm...</p>
            <Button onClick={handleCloseModal} className="w-full">Đóng</Button>
          </div>
        ) : (
          <div className="space-y-6 py-4 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Tên địa điểm
                </label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Ví dụ: Ốc Oanh Vĩnh Khánh" 
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-orange-500 h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Danh mục
                </label>
                <Select 
                  options={categoryOptions} 
                  value={formData.categoryId} 
                  onChange={(value) => setFormData({ ...formData, categoryId: value })} 
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Mô tả chi tiết
              </label>
              <Textarea 
                className="h-32 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-orange-500 p-4" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Giới thiệu đôi nét về không gian, phong cách phục vụ và lịch sử của quán..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Món đặc sắc (Specialties)
                </label>
                <Input 
                  value={formData.specialties} 
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })} 
                  placeholder="Ví dụ: Ốc hương trứng muối, Càng ghẹ rang muối..." 
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Phân khúc giá (VNĐ)
                </label>
                <Input 
                  type="text" 
                  value={formData.priceRange} 
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })} 
                  placeholder="Ví dụ: 50.000đ - 150.000đ" 
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Xác định vị trí trên bản đồ
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[10px] font-bold text-zinc-400 uppercase">Vĩ độ</span>
                  <Input type="number" step="0.000001" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) || DEFAULT_LAT })} className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-14 pt-5 pl-3" />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[10px] font-bold text-zinc-400 uppercase">Kinh độ</span>
                  <Input type="number" step="0.000001" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) || DEFAULT_LNG })} className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-14 pt-5 pl-3" />
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-inner h-[300px]">
                <MapPicker 
                  latitude={formData.lat} 
                  longitude={formData.lng} 
                  onLocationSelect={(lat, lng) => setFormData({ ...formData, lat, lng })} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Button 
                variant="secondary" 
                onClick={handleCloseModal} 
                disabled={saving} 
                className="px-8 py-6 rounded-2xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-sm"
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                disabled={saving}
                className="px-10 py-6 rounded-2xl font-bold shadow-xl shadow-orange-500/20 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {saving ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : null}
                {modalMode === "add" ? "Gửi yêu cầu khởi tạo" : "Gửi yêu cầu cập nhật"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}