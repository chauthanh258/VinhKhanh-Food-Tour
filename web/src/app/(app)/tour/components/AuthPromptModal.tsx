'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  callbackUrl?: string;
  icon?: React.ReactNode;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = "Đăng nhập để sử dụng",
  description = "Bạn cần đăng nhập để tiếp tục sử dụng tính năng này.",
  callbackUrl = "/",
  icon
}: AuthPromptModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {icon && (
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-2">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-zinc-400 text-sm">
          {description}
        </p>
        <div className="w-full flex flex-col gap-2 pt-2">
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold active:scale-95 transition-transform flex items-center justify-center">
            Đăng nhập ngay
          </Link>
          <button onClick={onClose} className="w-full py-3 text-zinc-400 font-medium active:scale-95 transition-transform opacity-70 hover:opacity-100">
            Để sau
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
