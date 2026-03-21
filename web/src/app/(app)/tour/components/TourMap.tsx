'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, User, Music } from 'lucide-react';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserIcon = L.divIcon({
  html: `<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
  className: 'custom-user-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const PoiIcon = L.divIcon({
  html: `<div class="bg-orange-500 p-1.5 rounded-full border-2 border-white shadow-md text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-3.1-3.5-6.5-6.5-6.5-9.5A6.5 6.5 0 1 1 18.5 11.5c0 3-3.4 6-6.5 9.5z"/><circle cx="12" cy="11" r="3"/></svg></div>`,
  className: 'custom-poi-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Component to handle map centering and auto-zoom
function MapTracker({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) {
      map.flyTo(pos, 17, { animate: true });
    }
  }, [pos, map]);
  return null;
}

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

interface TourMapProps {
  userPos: [number, number] | null;
  pois: POI[];
  onTriggerAudio: (poi: POI) => void;
}

export default function TourMap({ userPos, pois, onTriggerAudio }: TourMapProps) {
  const visitedPois = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (userPos && pois.length > 0) {
      pois.forEach((poi) => {
        // Simple geofencing: if within 25 meters and not visited in this session
        if (poi.distance <= 25 && !visitedPois.current.has(poi.id)) {
          visitedPois.current.add(poi.id);
          onTriggerAudio(poi);
        }
      });
    }
  }, [userPos, pois, onTriggerAudio]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[10.762145, 106.708145]} // Initial center at Vinh Khanh street
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {userPos && (
          <>
            <Marker position={userPos} icon={UserIcon}>
              <Popup>Vị trí của bạn</Popup>
            </Marker>
            <Circle 
                center={userPos} 
                radius={25} 
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }} 
            />
            <MapTracker pos={userPos} />
          </>
        )}

        {pois.map((poi) => (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lng]} 
            icon={PoiIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-orange-600">{poi.translation.name}</h3>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{poi.translation.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <MapPin size={12} />
                  <span>Cách bạn {poi.distance}m</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
