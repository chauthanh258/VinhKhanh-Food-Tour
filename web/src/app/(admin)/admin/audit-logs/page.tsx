'use client';

import { useState } from 'react';
import { Upload, Search } from 'lucide-react';
import { Card, Button, Input, Badge, Select, cn } from '../../components/shared-components';

// Types
interface AuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: 'create' | 'update' | 'delete' | 'restore';
  targetType: string;
  targetName: string;
  details: string;
}

// Mock data
const initialLogs: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2024-01-20 14:32:15',
    adminEmail: 'admin@example.com',
    action: 'create',
    targetType: 'POI',
    targetName: 'Chùa Một Cột',
    details: 'Tạo POI mới'
  },
  {
    id: 'log_002',
    timestamp: '2024-01-20 13:45:22',
    adminEmail: 'manager@example.com',
    action: 'update',
    targetType: 'Category',
    targetName: 'Chùa',
    details: 'Cập nhật tên danh mục'
  },
  {
    id: 'log_003',
    timestamp: '2024-01-20 12:10:08',
    adminEmail: 'admin@example.com',
    action: 'delete',
    targetType: 'POI',
    targetName: 'Bảo tàng cũ',
    details: 'Xóa POI'
  },
  {
    id: 'log_004',
    timestamp: '2024-01-20 11:25:44',
    adminEmail: 'admin@example.com',
    action: 'restore',
    targetType: 'POI',
    targetName: 'Hồ Hoàn Kiếm',
    details: 'Khôi phục POI đã xóa'
  },
  {
    id: 'log_005',
    timestamp: '2024-01-19 16:50:33',
    adminEmail: 'manager@example.com',
    action: 'update',
    targetType: 'Settings',
    targetName: 'Geofence Config',
    details: 'Cập nhật cấu hình geofence'
  },
];

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case 'create': return 'success';
    case 'update': return 'default';
    case 'restore': return 'warning';
    case 'delete': return 'danger';
    default: return 'default';
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case 'create': return 'Tạo mới';
    case 'update': return 'Cập nhật';
    case 'restore': return 'Khôi phục';
    case 'delete': return 'Xóa';
    default: return action;
  }
};

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = initialLogs.filter(log =>
    (log.targetName.toLowerCase().includes(search.toLowerCase()) || log.adminEmail.toLowerCase().includes(search.toLowerCase())) &&
    (actionFilter === 'all' || log.action === actionFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nhật ký hoạt động</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload size={14} className="mr-2" /> Xuất CSV</Button>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Tìm kiếm theo admin hoặc đối tượng..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            options={[
              { label: 'Tất cả hành động', value: 'all' },
              { label: 'Tạo mới', value: 'create' },
              { label: 'Cập nhật', value: 'update' },
              { label: 'Xóa', value: 'delete' },
              { label: 'Khôi phục', value: 'restore' },
            ]}
            value={actionFilter}
            onChange={setActionFilter}
            className="w-50"
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Hành động</th>
                <th className="px-6 py-4">Đối tượng</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium">{log.adminEmail}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getActionBadgeVariant(log.action) as any}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{log.targetType}:</span>
                      <span>{log.targetName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs text-right">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default AuditLogs;