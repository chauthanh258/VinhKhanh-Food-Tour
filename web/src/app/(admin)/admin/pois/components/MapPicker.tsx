'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  radius?: number; // Optional: Show geofence
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Sub-component to handle map clicks
function LocationMarker({ position, onLocationSelect }: { position: [number, number], onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: any) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  // Fix default marker icon issues in Leaflet with Next.js
  const [icon, setIcon] = useState<any>(null);
  useEffect(() => {
    import('leaflet').then((L) => {
      setIcon(
        L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    });
  }, []);

  return position && icon ? <Marker position={position} icon={icon} /> : null;
}

// Vĩnh Khánh Food Tour - TP.HCM default coordinates
const DEFAULT_LAT = 10.7629;
const DEFAULT_LNG = 106.6630;

export default function MapPicker({ latitude, longitude, radius, onLocationSelect }: MapPickerProps) {
  const position: [number, number] = [latitude || DEFAULT_LAT, longitude || DEFAULT_LNG];

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-border z-0 relative">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onLocationSelect={onLocationSelect} />
        {radius && (
          <Circle 
            center={position} 
            radius={radius} 
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2 }} 
          />
        )}
      </MapContainer>
      {onLocationSelect && (
        <div className="absolute top-2 right-2 bg-secondary/90 px-3 py-1.5 rounded-md text-xs font-medium z-[1000] shadow-sm pointer-events-none">
          Click trên bản đồ để chọn điểm
        </div>
      )}
    </div>
  );
}
