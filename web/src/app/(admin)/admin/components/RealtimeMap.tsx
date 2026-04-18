'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeatmapLayer from './HeatmapLayer';
import { api } from '@/lib/api';
import { Badge } from '../../components/shared-components';

const DEFAULT_LAT = 10.7629;
const DEFAULT_LNG = 106.6630;

export default function RealtimeMap() {
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const [presenceData, setPresenceData] = useState<any[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heatmapRes, presenceRes, poisRes] = await Promise.all([
          api.get('/location/heatmap?minutes=1'),
          api.get('/location/presence?minutes=1'),
          api.get('/admin/pois')
        ]);
        
        const hData = heatmapRes.data.map((loc: any) => [loc.lat, loc.lng, 1]);
        console.log("hData", hData);
        console.log("presenceRes.data", presenceRes.data);
        console.log("poisRes.data.pois", poisRes.data.pois);
        setHeatmapData(hData);
        setPresenceData(presenceRes.data || []);
        setPois(poisRes.data.pois || []);
      } catch (err) {
        console.error("Failed to fetch map data", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const [icon, setIcon] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        setIcon(
          L.divIcon({
            className: 'custom-poi-marker',
            html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        );
      });
    }
  }, []);

  if (!mounted) return <div className="h-[400px] w-full rounded-lg bg-muted flex items-center justify-center animate-pulse">Đang tải bản đồ...</div>;

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border z-0 relative">
      <MapContainer center={[DEFAULT_LAT, DEFAULT_LNG]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {heatmapData.length > 0 && <HeatmapLayer points={heatmapData} />}
        
        {icon && pois.map((poi: any) => {
          const presence = presenceData.find(p => p.poiId === poi.id);
          const count = presence ? presence.userCount : 0;
          
          return (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={icon}>
              <Popup>
                <div className="font-medium text-sm mb-1">{poi.translations?.[0]?.name || 'POI'}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Người xung quanh:</span>
                  <Badge variant={count > 0 ? "success" : "default"}>{count}</Badge>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
