'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX, ChevronDown, MapPin, Star, DollarSign, Utensils, Play, Pause, SkipForward, ChevronUp, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

import PlaceList from '@/app/(app)/tour/components/PlaceList';
import { useUserStore } from '@/store/userStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const TourMap = dynamic(() => import('@/app/(app)/tour/components/TourMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500 font-medium">Đang tải bản đồ...</div>
});

interface POI {
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
interface DrawerProps {
  poi: POI;
  isGuidanceActive: boolean;
  onToggleGuidance: () => void;
  onClose: () => void;
  onSkip: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

function PoiAudioDrawer({ poi, isGuidanceActive, onToggleGuidance, onClose, onSkip, audioRef }: DrawerProps) {
  const [drawerState, setDrawerState] = useState<'peek' | 'full'>('peek'); // peek = mini bar, full = expanded
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Sync playing state with audio element
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

  // Touch/drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientY - dragStartY;
    setDragOffset(Math.max(0, delta)); // only allow dragging down
  }, [isDragging, dragStartY]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (drawerState === 'full') {
      if (dragOffset > 120) {
        setDrawerState('peek');
      }
    } else {
      if (dragOffset < -60) {
        setDrawerState('full');
      }
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

  // Translate drawer states to translateY
  const peekHeight = 96; // px visible when peeked
  const fullOffset = 0;
  const baseTranslate = drawerState === 'full' ? fullOffset : 0;
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
      {/* Full Expanded Drawer */}
      {(drawerState === 'full' && <div className='h-screen' onClick={() => setDrawerState('peek')}></div >)}
      <div
        className="relative rounded-t-[28px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #18181b 0%, #0f0f10 100%)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
          maxHeight: drawerState === 'full' ? '80vh' : `${peekHeight}px`,
          transition: isDragging ? 'none' : 'max-height 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={handleHandleTap}
        >
          <div className="w-10 h-1 rounded-full bg-zinc-600 mb-1" />
        </div>

        {/* ── Peek Bar (always visible) ── */}
        <div className="px-4 pb-3 flex items-center gap-3" onClick={handleHandleTap}>
          {/* Thumbnail */}
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
            {poi.translation.imageUrl ? (
              <img src={poi.translation.imageUrl} alt={poi.translation.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-zinc-500" />
              </div>
            )}
            {/* Live pulse */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-orange-500">
              <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
            </div>
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-0.5">Đang thuyết minh</p>
            <h2 className="text-base font-bold text-white truncate leading-tight">{poi.translation.name}</h2>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
              className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>
            {/* <button
              onClick={(e) => { e.stopPropagation(); onToggleGuidance(); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${isGuidanceActive ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}
            >
              {isGuidanceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button> */}
            {drawerState === 'peek' && (<button
              onClick={(e) => { onSkip(); }}
              className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>)}
            {drawerState === 'full' && (<button
              onClick={(e) => { e.stopPropagation(); handleHandleTap(); }}
              className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>)}
          </div>
        </div>

        {/* Progress bar (peek) */}
        {/* {drawerState === 'peek' && (
          <div className="px-4 pb-3">
            <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )} */}

        {/* ── Expanded Content ── */}
        {drawerState === 'full' && (
          <div
            className="overflow-y-auto overscroll-contain"
            style={{ maxHeight: 'calc(80vh - 110px)' }}
          >
            {/* Hero image 4x4 */}
            <div className="mx-4 mb-4 rounded-2xl overflow-hidden h-[200px] bg-zinc-800 relative">
              {poi.translation.imageUrl ? (
                <img src={poi.translation.imageUrl} alt={poi.translation.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-zinc-600">
                  <MapPin className="w-10 h-10" />
                  <span className="text-sm">Không có ảnh</span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Distance badge */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-semibold text-white">{poi.distance < 1000 ? `${Math.round(poi.distance)}m` : `${(poi.distance/1000).toFixed(1)}km`}</span>
              </div>
            </div>

            {/* Info */}
            <div className="px-4 mb-4">
              <h2 className="text-2xl font-bold text-white mb-1 leading-tight">{poi.translation.name}</h2>

              {/* Meta badges */}
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

              {/* Description - scrollable */}
              <div className="relative">
                <div
                  className="overflow-y-auto min-h-48 max-h-60 pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <p
                    ref={descRef}
                    className="text-zinc-400 text-sm leading-relaxed"
                  >
                    {poi.translation.description}
                    {poi.translation.description}
                    {poi.translation.description}
                    {poi.translation.description}
                    {poi.translation.description}
                    {poi.translation.description}
                    {poi.translation.description}
                    {poi.translation.description}
                  </p>
                </div>
                {/* Fade bottom hint */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Audio Player */}
            <div className="mx-4 mb-6 bg-zinc-800/60 border border-white/8 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Thuyết minh âm thanh</p>

              {/* Seek bar */}
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

              {/* Controls */}
              <div className="flex items-center justify-center">
                {/* <button
                  onClick={onToggleGuidance}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isGuidanceActive
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-zinc-700/50 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  {isGuidanceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  {isGuidanceActive ? 'Bật' : 'Tắt'}
                </button> */}

                <button
                  onClick={togglePlayPause}
                  className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/40 active:scale-95 transition-transform"
                >
                  {isPlaying
                    ? <Pause className="w-6 h-6 text-white" />
                    : <Play className="w-6 h-6 text-white ml-1" />
                  }
                </button>

                {/* <button
                  onClick={onSkip}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-700/50 border border-zinc-700 text-xs font-semibold text-zinc-400 transition-all active:scale-95"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Bỏ qua
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mini Reopen Button ──────────────────────────────────────────────────────
function ReopenButton({ poi, onClick }: { poi: POI; onClick: () => void }) {
  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClick}
        className="flex items-center gap-3 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-full pl-2 pr-5 py-2 shadow-2xl active:scale-95 transition-all"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-orange-500/40">
          {poi.translation.imageUrl ? (
            <img src={poi.translation.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-orange-500" />
            </div>
          )}
        </div>
        <div className="text-left">
          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Đang thuyết minh</p>
          <p className="text-xs text-white font-semibold max-w-[140px] truncate">{poi.translation.name}</p>
        </div>
        <ChevronUp className="w-4 h-4 text-zinc-400 ml-1" />
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function TourPageContent() {
  const language = useUserStore((s) => s.language);
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeView = searchParams.get('view') || 'map';
  
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [activePoi, setActivePoi] = useState<POI | null>(null);
  const [isGuidanceActive, setIsGuidanceActive] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false); // user manually closed
  
  const [audioQueue, setAudioQueue] = useState<POI[]>([]);
  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchPois = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `${API_BASE}/pois?lat=${lat}&lng=${lng}&radius=1500&lang=${encodeURIComponent(language)}`
      );
      const data = await res.json();
      if (data.success) {
        setPois(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch POIs:', err);
    }
  }, [language]);

  //Ham lay vi tri nguoi dung
  // useEffect(() => {
  //   if (!('geolocation' in navigator)) {
  //     alert('Trình duyệt không hỗ trợ GPS');
  //     return;
  //   }

  //   let lastUpdate = 0;
  //   const watchId = navigator.geolocation.watchPosition(
  //     (pos) => {
  //       const now = Date.now();
  //       if (now - lastUpdate > 3000) {
  //         const { latitude, longitude } = pos.coords;
  //         setUserPos([latitude, longitude]);
  //         lastUpdate = now;
  //       }
  //     },
  //     (err) => {
  //       const errorMessages = {
  //         [err.PERMISSION_DENIED]: "Người dùng từ chối quyền truy cập GPS",
  //         [err.POSITION_UNAVAILABLE]: "Không thể xác định vị trí",
  //         [err.TIMEOUT]: "Lấy vị trí quá hạn (Timeout)"
  //       };
  //       console.error('Geolocation error:', errorMessages[err.code as keyof typeof errorMessages] || err.message);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       // maximumAge: 30000,
  //       // timeout: 15000
  //     }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);

  // Ham lay vi tri nguoi dung click vao ban do để demo
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setUserPos([lat, lng]);
  }, []);
  
  
  useEffect(() => {
    if (!userPos) return;
    fetchPois(userPos[0], userPos[1]);
  }, [userPos, language, fetchPois]);

  const handleTriggerAudio = useCallback((poi: POI, forcePlay: boolean = false) => {
    if (!isGuidanceActive) return;
    setDrawerVisible(true); // auto-open drawer when triggered

    if (forcePlay) {
      if (audioRef.current) audioRef.current.pause();
      isPlayingRef.current = false;
      setAudioQueue([poi]); 
    } else {
      setAudioQueue((prev: POI[]) => {
        if (activePoi?.id === poi.id && isPlayingRef.current) return prev;
        if (prev.find((p: POI) => p.id === poi.id)) return prev;
        return [...prev, poi];
      });
    }
  }, [activePoi, isGuidanceActive]);

  useEffect(() => {
    if (audioQueue.length > 0 && !isPlayingRef.current && isGuidanceActive) {
      isPlayingRef.current = true;
      const nextPoi = audioQueue[0];
      setAudioQueue((prev: POI[]) => prev.slice(1));
      
      const playTts = async () => {
        setActivePoi(nextPoi);
        setDrawerVisible(true);
        const audio = audioRef.current;
        if (!audio) {
          isPlayingRef.current = false;
          setAudioQueue((prev) => [...prev]); 
          return;
        }

        const next = () => {
          isPlayingRef.current = false;
          setAudioQueue((prev) => [...prev]); 
        };

        audio.onended = next;
        audio.onerror = next;

        try {
          const res = await fetch(`${API_BASE}/pois/${nextPoi.id}/translate-tts?lang=${encodeURIComponent(language)}`);
          if (res.ok) {
            const data = await res.json();
            setActivePoi((prev) => {
               if (!prev || prev.id !== nextPoi.id) return prev;
               return { ...prev, translation: { ...prev.translation, description: data.data.text } };
            });
            audio.src = data.data.audioBase64;
            await audio.play().catch((e) => {
              console.warn('Autoplay blocked:', e);
              next();
            });
          } else {
            next();
          }
        } catch(e) {
          console.warn('Failed to fetch TTS:', e);
          next();
        }
      };

      void playTts();
    }
  }, [audioQueue, isGuidanceActive, language]);

  const handleSkip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isPlayingRef.current = false;
    setActivePoi(null);
    setAudioQueue((prev) => [...prev]);
  }, []);

  const showDrawer = activePoi && activeView === 'map' && drawerVisible;
  const showReopenBtn = activePoi && activeView === 'map' && !drawerVisible;

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-black text-white overflow-hidden">
      {/* Header Overlay */}
      {activeView === 'map' && (
        <header className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
          <div className="flex items-center justify-end pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">GPS Active</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col">
        {activeView === 'map' ? (
          <TourMap 
            userPos={userPos} 
            pois={pois} 
            onTriggerAudio={handleTriggerAudio} 
            onMapClick={handleMapClick}
          />
        ) : (
          <PlaceList 
            pois={pois} 
            onSelectPoi={(poi) => {
              handleTriggerAudio(poi, true);
              router.push('/tour'); 
            }} 
            onTriggerAudio={(poi) => handleTriggerAudio(poi, true)}
          />
        )}
      </div>

      {/* POI Audio Drawer */}
      {showDrawer && (
        <PoiAudioDrawer
          poi={activePoi}
          isGuidanceActive={isGuidanceActive}
          onToggleGuidance={() => setIsGuidanceActive(v => !v)}
          onClose={() => setDrawerVisible(false)}
          onSkip={handleSkip}
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
        />
      )}

      {/* Reopen Button */}
      {showReopenBtn && (
        <ReopenButton poi={activePoi} onClick={() => setDrawerVisible(true)} />
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
}

export default function TourPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-72px)] items-center justify-center bg-black text-zinc-400">Loading tour...</div>}>
      <TourPageContent />
    </Suspense>
  );
}