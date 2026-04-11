'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';

const NotificationBell = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const prevCountRef = useRef(0);

  const fetchPending = async () => {
    try {
      const result = await adminApi.getPendingRequests();
      const count = Array.isArray(result) ? result.length : 0;
      
      if (count > prevCountRef.current) {
        playDing();
      }
      
      setPendingCount(count);
      prevCountRef.current = count;
    } catch (err: any) {
      // Thầm lặng thất bại để không làm phiền người dùng
    }
  };

  const playDing = () => {
    try {
      // Sử dụng âm thanh ding ngắn từ Mixkit (miễn phí)
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(e => console.warn('Audio auto-play blocked by browser. User interaction required first.'));
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Link href="/admin/approvals">
        <button className="relative p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300 group focus:outline-none">
          <Bell 
            size={22} 
            className={`transition-all duration-500 ${pendingCount > 0 ? 'text-primary animate-pulse' : 'text-muted-foreground group-hover:text-foreground'}`} 
          />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-primary text-primary-foreground text-[10px] font-black items-center justify-center shadow-lg border-2 border-background">
                {pendingCount > 10 ? '10+' : pendingCount}
              </span>
            </span>
          )}
        </button>
      </Link>
    </div>
  );
};

export default NotificationBell;
