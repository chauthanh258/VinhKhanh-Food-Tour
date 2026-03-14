import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/pois/nearby
// Helper function in SQLite to calculate distance (since SQLite doesn't have native advanced Math like ACOS, COS without extensions, we will do JS-side filtering for MVP locally, and Switch to Postgres raw query in Production).
app.get('/api/pois/nearby', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = '1000', lang = 'vi' } = req.query;
    
    if (!lat || !lng) {
       res.status(400).json({ success: false, error: 'Missing lat or lng' });
       return;
    }

    const startLat = parseFloat(lat as string);
    const startLng = parseFloat(lng as string);
    const searchRadius = parseInt(radius as string, 10);

    // Get all POIs and their translations for the requested language
    const allPois = await prisma.poi.findMany({
      include: {
        translations: {
          where: { language: lang as string }
        }
      }
    });

    // Haversine formula calculation in JS (for SQLite mock fallback)
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180;
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; 
    };

    // Filter and sort by distance
    const nearbyPois = allPois
      .map(poi => {
        const distance = getDistance(startLat, startLng, poi.lat, poi.lng);
        return {
          id: poi.id,
          lat: poi.lat,
          lng: poi.lng,
          rating: poi.rating,
          distance: Math.round(distance),
          translation: poi.translations[0] || null
        };
      })
      .filter(poi => poi.distance <= searchRadius && poi.translation)
      .sort((a, b) => a.distance - b.distance);

    res.json({ success: true, count: nearbyPois.length, data: nearbyPois });
  } catch (error) {
    console.error('Error fetching nearby POIs:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});
