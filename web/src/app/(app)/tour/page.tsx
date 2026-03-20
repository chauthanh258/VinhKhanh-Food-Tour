'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Volume2, Info, Navigation, Accessibility } from 'lucide-react';
import Link from 'next/link';

import BottomNav from '@/components/BottomNav';
import PlaceList from '@/components/PlaceList';

// Dynamically import Map to avoid SSR issues
const TourMap = dynamic(() => import('@/components/TourMap'), { 
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

export default function TourPage() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [activePoi, setActivePoi] = useState<POI | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'list' | 'info'>('map');
  const [isGuidanceActive, setIsGuidanceActive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch nearby POIs
  const fetchPois = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/pois/nearby?lat=${lat}&lng=${lng}&radius=1500&lang=vi`);
      const data = await res.json();
      if (data.success) {
        setPois(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch POIs:', err);
    }
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        fetchPois(latitude, longitude);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleTriggerAudio = (poi: POI) => {
    setActivePoi(poi);
    if (audioRef.current && isGuidanceActive) {
      audioRef.current.src = poi.translation.audioUrl;
      audioRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Header Overlay */}
      {activePoi && activeView === 'map' && (
      <header className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <Link href="/" className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-white hover:bg-black/60 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
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
          />
        ) : (
          <PlaceList 
            pois={pois} 
            onSelectPoi={(poi) => {
              handleTriggerAudio(poi);
              setActiveView('map'); // Switch to map to show where it is
            }} 
            onTriggerAudio={handleTriggerAudio}
          />
        )}
      </div>

      {/* POI Info / Audio Player Overlay */}
      {activePoi && activeView === 'map' && (
        <div className="absolute bottom-24 left-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-full">Đang thuyết minh</span>
                <h2 className="text-xl font-bold mt-1">{activePoi.translation.name}</h2>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2 leading-relaxed">
                  {activePoi.translation.description}
                </p>
              </div>
              <button 
                onClick={() => setActivePoi(null)}
                className="text-zinc-500 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-1">
               <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-1/3 animate-progress transition-all"></div>
               </div>
               <button 
                  onClick={() => setIsGuidanceActive(!isGuidanceActive)}
                  className={`p-3 rounded-full transition-all ${isGuidanceActive ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
               >
                  <Volume2 className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
