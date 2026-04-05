'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card, Button, Badge } from './shared-components';
import { useAuditStore } from '@/store';

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
    UPDATE_USER_STATUS: 'Đổi trạng thái user',
    SOFT_DELETE_USER: 'Xóa user',
  };
  return actionMap[action] || action;
};

const getActionType = (action: string): 'success' | 'warning' | 'info' => {
  if (action.startsWith('CREATE') || action.startsWith('RESTORE')) return 'success';
  if (action.startsWith('DELETE') || action.startsWith('SOFT_DELETE')) return 'warning';
  return 'info';
};

const NotificationBell = () => {
  const { logs, fetchLogs } = useAuditStore();
  const [isOpen, setIsOpen] = useState(false);
  const [readLogs, setReadLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLogs({ skip: 0, take: 10, force: true });
  }, []);

  const unreadCount = logs.filter(log => !readLogs.has(log.id)).length;

  const markAllAsRead = () => {
    setReadLogs(new Set(logs.map(log => log.id)));
  };

  const dismissNotification = (id: string) => {
    setReadLogs(prev => new Set([...prev, id]));
  };

  const getIcon = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted/30 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-96 z-50 shadow-lg max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-secondary -m-6 mb-4 p-6">
              <h3 className="font-bold text-foreground">Thông báo hoạt động</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs flex items-center gap-1"
                >
                  <Check size={14} />
                  Đánh dấu đã đọc
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Không có thông báo</p>
              ) : (
                logs.map(log => {
                  const actionType = getActionType(log.action);
                  const isRead = readLogs.has(log.id);
                  return (
                    <div
                      key={log.id}
                      className={`p-4 rounded-lg border ${
                        isRead
                          ? 'bg-transparent border-border'
                          : 'bg-primary/10 border-primary/20'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="pt-1">
                          {getIcon(actionType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">{getActionLabel(log.action)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Admin: {log.admin?.fullName || log.admin?.email || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(log.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
