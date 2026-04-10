"use client";

import { useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";

export type PoiMiniMapSyncProps = {
  center: [number, number];
  editable?: boolean;
  onPick?: (lat: number, lng: number) => void;
};

export default function PoiMiniMapSync({
  center,
  editable = false,
  onPick,
}: PoiMiniMapSyncProps) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    const applyCenter = () => {
      // Leaflet inside modal may calculate an incorrect viewport until size is invalidated.
      map.invalidateSize();
      const targetZoom = Math.max(map.getZoom(), 15);
      map.setView(center, targetZoom, { animate: false });
    };

    const timer = window.setTimeout(applyCenter, 80);
    return () => window.clearTimeout(timer);
  }, [map, center]);

  useMapEvents({
    click: (event) => {
      if (!editable) return;
      const { lat, lng } = event.latlng;
      onPick?.(lat, lng);
    },
  });

  return null;
}
