'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Map, Compass, Settings, User, QrCode, LogIn } from 'lucide-react';
import QrScannerModal from './QrScannerModal';
import AuthPromptModal from './AuthPromptModal';
import { useTranslation } from '@/i18n';
import { useUserStore } from '@/store/userStore';

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';
  const t = useTranslation();

  const isTour = pathname === '/tour';
  const isSettings = pathname === '/settings';
  const isLoggedIn = useUserStore((s) => !!s.token);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [authPromptConfig, setAuthPromptConfig] = React.useState<{
    isOpen: boolean;
    title?: string;
    description?: string;
    callbackUrl?: string;
    icon?: React.ReactNode;
  }>({ isOpen: false });

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-lg border-t border-white/5 flex items-center justify-around z-50 max-w-lg mx-auto px-2">
      <Link
        href="/tour"
        className={`flex flex-col items-center gap-1 transition-colors w-20 ${isTour && currentView === 'map' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Map className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.map}</span>
      </Link>

      <Link
        href="/tour?view=list"
        className={`flex flex-col items-center gap-1 transition-colors w-20 ${isTour && currentView === 'list' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.explore}</span>
      </Link>

      {/* QR Scan Button - Center */}
      <button
        onClick={() => {
          if (!isLoggedIn) {
            setAuthPromptConfig({
              isOpen: true,
              title: "Đăng nhập để sử dụng",
              description: "Bạn cần đăng nhập để khởi tạo hành trình và tích ngay điểm thưởng thành viên.",
              callbackUrl: "/tour",
              icon: <QrCode className="w-6 h-6 text-orange-500" />
            });
          } else {
            setIsScannerOpen(true);
          }
        }}
        className="relative -top-6 object-cover h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/40 border-4 border-zinc-950 active:scale-95 transition-transform z-10"
      >
        <QrCode className="w-7 h-7 text-white" />
      </button>

      {isLoggedIn ? (
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 transition-colors w-20 ${pathname === '/profile' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.account}</span>
        </Link>
      ) : (
        <Link
          href="/login?callbackUrl=/tour"
          className={`flex flex-col items-center gap-1 transition-colors text-zinc-500 hover:text-white w-20`}
        >
          <LogIn className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Đăng nhập</span>
        </Link>
      )}
      {isLoggedIn ? (
        <Link
          href="/settings"
          className={`flex flex-col items-center gap-1 transition-colors w-20 ${isSettings ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.settings}</span>
        </Link>
      ) : (
        <button
          onClick={() => {
            setAuthPromptConfig({
              isOpen: true,
              title: "Cài đặt ứng dụng",
              description: "Bạn cần đăng nhập để thay đổi các tùy chỉnh này.",
              callbackUrl: "/settings",
              icon: <Settings className="w-6 h-6 text-orange-500" />
            });
          }}
          className={`flex flex-col items-center gap-1 transition-colors w-20 ${isSettings ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t.nav.settings}</span>
        </button>
      )}

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <AuthPromptModal
        isOpen={authPromptConfig.isOpen}
        onClose={() => setAuthPromptConfig((prev) => ({ ...prev, isOpen: false }))}
        title={authPromptConfig.title}
        description={authPromptConfig.description}
        callbackUrl={authPromptConfig.callbackUrl}
        icon={authPromptConfig.icon}
      />
    </nav>
  );
}
