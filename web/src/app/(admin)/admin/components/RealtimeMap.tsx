'use client';

import React, { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import HeatmapLayer from './HeatmapLayer';
import { api } from '@/lib/api';
import { Badge } from '../../components/shared-components';

const DEFAULT_LAT = 10.7629;
const DEFAULT_LNG = 106.6630;

// Reusing POI Pin Icon from TourMap for consistency
const PoiIcon = typeof window !== 'undefined' ? L.divIcon({
  html: `<div class="bg-orange-500 p-1.5 rounded-full border-2 border-white shadow-md text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-3.1-3.5-6.5-6.5-6.5-9.5A6.5 6.5 0 1 1 18.5 11.5c0 3-3.4 6-6.5 9.5z"/><circle cx="12" cy="11" r="3"/></svg></div>`,
  className: 'custom-poi-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
}) : null;

const RealtimeMap = () => {
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const [presenceData, setPresenceData] = useState<any[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      try {
        const [heatmapRes, presenceRes, poisRes] = await Promise.all([
          api.get('/location/heatmap?minutes=1'),
          api.get('/location/presence?minutes=1'),
          api.get('/admin/pois')
        ]);
        
        const locations = heatmapRes.data || [];
        const hData = locations.map((loc: any) => [loc.lat, loc.lng, 1] as [number, number, number]);
        
        const presData = presenceRes.data || [];
        const poisList = poisRes.data?.pois || [];

        setHeatmapData(hData);
        setPresenceData(presData);
        setPois(poisList);
      } catch (err) {
        console.error("Failed to fetch map data", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="h-[400px] w-full rounded-lg bg-zinc-900/50 flex items-center justify-center border border-white/5">
        <span className="text-zinc-400 text-sm animate-pulse">Đang chuẩn bị bản đồ...</span>
      </div>
    );
  }

  return (
    <div id="realtime-map-wrapper" className="h-[400px] w-full rounded-lg overflow-hidden border border-border z-0 relative">
      <MapContainer 
        key="admin-map-final"
        center={[DEFAULT_LAT, DEFAULT_LNG]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {heatmapData.length > 0 && <HeatmapLayer points={heatmapData} />}
        
        {pois.map((poi: any) => {
          const presence = presenceData.find(p => p.poiId === poi.id);
          const count = presence ? presence.userCount : 0;
          const translation = poi.translations?.[0] || {};
          
          if (!PoiIcon) return null;

          return (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={PoiIcon}>
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-orange-600">{translation.name || 'POI'}</h3>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <MapPin size={12} />
                      <span>Thực tế hiện tại:</span>
                    </div>
                    <Badge variant={count > 0 ? "success" : "default"}>{count} người</Badge>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-[1000]">
        <div className="bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
          Live Heatmap (30m)
        </div>
      </div>
    </div>
  );
};

export default memo(RealtimeMap);
