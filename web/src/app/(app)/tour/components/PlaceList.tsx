'use client';

import { useState, useMemo, useEffect } from 'react';
import { MapPin, Volume2, ChevronRight, Star, UtensilsCrossed, Tag, Search } from 'lucide-react';
import PlaceDetail from './PlaceDetail';
import { useTranslation } from '@/i18n';

interface POI {
  id: string;
  lat: number;
  lng: number;
  rating: number;
  distance: number;
  categoryId?: string;
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

interface Category {
  id: string;
  translations: { name: string; language: string }[];
}

export default function PlaceList({ pois, onSelectPoi, onTriggerAudio }: PlaceListProps) {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const t = useTranslation();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/categories?includeInactive=false`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        }
      })
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  const filteredPois = useMemo(() => {
    return pois.filter(poi => {
      const tr = poi.translation;
      const searchStr = `${tr.name} ${tr.specialties || ''}`.toLowerCase();
      
      if (searchQuery && !searchStr.includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (activeCategory !== 'all' && poi.categoryId !== activeCategory) {
        return false;
      }
      
      return true;
    });
  }, [pois, searchQuery, activeCategory]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header and Controls */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{t.placeList.title}</h2>
            <p className="text-zinc-500 text-sm mt-1 font-medium">{t.placeList.subtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full uppercase tracking-widest leading-none py-1.5">
               {t.placeList.placesCount(filteredPois.length)}
             </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-white/10 rounded-2xl bg-zinc-900/60 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-md transition-all font-medium"
            placeholder={t.placeList.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories (Combobox) */}
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full appearance-none bg-zinc-900/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-md transition-all cursor-pointer"
          >
            <option value="all">{t.placeList.allCategories}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.translations?.[0]?.name || t.placeList.unknownCategory}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <ChevronRight className="h-5 w-5 text-zinc-500 rotate-90" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">

        <div className="grid gap-5">
          {filteredPois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => setSelectedPoi(poi)}
              className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-zinc-800/60 transition-all duration-300"
            >
              {/* Top Image Section */}
              <div className="relative w-full h-48 bg-zinc-800 overflow-hidden">
                <img 
                  src={poi.translation.imageUrl || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"} 
                  alt={poi.translation.name}
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
                      {poi.translation.specialties || t.placeList.defaultSpecialties}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Tag size={14} className="flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      {poi.translation.priceRange || t.placeList.defaultPrice}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/10">
                      <Volume2 size={16} className="text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.placeList.readyToGuide}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <ChevronRight size={20} className="text-zinc-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredPois.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
            <div className="p-6 rounded-full bg-zinc-900/50 grayscale opacity-50">
              <MapPin size={40} />
            </div>
            <p className="text-sm font-medium uppercase tracking-widest">{t.placeList.searchingNearby}</p>
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
