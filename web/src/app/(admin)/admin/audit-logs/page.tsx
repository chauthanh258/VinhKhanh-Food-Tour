'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, RefreshCw } from 'lucide-react';
import { Card, Button, Input, Badge, Select } from '../../components/shared-components';
import { useAuditStore } from '@/store';

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case 'CREATE_CATEGORY':
    case 'CREATE_POI':
    case 'RESTORE':
      return 'success';
    case 'UPDATE_CATEGORY':
    case 'UPDATE_POI':
    case 'UPDATE_USER_STATUS':
      return 'default';
    case 'DELETE_CATEGORY':
    case 'DELETE_POI':
    case 'SOFT_DELETE_USER':
      return 'danger';
    default:
      return 'default';
  }
};

const getActionLabel = (action: string) => {
  const actionMap: Record<string, string> = {
    CREATE_CATEGORY: 'Tạo danh mục',
    UPDATE_CATEGORY: 'Sửa danh mục',
    DELETE_CATEGORY: 'Xóa danh mục',
    RESTORE_CATEGORY: 'Khôi phục danh mục',
    CREATE_POI: 'Tạo POI',
    UPDATE_POI: 'Sửa POI',
    DELETE_POI: 'Xóa POI',
    UPDATE_POI_STATUS: 'Đổi trạng thái POI',
    RESTORE: 'Khôi phục',
    UPDATE_USER_STATUS: 'Đổi trạng thái user',
    SOFT_DELETE_USER: 'Xóa user',
  };
  return actionMap[action] || action;
};

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const AuditLogs = () => {
  const { logs, loading, error, total, fetchLogs } = useAuditStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchLogs({ skip: page * pageSize, take: pageSize, force: true });
  }, [page]);

  const handleRefresh = () => {
    fetchLogs({ skip: page * pageSize, take: pageSize, force: true });
  };

  const filteredLogs = logs.filter((log) => {
    const adminEmail = log.admin?.email?.toLowerCase() || '';
    const targetId = log.targetId?.toLowerCase() || '';
    const details = log.details?.toLowerCase() || '';
    const term = search.toLowerCase();
    
    const matchesSearch = adminEmail.includes(term) || targetId.includes(term) || details.includes(term);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['Thời gian', 'Admin', 'Hành động', 'Chi tiết'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((log) => {
        const row = [
          formatDateTime(log.createdAt),
          log.admin?.email || 'N/A',
          getActionLabel(log.action),
          `"${(log.details || '').replace(/"/g, '""')}"`,
        ];
        return row.join(',');
      }),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueActions = [...new Set(logs.map((l) => l.action))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nhật ký hoạt động</h2>
        <span className="text-muted-foreground">Tổng: {total} logs</span>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Tìm kiếm theo admin hoặc chi tiết..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            options={[
              { label: 'Tất cả hành động', value: 'all' },
              ...uniqueActions.map((action) => ({
                label: getActionLabel(action),
                value: action,
              })),
            ]}
            value={actionFilter}
            onChange={setActionFilter}
            className="w-full md:w-50"
          />
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Hành động</th>
                <th className="px-6 py-4">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{log.admin?.fullName || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">{log.admin?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getActionBadgeVariant(log.action) as any}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredLogs.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Không tìm thấy log nào</p>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={14} className="mr-2" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Upload size={14} className="mr-2" />
            Xuất CSV
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page + 1} / {Math.ceil(total / pageSize) || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * pageSize >= total}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
