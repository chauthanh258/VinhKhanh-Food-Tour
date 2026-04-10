'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Map, Compass, Settings, User, QrCode } from 'lucide-react';
import QrScannerModal from './QrScannerModal';
import { useTranslation } from '@/i18n';

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';
  const t = useTranslation();

  const isTour = pathname === '/tour';
  const isSettings = pathname === '/settings';
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-lg border-t border-white/5 flex items-center justify-around z-50 max-w-lg mx-auto px-2 *:w-16">
      <Link
        href="/tour"
        className={`flex flex-col items-center gap-1 transition-colors ${isTour && currentView === 'map' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Map className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.map}</span>
      </Link>

      <Link
        href="/tour?view=list"
        className={`flex flex-col items-center gap-1 transition-colors ${isTour && currentView === 'list' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.explore}</span>
      </Link>

      {/* QR Scan Button - Center */}
      <button
        onClick={() => setIsScannerOpen(true)}
        className="relative -top-6 object-cover h-full bg-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/40 border-4 border-zinc-950 active:scale-95 transition-transform z-10"
      >
        <QrCode className="w-7 h-7 text-white" />
      </button>

      <Link
        href="/profile"
        className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/profile' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.account}</span>
      </Link>
      <Link
        href="/settings"
        className={`flex flex-col items-center gap-1 transition-colors ${isSettings ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.settings}</span>
      </Link>

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </nav>
  );
}
