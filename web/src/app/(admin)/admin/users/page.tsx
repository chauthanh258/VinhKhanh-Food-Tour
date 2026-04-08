'use client';

import { useState, useEffect } from 'react';
import { Users, Activity, Plus, Clock, Route, Eye, Search, Play, Trash2, Edit } from 'lucide-react';
import { Card, Button, Input, Badge, Dialog, cn, Select, EmptyState } from '../../components/shared-components';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserAdminStore, useAuditStore } from '@/store';
import { useToast } from '@/components/Toast';

interface UserSession {
  session_id: string;
  device_id: string;
  user_id: string;
  language: string;
  start_time: string;
  end_time: string | null;
  current_poi: string;
  current_poi_duration: string;
  journey: Array<{
    poi: string;
    time: string;
    action: string;
    audio_played?: boolean;
  }>;
}

const UserManager = () => {
  const { addToast } = useToast();
  const { users, loading, error, fetchUsers, updateUserStatus, deleteUser, updateUser } = useUserAdminStore();
  const { fetchLogs } = useAuditStore();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    role: 'USER',
    isActive: true,
  });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [confirmUnlock, setConfirmUnlock] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeUsers = filteredUsers.filter(u => u.isActive);
  const inactiveUsers = filteredUsers.filter(u => !u.isActive);

  const stats = [
    { label: 'Tổng người dùng', value: users.length.toString(), icon: Users, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Đang hoạt động', value: activeUsers.length.toString(), icon: Activity, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Người dùng mới (24h)', value: '42', icon: Plus, color: 'bg-orange-500/10 text-orange-500' },
    { label: 'Admin', value: users.filter(u => u.role === 'ADMIN').length.toString(), icon: Clock, color: 'bg-purple-500/10 text-purple-500' },
  ];

  const handleToggleStatus = async (user: any) => {
    try {
      await updateUserStatus(user.id, !user.isActive);
      await fetchLogs({ force: true });
      addToast(user.isActive ? 'Đã khóa người dùng thành công' : 'Đã mở khóa người dùng thành công', 'success');
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Failed to update user status:', err);
      addToast('Lỗi khi cập nhật trạng thái người dùng', 'error');
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      fullName: user.fullName || '',
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, userForm);
      await fetchLogs({ force: true });
      setIsEditOpen(false);
      setEditingUser(null);
      addToast('Đã cập nhật thông tin người dùng thành công', 'success');
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Failed to update user:', err);
      addToast('Lỗi khi cập nhật thông tin người dùng', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      await fetchLogs({ force: true });
      addToast('Người dùng đã được xóa thành công', 'success');
      fetchUsers();
      setConfirmDelete({ isOpen: false, user: null });
    } catch (err) {
      console.error('Failed to delete user:', err);
      addToast('Lỗi khi xóa người dùng. Vui lòng thử lại', 'error');
    }
  };

  const handleUnlockUser = async () => {
    if (!confirmUnlock.user) return;
    try {
      await updateUserStatus(confirmUnlock.user.id, true);
      await fetchLogs({ force: true });
      addToast('Đã mở khóa người dùng thành công', 'success');
      fetchUsers();
      setConfirmUnlock({ isOpen: false, user: null });
    } catch (err) {
      console.error('Failed to unlock user:', err);
      addToast('Lỗi khi mở khóa người dùng. Vui lòng thử lại', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
      </div>

      <div className="flex gap-2 border-b border-border -mx-6 px-6">
        {['active', 'stats', 'inactive'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'active' ? 'Hoạt động' : tab === 'stats' ? 'Thống kê' : 'Bị khóa'}
          </button>
        ))}
      </div>

      {activeTab === 'active' && (
        <>
          <Card className="p-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select
                options={[
                  { label: 'Tất cả vai trò', value: 'all' },
                  { label: 'Admin', value: 'ADMIN' },
                  { label: 'Owner', value: 'OWNER' },
                  { label: 'User', value: 'USER' }
                ]}
                value={roleFilter}
                onChange={setRoleFilter}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Ngôn ngữ</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.filter(u => u.isActive).map(user => (
                  <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.fullName || 'N/A'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'ADMIN' ? 'info' : user.role === 'OWNER' ? 'warning' : 'success'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 uppercase font-bold text-xs">{user.language}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDelete({ isOpen: true, user })}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.filter(u => u.isActive).length === 0 && (
              <EmptyState 
                title="Không có người dùng nào" 
                description="Chưa có người dùng hoạt động." 
                icon="👥" 
              />
            )}
          </Card>
        </>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="flex items-center gap-4">
                <div className={cn("p-3 rounded-lg", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-6">Phân bố người dùng theo vai trò</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { role: 'Admin', count: users.filter(u => u.role === 'ADMIN').length },
                  { role: 'Owner', count: users.filter(u => u.role === 'OWNER').length },
                  { role: 'User', count: users.filter(u => u.role === 'USER').length },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="role" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#10b981' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'inactive' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inactiveUsers.map(user => (
                <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant="danger">{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setConfirmUnlock({ isOpen: true, user })}>
                      <Plus size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inactiveUsers.length === 0 && (
            <EmptyState 
              title="Không có người dùng bị khóa" 
              description="Tất cả người dùng đang hoạt động." 
              icon="✅" 
            />
          )}
        </Card>
      )}

      <Dialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Chỉnh sửa người dùng">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Họ và tên</label>
            <Input
              value={userForm.fullName}
              onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
              placeholder="Nhập họ tên"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Vai trò</label>
            <Select
              options={[
                { label: 'User', value: 'USER' },
                { label: 'Owner', value: 'OWNER' },
              ]}
              value={userForm.role}
              onChange={(value) => setUserForm({ ...userForm, role: value })}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSaveUser} className="flex-1">
              Lưu
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, user: null })}
        title="Xác nhận xóa người dùng"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bạn có chắc muốn xóa người dùng "{confirmDelete.user?.fullName || confirmDelete.user?.email}" không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setConfirmDelete({ isOpen: false, user: null })} className="flex-1">
              Hủy
            </Button>
            <Button variant="danger" onClick={() => confirmDelete.user && handleDeleteUser(confirmDelete.user.id)} className="flex-1">
              Xóa người dùng
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={confirmUnlock.isOpen}
        onClose={() => setConfirmUnlock({ isOpen: false, user: null })}
        title="Xác nhận mở khóa người dùng"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bạn có chắc muốn mở khóa người dùng "{confirmUnlock.user?.fullName || confirmUnlock.user?.email}" không? Người dùng sẽ được phép đăng nhập lại.
          </p>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setConfirmUnlock({ isOpen: false, user: null })} className="flex-1">
              Hủy
            </Button>
            <Button variant="primary" onClick={handleUnlockUser} className="flex-1">
              Mở khóa
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default UserManager;
