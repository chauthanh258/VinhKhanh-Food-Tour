'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Map, List, Settings, Info, QrCode } from 'lucide-react';
import QrScannerModal from './QrScannerModal';

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';

  const isTour = pathname === '/tour';
  const isSettings = pathname === '/settings';
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-lg border-t border-white/5 flex items-center justify-around z-50 max-w-lg mx-auto px-2">
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

      {/* QR Scan Button - Center */}
      <button 
        onClick={() => setIsScannerOpen(true)}
        className="relative -top-6 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/40 border-4 border-zinc-950 active:scale-95 transition-transform z-10"
      >
        <QrCode className="w-7 h-7 text-white" />
      </button>
      
      <Link 
        href="/settings"
        className={`flex flex-col items-center gap-1 transition-colors ${isSettings ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Cài đặt</span>
      </Link>
      <Link 
        href="/settings"
        className={`flex flex-col items-center gap-1 transition-colors ${isSettings ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Cài đặt</span>
      </Link>

      <QrScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
      />

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
