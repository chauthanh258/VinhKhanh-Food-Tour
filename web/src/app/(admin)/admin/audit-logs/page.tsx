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
    case 'UPDATE_USER':
    case 'APPROVE_POI':
    case 'REJECT_POI':
    case 'APPROVE_USER_UPGRADE':
    case 'REJECT_USER_UPGRADE':
    case 'REQUEST_DELETE_POI':
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
    APPROVE_POI: 'Phê duyệt POI',
    REJECT_POI: 'Từ chối POI',
    REQUEST_DELETE_POI: 'Yêu cầu xóa POI',
    RESTORE: 'Khôi phục',
    UPDATE_USER_STATUS: 'Đổi trạng thái user',
    UPDATE_USER: 'Cập nhật user',
    SOFT_DELETE_USER: 'Xóa user',
    APPROVE_USER_UPGRADE: 'Phê duyệt nâng cấp user',
    REJECT_USER_UPGRADE: 'Từ chối nâng cấp user',
  };
  return actionMap[action] || action;
};

const parseJson = (value?: string) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const formatDetailValue = (value: any) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (Array.isArray(value)) return value.map(formatDetailValue).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const formatAuditDetails = (log: any) => {
  const details = parseJson(log.details);
  const oldValue = parseJson(log.oldValue);
  const newValue = parseJson(log.newValue);

  const segments: string[] = [];

  // Handle special formatted actions (action + subject details)
  if (log.action === 'SOFT_DELETE_USER') {
    const subjectInfo = [];
    if (details?.fullName) subjectInfo.push(details.fullName);
    if (details?.email) subjectInfo.push(details.email);
    return `Xóa người dùng: ${subjectInfo.length > 0 ? subjectInfo.join(' - ') : 'người dùng'}`;
  } else if (log.action === 'SOFT_DELETE_POI') {
    return details?.name ? `Xóa POI: ${details.name}` : 'Xóa POI';
  } else if (log.action === 'DELETE_CATEGORY') {
    return details?.name ? `Xóa danh mục: ${details.name}` : 'Xóa danh mục';
  } else if (log.action === 'RESTORE_CATEGORY') {
    return details?.name ? `Khôi phục danh mục: ${details.name}` : 'Khôi phục danh mục';
  } else if (log.action === 'CREATE_POI') {
    return details?.name ? `Tạo POI: ${details.name}` : 'Tạo POI';
  } else if (log.action === 'CREATE_CATEGORY') {
    return details?.name ? `Tạo danh mục: ${details.name}` : 'Tạo danh mục';
  } else if (log.action === 'UPDATE_POI') {
    const poiName = details?.name || 'POI';
    if (oldValue && newValue) {
      const changedFields = Object.keys({ ...oldValue, ...newValue })
        .filter((key) => oldValue[key] !== newValue[key])
        .map((key) => `${key}: ${formatDetailValue(oldValue[key])} → ${formatDetailValue(newValue[key])}`);
      return changedFields.length > 0 ? `Sửa POI: ${poiName} • ${changedFields.join(' • ')}` : `Sửa POI: ${poiName}`;
    }
    return `Sửa POI: ${poiName}`;
  } else if (log.action === 'UPDATE_CATEGORY') {
    const categoryName = details?.name || 'danh mục';
    return `Sửa danh mục: ${categoryName}`;
  } else if (log.action === 'UPDATE_USER') {
    const userName = details?.fullName || 'người dùng';
    const userEmail = details?.email ? ` - ${details.email}` : '';
    if (oldValue && newValue) {
      const changedFields = Object.keys({ ...oldValue, ...newValue })
        .filter((key) => oldValue[key] !== newValue[key])
        .map((key) => `${key}: ${formatDetailValue(oldValue[key])} → ${formatDetailValue(newValue[key])}`);
      return changedFields.length > 0 ? `Cập nhật user: ${userName}${userEmail} • ${changedFields.join(' • ')}` : `Cập nhật user: ${userName}${userEmail}`;
    }
    return `Cập nhật user: ${userName}${userEmail}`;
  } else if (log.action === 'UPDATE_POI_STATUS') {
    const poiName = details?.name || 'POI';
    const status = details?.isActive ? 'Kích hoạt' : 'Tạm dừng';
    return `Đổi trạng thái POI: ${poiName} → ${status}`;
  } else if (log.action === 'UPDATE_USER_STATUS') {
    const status = details?.isActive ? 'Kích hoạt' : 'Tạm dừng';
    return `Đổi trạng thái user → ${status}`;
  } else if (log.action === 'APPROVE_POI') {
    const poiName = details?.name || 'POI';
    const decision = details?.decision || 'phê duyệt';
    return `Phê duyệt POI: ${poiName} → ${decision === 'APPROVED' ? 'Phê duyệt' : 'Từ chối'}`;
  } else if (log.action === 'REQUEST_DELETE_POI') {
    const poiName = details?.name || 'POI';
    return `Yêu cầu xóa POI: ${poiName}`;
  } else if (log.action === 'APPROVE_USER_UPGRADE') {
    const userName = details?.fullName || 'người dùng';
    const userEmail = details?.email ? ` - ${details.email}` : '';
    return `Phê duyệt nâng cấp: ${userName}${userEmail} → Owner`;
  } else if (log.action === 'REJECT_USER_UPGRADE') {
    const userName = details?.fullName || 'người dùng';
    const userEmail = details?.email ? ` - ${details.email}` : '';
    const reason = details?.rejectionReason ? ` • Lý do: ${details.rejectionReason}` : '';
    return `Từ chối nâng cấp: ${userName}${userEmail}${reason}`;
  }

  // Default handling for other actions with field-by-field details
  if (details && typeof details === 'object' && !Array.isArray(details)) {
    if ('name' in details) segments.push(`Tên: ${formatDetailValue(details.name)}`);
    if ('fullName' in details) segments.push(`Họ tên: ${formatDetailValue(details.fullName)}`);
    if ('email' in details) segments.push(`Email: ${formatDetailValue(details.email)}`);
    if ('language' in details) segments.push(`Ngôn ngữ: ${formatDetailValue(details.language)}`);
    if ('isActive' in details) segments.push(`Trạng thái hoạt động: ${details.isActive ? 'Kích hoạt' : 'Tạm dừng'}`);
    if ('status' in details) segments.push(`Trạng thái: ${formatDetailValue(details.status)}`);
    if ('rejectionReason' in details) segments.push(`Lý do từ chối: ${formatDetailValue(details.rejectionReason)}`);
    if ('requestedRole' in details) segments.push(`Vai trò yêu cầu: ${formatDetailValue(details.requestedRole)}`);
    if ('ownerId' in details) segments.push(`ID chủ sở hữu: ${formatDetailValue(details.ownerId)}`);
    if ('categoryId' in details) segments.push(`ID danh mục: ${formatDetailValue(details.categoryId)}`);

    Object.entries(details).forEach(([key, value]) => {
      if (
        ['name', 'fullName', 'email', 'language', 'isActive', 'status', 'rejectionReason', 'requestedRole', 'ownerId', 'categoryId', 'decision'].includes(key)
      ) {
        return;
      }
      if (value !== undefined && value !== null && value !== '') {
        segments.push(`${key}: ${formatDetailValue(value)}`);
      }
    });
  } else if (details !== null && details !== undefined) {
    segments.push(formatDetailValue(details));
  }

  // Fallback to showing oldValue → newValue for changes
  if (segments.length === 0 && oldValue && newValue && typeof oldValue === 'object' && typeof newValue === 'object') {
    const changedFields = Object.keys({ ...oldValue, ...newValue })
      .filter((key) => oldValue[key] !== newValue[key])
      .map((key) => `${key}: ${formatDetailValue(oldValue[key])} → ${formatDetailValue(newValue[key])}`);

    if (changedFields.length > 0) {
      segments.push(`Thay đổi: ${changedFields.join(' • ')}`);
    }
  }

  if (segments.length === 0 && log.targetId) {
    segments.push(`ID liên quan: ${log.targetId}`);
  }

  return segments.length > 0 ? segments.join(' • ') : '-';
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
    const detailsText = formatAuditDetails(log).toLowerCase();
    const term = search.toLowerCase();
    
    const matchesSearch = adminEmail.includes(term) || targetId.includes(term) || detailsText.includes(term);
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
          `"${formatAuditDetails(log).replace(/"/g, '""')}"`,
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
    URL.revokeObjectURL(url);
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
                    {formatAuditDetails(log)}
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
