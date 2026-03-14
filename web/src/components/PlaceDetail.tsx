'use client';

import { X, MapPin, Star, Volume2, UtensilsCrossed, Tag, Info, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

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

interface PlaceDetailProps {
  poi: POI | null;
  onClose: () => void;
  onViewOnMap: (poi: POI) => void;
  onPlayAudio: (poi: POI) => void;
}

export default function PlaceDetail({ poi, onClose, onViewOnMap, onPlayAudio }: PlaceDetailProps) {
  if (!poi) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Detail Panel */}
      <div className="relative w-full max-w-lg bg-zinc-950 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] flex flex-col">
        
        {/* Header/Image Section */}
        <div className="relative h-64 w-full flex-shrink-0 bg-zinc-900">
           <Image 
             src={poi.translation.imageUrl || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"} 
             alt={poi.translation.name}
             fill
             className="object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
           
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto space-y-6">
           <div className="space-y-2">
             <div className="flex items-center gap-2">
               <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-orange-500/20">
                 Quận 4 • Vĩnh Khánh
               </span>
               <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/10">
                 <Star size={10} className="fill-yellow-500" />
                 <span className="text-[10px] font-bold">{poi.rating}</span>
               </div>
             </div>
             <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
               {poi.translation.name}
             </h2>
             <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <MapPin size={14} className="text-orange-500" />
                <span>Cách bạn {poi.distance}m</span>
             </div>
           </div>

           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-start gap-3 text-zinc-300">
                 <UtensilsCrossed size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                 <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Món ăn đặc sắc</h4>
                    <p className="text-sm font-medium italic leading-relaxed">
                       {poi.translation.specialties}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-3 text-zinc-300">
                 <Tag size={18} className="text-orange-500 flex-shrink-0" />
                 <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Giá ước tính</h4>
                    <p className="text-sm font-bold text-white">
                       {poi.translation.priceRange}
                    </p>
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-400">
                 <Info size={16} className="text-orange-500" />
                 <h4 className="text-sm font-bold uppercase tracking-widest">Giới thiệu</h4>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                 {poi.translation.description}
              </p>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-900/50 border-t border-white/5 flex gap-3 flex-shrink-0">
           <button 
             onClick={() => onPlayAudio(poi)}
             className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
           >
             <Volume2 size={20} />
             Nghe thuyết minh
           </button>
           <button 
             onClick={() => onViewOnMap(poi)}
             className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 transition-colors"
             title="Xem trên bản đồ"
           >
             <MapPin size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
