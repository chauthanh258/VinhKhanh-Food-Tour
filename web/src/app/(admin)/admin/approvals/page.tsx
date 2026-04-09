'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, MapPin, User, Calendar } from 'lucide-react';
import { Card, Button, Badge, Dialog } from '../../components/shared-components';
import { adminApi } from '@/lib/api/admin';
import { useToast } from '@/components/Toast';

interface PendingPOI {
  id: string;
  lat: number;
  lng: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  submittedAt: string;
  owner?: {
    id: string;
    fullName?: string;
    email: string;
  };
  category?: {
    translations: Array<{ name: string; language: string }>;
  };
  translations: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

const ApprovalsManager = () => {
  const { addToast } = useToast();
  const [pendingPOIs, setPendingPOIs] = useState<PendingPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<PendingPOI | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchPendingPOIs();
  }, []);

  const fetchPendingPOIs = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getPendingRequests();
      setPendingPOIs(result.details.pois || []);
    } catch (err: any) {
      console.error('Failed to fetch pending POIs:', err);
      addToast('Lỗi khi tải danh sách POI chờ duyệt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (poi: PendingPOI) => {
    try {
      await adminApi.approvePOI(poi.id);
      addToast('POI đã được duyệt thành công', 'success');
      fetchPendingPOIs();
    } catch (err) {
      console.error('Failed to approve POI:', err);
      addToast('Lỗi khi duyệt POI', 'error');
    }
  };

  const handleReject = async (poi: PendingPOI) => {
    try {
      await adminApi.rejectPOI(poi.id);
      addToast('POI đã bị từ chối', 'success');
      fetchPendingPOIs();
    } catch (err) {
      console.error('Failed to reject POI:', err);
      addToast('Lỗi khi từ chối POI', 'error');
    }
  };

  const getPOIName = (poi: PendingPOI) => {
    return poi.translations?.[0]?.name || 'Unknown POI';
  };

  const getCategoryName = (poi: PendingPOI) => {
    return poi.category?.translations?.[0]?.name || 'Chưa phân loại';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Duyệt yêu cầu từ Owner</h2>
        <Button onClick={fetchPendingPOIs} disabled={loading}>
          Làm mới
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </Card>
      ) : pendingPOIs.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không có yêu cầu nào</h3>
          <p className="text-muted-foreground">Tất cả yêu cầu đã được xử lý</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingPOIs.map((poi) => (
            <Card key={poi.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={20} className="text-orange-500" />
                    <h3 className="text-lg font-semibold">{getPOIName(poi)}</h3>
                    <Badge variant="warning">Chờ duyệt</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{poi.owner?.fullName || poi.owner?.email || 'Unknown Owner'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Đăng ký: {formatDate(poi.submittedAt)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    Danh mục: {getCategoryName(poi)}
                  </p>

                  {poi.translations[0]?.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {poi.translations[0].description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPOI(poi);
                      setIsDetailOpen(true);
                    }}
                  >
                    <Eye size={16} />
                    Chi tiết
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(poi)}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Duyệt
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(poi)}
                  >
                    <XCircle size={16} className="mr-1" />
                    Từ chối
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* POI Detail Dialog */}
      <Dialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Chi tiết POI"
      >
        {selectedPOI && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{getPOIName(selectedPOI)}</h3>
              <p className="text-sm text-muted-foreground">
                Danh mục: {getCategoryName(selectedPOI)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Chủ sở hữu:</span>
                <p>{selectedPOI.owner?.fullName || selectedPOI.owner?.email}</p>
              </div>
              <div>
                <span className="font-medium">Thời gian đăng ký:</span>
                <p>{formatDate(selectedPOI.submittedAt)}</p>
              </div>
              <div>
                <span className="font-medium">Tọa độ:</span>
                <p>{selectedPOI.lat.toFixed(4)}, {selectedPOI.lng.toFixed(4)}</p>
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span>
                <Badge variant="warning">Chờ duyệt</Badge>
              </div>
            </div>

            {selectedPOI.translations[0]?.description && (
              <div>
                <span className="font-medium">Mô tả:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPOI.translations[0].description}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1">
                Đóng
              </Button>
              <Button variant="primary" onClick={() => handleApprove(selectedPOI)} className="flex-1">
                Duyệt POI
              </Button>
              <Button variant="danger" onClick={() => handleReject(selectedPOI)} className="flex-1">
                Từ chối POI
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ApprovalsManager;