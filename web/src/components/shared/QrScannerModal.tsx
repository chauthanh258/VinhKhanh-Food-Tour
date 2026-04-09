'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QrScannerModal({ isOpen, onClose }: QrScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerSuccessEffect = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.getState() > 1) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('Error during scanner stop/clear:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  }, []);

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    console.log('Scanned result:', decodedText);
    const poiMatch = decodedText.match(/\/poi\/([a-f0-9-]{36})/i);
    
    if (poiMatch) {
      const poiId = poiMatch[1];
      await stopScanner();
      triggerSuccessEffect();
      
      setTimeout(() => {
        onClose();
        router.push(`/tour?poiId=${poiId}`);
      }, 1000);
    } else {
      setError('Mã QR không hợp lệ cho ứng dụng này.');
    }
  }, [stopScanner, triggerSuccessEffect, onClose, router]);

  useEffect(() => {
    let active = true;

    const startScanner = async () => {
      if (!isOpen) return;
      await stopScanner();
      if (!active) return;
      
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;
      setIsScanning(true);
      setError(null);

      try {
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          handleScanSuccess,
          () => {} 
        );
      } catch (err) {
        if (active) {
          console.error('Failed to start scanner:', err);
          setError('Không thể truy cập camera. Vui lòng cấp quyền.');
          setIsScanning(false);
        }
      }
    };

    if (isOpen) {
      const timer = setTimeout(() => {
        startScanner();
      }, 400);
      
      return () => {
        active = false;
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      setIsScanning(false);
      setError(null);
      stopScanner();
    }
  }, [isOpen, stopScanner, handleScanSuccess]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      const html5QrCode = new Html5Qrcode('qr-reader');
      try {
        const result = await html5QrCode.scanFile(imageFile, true);
        await handleScanSuccess(result);
      } catch (err) {
        setError('Không tìm thấy mã QR trong hình ảnh này.');
      }
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">Quét mã QR</h2>
            <p className="text-sm text-zinc-500">Quét mã tại quán để nhận ưu đãi</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative aspect-square bg-black flex items-center justify-center p-4">
          <div id="qr-reader" className="w-full h-full overflow-hidden rounded-2xl border border-zinc-800"></div>
          
          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <span className="text-zinc-500 font-medium">Đang khởi động camera...</span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-8 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-white font-medium">{error}</p>
              <button 
                onClick={() => { setError(null); setIsScanning(true); }}
                className="px-6 py-2 bg-orange-500 rounded-xl font-bold text-white text-sm"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-8 flex flex-col gap-4">
          <label className="flex items-center justify-center gap-3 w-full h-14 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-bold text-white transition-all cursor-pointer active:scale-95">
            <ImageIcon className="w-5 h-5 text-zinc-400" />
            <span>Chọn từ thư viện</span>
            <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </label>
          
          <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            Hoặc đưa camera vào mã QR
          </p>
        </div>

        {/* Decoration */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-800 rounded-full opacity-50"></div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
