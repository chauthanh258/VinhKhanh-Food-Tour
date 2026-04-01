'use client';

import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, Button, Badge } from './shared-components';

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'success', title: 'POI mới được thêm', message: 'Quán ốc hương mới đã được thêm vào hệ thống', isRead: false, timestamp: '2 phút trước' },
  { id: 2, type: 'warning', title: 'Cần cập nhật', message: 'Một số POI chưa có dữ liệu multimedia', isRead: false, timestamp: '1 giờ trước' },
  { id: 3, type: 'info', title: 'Thông báo hệ thống', message: 'Sao lưu dữ liệu đã hoàn tất', isRead: true, timestamp: '3 giờ trước' },
  { id: 4, type: 'error', title: 'Lỗi đồng bộ', message: 'Không thể đồng bộ dữ liệu với máy chủ', isRead: true, timestamp: '5 giờ trước' },
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
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
              <h3 className="font-bold text-foreground">Thông báo</h3>
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
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Không có thông báo</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-lg border ${
                      notif.isRead
                        ? 'bg-transparent border-border'
                        : 'bg-primary/10 border-primary/20'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="pt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notif.timestamp}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notif.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
