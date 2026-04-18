import prisma from '../utils/prisma';
import { AppError } from '../middlewares/error.middleware';

// Haversine formula to calculate distance between two coordinates in meters
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const saveLocation = async (lat: number, lng: number, userId?: string) => {
  return prisma.userLocation.create({
    data: {
      lat,
      lng,
      userId: userId || null
    }
  });
};

export const getHeatmapData = async (minutes: number = 30) => {
  const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
  
  const locations = await prisma.userLocation.findMany({
    where: {
      createdAt: {
        gte: cutoffTime
      }
    },
    select: {
      lat: true,
      lng: true
    }
  });
  
  return locations;
};

export const getPoiPresence = async (minutes: number = 30, radiusMeters: number = 50) => {
  const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
  
  // Get active POIs
  const pois = await prisma.pOI.findMany({
    where: { isActive: true, deletedAt: null },
    select: { id: true, lat: true, lng: true }
  });
  
  // Get recent locations
  const recentLocations = await prisma.userLocation.findMany({
    where: { createdAt: { gte: cutoffTime } },
    select: { lat: true, lng: true, userId: true, id: true }
  });
  
  // Calculate presence per POI
  const presenceStats = pois.map(poi => {
    let count = 0;
    for (const loc of recentLocations) {
      const distance = calculateDistance(poi.lat, poi.lng, loc.lat, loc.lng);
      if (distance <= radiusMeters) {
        count++;
      }
    }
    return {
      poiId: poi.id,
      userCount: count
    };
  });
  
  return presenceStats;
};
