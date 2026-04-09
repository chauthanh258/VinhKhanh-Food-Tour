'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ChevronDown, MapPin, Star, DollarSign, Utensils, Play, Pause, SkipForward, ChevronUp, X } from 'lucide-react';

export interface POI {
  id: string;
  lat: number;
  lng: number;
  rating: number;
  distance: number;
  translation: {
    name: string;
    description: string;
    specialties: string;
    priceRange: string;
    audioUrl: string;
    imageUrl: string;
  };
}

// ─── POI Audio Drawer ───────────────────────────────────────────────────────
export interface DrawerProps {
  poi: POI;
  isGuidanceActive: boolean;
  onToggleGuidance: () => void;
  onClose: () => void;
  onSkip: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export function PoiAudioDrawer({ poi, isGuidanceActive, onToggleGuidance, onClose, onSkip, audioRef }: DrawerProps) {
  const [drawerState, setDrawerState] = useState<'peek' | 'full'>('peek');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioRef]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientY - dragStartY;
    setDragOffset(Math.max(0, delta));
  }, [isDragging, dragStartY]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (drawerState === 'full') {
      if (dragOffset > 120) setDrawerState('peek');
    } else {
      if (dragOffset < -60) setDrawerState('full');
    }
    setDragOffset(0);
  }, [isDragging, dragOffset, drawerState]);

  const handleHandleTap = () => {
    if (!isDragging || dragOffset < 5) {
      setDrawerState(s => s === 'peek' ? 'full' : 'peek');
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(console.warn);
    } else {
      audio.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;
    const t = (parseFloat(e.target.value) / 100) * audioDuration;
    audio.currentTime = t;
    setAudioProgress(t);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct = audioDuration ? (audioProgress / audioDuration) * 100 : 0;
  const translateY = isDragging ? Math.max(0, dragOffset) : 0;

  return (
    <div
      ref={drawerRef}
      className="absolute bottom-16 left-0 right-0 z-50"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {drawerState === 'full' && <div className='h-screen absolute inset-0 -top-[100vh]' onClick={() => setDrawerState('peek')} />}
      <div
        className="relative rounded-t-[28px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #18181b 0%, #0f0f10 100%)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
          maxHeight: drawerState === 'full' ? '80vh' : '96px',
          transition: isDragging ? 'none' : 'max-height 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={handleHandleTap}
        >
          <div className="w-60 h-1 rounded-full bg-zinc-600 mb-1" />
        </div>

        <div className="px-4 pb-3 flex items-center gap-3" onClick={handleHandleTap}>
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10">
            {poi.translation.imageUrl ? (
              <img src={poi.translation.imageUrl} alt={poi.translation.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-zinc-500" />
              </div>
            )}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-orange-500">
              <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-0.5">Đang thuyết minh</p>
            <h2 className="text-base font-bold text-white truncate leading-tight">{poi.translation.name}</h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
              className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>
            {drawerState === 'peek' && (
              <button
                onClick={(e) => { e.stopPropagation(); onSkip(); }}
                className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            {drawerState === 'full' && (
              <button
                onClick={(e) => { e.stopPropagation(); setDrawerState('peek'); }}
                className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>
        </div>

        {drawerState === 'full' && (
          <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(80vh - 110px)' }}>
            <div className="mx-4 mb-4 rounded-2xl overflow-hidden h-[200px] bg-zinc-800 relative">
              {poi.translation.imageUrl ? (
                <img src={poi.translation.imageUrl} alt={poi.translation.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-zinc-600">
                  <MapPin className="w-10 h-10" />
                  <span className="text-sm">Không có ảnh</span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-semibold text-white">{poi.distance < 1000 ? `${Math.round(poi.distance)}m` : `${(poi.distance/1000).toFixed(1)}km`}</span>
              </div>
            </div>

            <div className="px-4 mb-4">
              <h2 className="text-2xl font-bold text-white mb-1 leading-tight">{poi.translation.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {poi.rating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">{poi.rating}</span>
                  </div>
                )}
                {poi.translation.priceRange && (
                  <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-semibold text-green-400">{poi.translation.priceRange}</span>
                  </div>
                )}
                {poi.translation.specialties && (
                  <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                    <Utensils className="w-3 h-3 text-orange-400" />
                    <span className="text-xs font-semibold text-orange-400 truncate max-w-[120px]">{poi.translation.specialties}</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="overflow-y-auto py-6 max-h-60 pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin' }}>
                  <p className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest mb-2">Mô tả</p>
                  <p ref={descRef} className="text-zinc-400 text-sm leading-relaxed">{poi.translation.description}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-zinc-950 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="mx-4 mb-6 bg-zinc-800/60 border border-white/8 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Thuyết minh âm thanh</p>
              <div className="mb-2 relative">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progressPct}
                  onChange={handleSeek}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #f97316 ${progressPct}%, #3f3f46 ${progressPct}%)`,
                    accentColor: '#f97316',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 mb-4">
                <span>{formatTime(audioProgress)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/40 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}