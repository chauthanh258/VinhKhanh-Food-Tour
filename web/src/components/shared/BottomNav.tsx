'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Map, List, Settings, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';

  const isTour = pathname === '/tour';
  const isSettings = pathname === '/settings';

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950/80 backdrop-blur-lg border-t border-white/5 flex items-center justify-around z-50 max-w-lg mx-auto">
      <Link 
        href="/tour"
        className={`flex flex-col items-center gap-1 transition-colors ${isTour && currentView === 'map' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Map className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Bản đồ</span>
      </Link>
      
      <Link 
        href="/tour?view=list"
        className={`flex flex-col items-center gap-1 transition-colors ${isTour && currentView === 'list' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <List className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Danh sách</span>
      </Link>
      
      <Link 
        href="/settings"
        className={`flex flex-col items-center gap-1 transition-colors ${isSettings ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Cài đặt</span>
      </Link>

      {/* <Link 
        href="/help" // Placeholder for help if needed
        className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/help' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Info className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Trợ giúp</span>
      </Link> */}
    </nav>
  );
}
