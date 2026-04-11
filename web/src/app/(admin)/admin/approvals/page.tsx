'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  User, 
  Calendar, 
  Trash2, 
  UserPlus, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { Card, Button, Badge, Dialog } from '../../components/shared-components';
import { adminApi } from '@/lib/api/admin';
import { useToast } from '@/components/Toast';

type TabType = 'POI_CREATE' | 'POI_DELETE' | 'UPGRADE_OWNER';

const ApprovalsManager = () => {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('POI_CREATE');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
    // Tự động làm mới mỗi 30 giây
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getPendingRequests();
      setRequests(result || []);
    } catch (err: any) {
      console.error('Failed to fetch pending requests:', err);
      addToast('Lỗi khi tải danh sách yêu cầu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveRequest(id);
      addToast('Yêu cầu đã được duyệt', 'success');
      setIsDetailOpen(false);
      fetchRequests();
    } catch (err) {
      addToast('Lỗi khi duyệt yêu cầu', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectRequest(id);
      addToast('Yêu cầu đã bị từ chối', 'success');
      setIsDetailOpen(false);
      fetchRequests();
    } catch (err) {
      addToast('Lỗi khi từ chối yêu cầu', 'error');
    }
  };

  const filteredRequests = requests.filter(r => r.type === activeTab);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const renderContent = () => {
    if (loading && requests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-foreground">
          <RefreshCw className="animate-spin text-primary mb-4" size={32} />
          <p className="text-muted-foreground">Đang tải danh sách yêu cầu...</p>
        </div>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <Card className="p-12 text-center border-dashed bg-secondary/20">
          <CheckCircle size={48} className="mx-auto text-muted mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Không có yêu cầu nào</h3>
          <p className="text-muted-foreground">Bạn đã xử lý hết các yêu cầu trong mục này.</p>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredRequests.map((req) => (
          <Card key={req.id} className="p-5 hover:border-primary/50 transition-colors bg-secondary/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {req.type === 'POI_CREATE' && <MapPin size={20} className="text-blue-500" />}
                  {req.type === 'POI_DELETE' && <Trash2 size={20} className="text-red-500" />}
                  {req.type === 'UPGRADE_OWNER' && <UserPlus size={20} className="text-purple-500" />}
                  
                  <h3 className="text-lg font-bold text-foreground">
                    {req.type === 'POI_CREATE' && (req.targetInfo?.translations?.[0]?.name || 'POI Mới')}
                    {req.type === 'POI_DELETE' && (req.targetInfo?.translations?.[0]?.name || 'Yêu cầu Xóa')}
                    {req.type === 'UPGRADE_OWNER' && 'Nâng cấp lên Owner'}
                  </h3>
                  <Badge variant="warning">PENDING</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User size={16} />
                    <span className="font-semibold text-foreground">{req.requester?.fullName || req.requester?.email || 'Ẩn danh'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} />
                    <span>{formatDate(req.requestedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => { setSelectedRequest(req); setIsDetailOpen(true); }}>
                  <Eye size={16} className="mr-1" /> Chi tiết
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleApprove(req.id)}>
                  <CheckCircle size={16} className="mr-1" /> Duyệt
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleReject(req.id)}>
                  <XCircle size={16} className="mr-1" /> Từ chối
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Hệ thống <span className="text-primary">Duyệt</span></h1>
          <p className="text-muted-foreground mt-1">Quản lý các yêu cầu từ cộng đồng và đối tác khu vực Vĩnh Khánh.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading} className="gap-2">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Làm mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-secondary rounded-2xl w-fit border border-border shadow-sm">
        {[
          { id: 'POI_CREATE', label: 'POI Mới', icon: MapPin },
          { id: 'POI_DELETE', label: 'Yêu cầu Xóa', icon: Trash2 },
          { id: 'UPGRADE_OWNER', label: 'Nâng cấp Owner', icon: UserPlus },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-xl scale-105' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {requests.filter(r => r.type === tab.id).length > 0 && (
              <span className={`ml-2 flex h-2 w-2 rounded-full ${activeTab === tab.id ? 'bg-white' : 'bg-primary'}`} />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {/* Detail Dialog */}
      <Dialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Thông tin yêu cầu">
        {selectedRequest && (
          <div className="space-y-6">
            <div className="p-5 bg-secondary/30 rounded-3xl border border-border">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                   <Clock size={18} />
                   Chi tiết yêu cầu
                 </h3>
                 <Badge variant="warning">{selectedRequest.type}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">ID yêu cầu:</p>
                  <p className="font-mono text-xs overflow-hidden text-ellipsis">{selectedRequest.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Thời gian gửi:</p>
                  <p className="font-semibold">{formatDate(selectedRequest.requestedAt)}</p>
                </div>
                {selectedRequest.type.includes('POI') && (
                  <>
                    <div className="space-y-1 col-span-2">
                      <p className="text-muted-foreground">Tên POI:</p>
                      <p className="font-bold text-xl text-foreground">{selectedRequest.targetInfo?.translations?.[0]?.name || 'N/A'}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-muted-foreground">Tọa độ địa lý:</p>
                      <p className="font-mono bg-background/50 p-2 rounded-lg inline-block border border-border">
                        {selectedRequest.targetInfo?.lat.toFixed(6)}, {selectedRequest.targetInfo?.lng.toFixed(6)}
                      </p>
                    </div>
                  </>
                )}
                {selectedRequest.type === 'UPGRADE_OWNER' && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-muted-foreground">Tài khoản nâng cấp:</p>
                    <p className="font-bold text-xl text-foreground">{selectedRequest.targetInfo?.fullName || selectedRequest.targetInfo?.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 bg-secondary/30 rounded-3xl border border-border">
              <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                <User size={18} />
                Người yêu cầu
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 shadow-inner">
                  {(selectedRequest.requester?.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-extrabold text-foreground">{selectedRequest.requester?.fullName || 'Ẩn danh'}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.requester?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setIsDetailOpen(false)} className="flex-1 rounded-2xl py-6">Đóng</Button>
              <Button variant="danger" onClick={() => handleReject(selectedRequest.id)} className="flex-1 rounded-2xl py-6">Từ chối</Button>
              <Button variant="primary" onClick={() => handleApprove(selectedRequest.id)} className="flex-1 rounded-2xl py-6 shadow-lg shadow-primary/20">Duyệt ngay</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ApprovalsManager;