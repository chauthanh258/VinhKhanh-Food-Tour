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
    map.setView(center, map.getZoom(), { animate: false });
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
