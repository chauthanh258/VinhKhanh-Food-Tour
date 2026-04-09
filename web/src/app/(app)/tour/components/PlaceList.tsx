'use client';

import { useState } from 'react';
import { MapPin, Volume2, ChevronRight, Star, UtensilsCrossed, Tag } from 'lucide-react';
import Image from 'next/image';
import PlaceDetail from './PlaceDetail';

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
    audioUrl?: string;
    imageUrl?: string;
  };
}

interface PlaceListProps {
  pois: POI[];
  onSelectPoi: (poi: POI) => void;
  onTriggerAudio: (poi: POI) => void;
}

export default function PlaceList({ pois, onSelectPoi, onTriggerAudio }: PlaceListProps) {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Scrollable List Container */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Food Tour</h2>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Khám phá ẩm thực Vĩnh Khánh</p>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full uppercase tracking-widest leading-none py-1.5">
               {pois.length} quán ăn
             </span>
          </div>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="grid gap-5">
          {pois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => setSelectedPoi(poi)}
              className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-zinc-800/60 transition-all duration-300"
            >
              {/* Top Image Section */}
              <div className="relative w-full h-48 bg-zinc-800 overflow-hidden">
                <Image 
                  src={poi.translation.imageUrl || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"} 
                  alt={poi.translation.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-xl">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{poi.rating || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <MapPin size={12} className="text-orange-500" />
                    <span className="text-xs font-bold text-white">{poi.distance}m</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                   <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-1">
                     {poi.translation.name}
                   </h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-zinc-400">
                    <UtensilsCrossed size={14} className="mt-1 flex-shrink-0 text-orange-500/80" />
                    <p className="text-sm font-medium leading-relaxed italic line-clamp-2">
                      {poi.translation.specialties || "Trải nghiệm ẩm thực địa phương"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Tag size={14} className="flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      {poi.translation.priceRange || "Giá vỉa hè"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/10">
                      <Volume2 size={16} className="text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sẵn sàng thuyết minh</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <ChevronRight size={20} className="text-zinc-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {pois.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
            <div className="p-6 rounded-full bg-zinc-900/50 grayscale opacity-50">
              <MapPin size={40} />
            </div>
            <p className="text-sm font-medium uppercase tracking-widest">Đang tìm quán ăn xung quanh...</p>
          </div>
        )}
      </div>

      {/* Place Detail Modal/Drawer */}
      <PlaceDetail 
        poi={selectedPoi}
        onClose={() => setSelectedPoi(null)}
        onViewOnMap={(poi) => {
          setSelectedPoi(null);
          onSelectPoi(poi);
        }}
        onPlayAudio={(poi) => {
          onTriggerAudio(poi);
        }}
      />
    </div>
  );
}
