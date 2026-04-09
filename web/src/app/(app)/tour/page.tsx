'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Navigation, MousePointer2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

import PlaceList from '@/app/(app)/tour/components/PlaceList';
import { useUserStore } from '@/store/userStore';
import { PoiAudioDrawer, ReopenButton, type POI } from '@/app/(app)/tour/components/PoiAudioDrawer';

const API_BASE = 'http://localhost:3001';

const TourMap = dynamic(() => import('@/app/(app)/tour/components/TourMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500 font-medium">Đang tải bản đồ...</div>
});

// ─── Tour Page ─────────────────────────────────────────────────────────────
export default function TourPage() {
  const language = useUserStore((s) => s.language);
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeView = searchParams.get('view') || 'map';
  
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [activePoi, setActivePoi] = useState<POI | null>(null);
  const [isGuidanceActive, setIsGuidanceActive] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'auto' | 'manual'>('auto');
  const watchIdRef = useRef<number | null>(null);
  
  const [audioQueue, setAudioQueue] = useState<POI[]>([]);
  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchPois = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/pois?lat=${lat}&lng=${lng}&radius=1500&lang=${encodeURIComponent(language)}`);
      const data = await res.json();
      if (data.success) setPois(data.data);
    } catch (err) {
      console.error('Failed to fetch POIs:', err);
    }
  }, [language]);

  useEffect(() => {
    if (trackingMode !== 'auto') {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser");
      setTrackingMode('manual');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setTrackingMode('manual');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [trackingMode]);

  const handleTriggerAudio = useCallback((poi: POI, forcePlay = false) => {
    if (!isGuidanceActive) return;
    setDrawerVisible(true);
    if (forcePlay) {
      if (audioRef.current) audioRef.current.pause();
      isPlayingRef.current = false;
      setAudioQueue([poi]);
    } else {
      setAudioQueue((prev: POI[]) => {
        if (activePoi?.id === poi.id && isPlayingRef.current) return prev;
        if (prev.find(p => p.id === poi.id)) return prev;
        return [...prev, poi];
      });
    }
  }, [activePoi, isGuidanceActive]);

  useEffect(() => {
    if (!userPos) return;
    fetchPois(userPos[0], userPos[1]);
  }, [userPos, language, fetchPois]);

  useEffect(() => {
    const poiId = searchParams.get('poiId');
    if (poiId && pois.length > 0) {
      const targetPoi = pois.find(p => p.id === poiId);
      if (targetPoi && (!activePoi || activePoi.id !== poiId)) {
        handleTriggerAudio(targetPoi, true);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('poiId');
        router.replace(`/tour?${newParams.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, pois, activePoi, handleTriggerAudio, router]);

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
          return;
        }

        const next = () => {
          isPlayingRef.current = false;
          setAudioQueue(prev => [...prev]);
        };

        audio.onended = next;
        audio.onerror = next;

        try {
          const res = await fetch(`${API_BASE}/api/pois/${nextPoi.id}/translate-tts?lang=${encodeURIComponent(language)}`);
          if (res.ok) {
            const data = await res.json();
            setActivePoi(prev => {
               if (!prev || prev.id !== nextPoi.id) return prev;
               return { ...prev, translation: { ...prev.translation, description: data.data.text } };
            });
            audio.src = data.data.audioBase64;
            await audio.play().catch(next);
          } else {
            next();
          }
        } catch(e) {
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
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setTrackingMode('manual');
    setUserPos([lat, lng]);
  }, []);

  const showDrawer = activePoi && activeView === 'map' && drawerVisible;
  const showReopenBtn = activePoi && activeView === 'map' && !drawerVisible;

  return (
    <div className="relative h-dvh pb-16 bg-black text-white overflow-hidden flex flex-col">
      {activeView === 'map' && (
        <header className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
          <div className="flex items-center justify-end pointer-events-auto">
            <button
              onClick={() => setTrackingMode(prev => prev === 'auto' ? 'manual' : 'auto')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md transition-all active:scale-95 ${
                trackingMode === 'auto'
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-zinc-900/80 border-white/10 text-white'
              }`}
            >
              {trackingMode === 'auto' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <Navigation className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">GPS: Auto</span>
                </>
              ) : (
                <>
                  <MousePointer2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Manual Click</span>
                </>
              )}
            </button>
          </div>
        </header>
      )}

      <div className="flex-1 relative flex flex-col">
        {activeView === 'map' ? (
          <TourMap userPos={userPos} pois={pois} onTriggerAudio={handleTriggerAudio} onMapClick={handleMapClick} />
        ) : (
          <PlaceList 
            pois={pois} 
            onSelectPoi={(poi) => { handleTriggerAudio(poi, true); router.push('/tour'); }} 
            onTriggerAudio={(poi) => handleTriggerAudio(poi, true)} 
          />
        )}
      </div>

      {showDrawer && activePoi && (
        <PoiAudioDrawer
          poi={activePoi}
          isGuidanceActive={isGuidanceActive}
          onToggleGuidance={() => setIsGuidanceActive(v => !v)}
          onClose={() => setDrawerVisible(false)}
          onSkip={handleSkip}
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
        />
      )}

      {/* {showReopenBtn && activePoi && (
        <ReopenButton poi={activePoi} onClick={() => setDrawerVisible(true)} />
      )} */}

      <audio ref={audioRef} />
    </div>
  );
}