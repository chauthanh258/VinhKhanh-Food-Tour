'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';

const NotificationBell = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getPendingRequests();
      const payload = (result as any).data ?? result;
      const total = payload.totalPending ?? ((payload.details?.pois?.length ?? 0) + (payload.details?.users?.length ?? 0));
      setPendingCount(total);
      setError(null);
    } catch (err: any) {
      setPendingCount(0);
      setError(err.message || 'Không thể tải yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Link href="/admin/approvals">
        <button className="relative p-2 rounded-lg hover:bg-muted/30 transition-colors">
          <Bell size={20} />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      </Link>
    </div>
  );
};

export default NotificationBell;
