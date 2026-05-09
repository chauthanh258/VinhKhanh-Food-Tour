import prisma from '../utils/prisma';

// ─── Constants ────────────────────────────────────────────────────────────────
const ONLINE_WINDOW_MINUTES = 5;
const GRID_RESOLUTION = 0.001; // ~100 m per cell

// ─── 1. Save anonymous location track ────────────────────────────────────────
export const saveLocationTrack = async (
  sessionId: string,
  lat: number,
  lng: number,
  timestamp?: Date
): Promise<void> => {
  // We use a short expiration window (e.g. 45s) for heartbeats, 
  // so we insert/update location to stay "online".
  if (timestamp) {
    await prisma.$executeRaw`
      INSERT INTO location_tracks (id, session_id, lat, lng, timestamp)
      VALUES (gen_random_uuid(), ${sessionId}, ${lat}, ${lng}, ${timestamp})
    `;
  } else {
    // We can also just update the timestamp if the session already exists in the last minute 
    // to keep the table size manageable, but per user request we just ensure it's saved.
    await prisma.$executeRaw`
      INSERT INTO location_tracks (id, session_id, lat, lng, timestamp)
      VALUES (gen_random_uuid(), ${sessionId}, ${lat}, ${lng}, NOW())
    `;
  }
};

/**
 * Remove all location tracks for a session to mark it as "offline" immediately.
 */
export const clearSessionPresence = async (sessionId: string): Promise<void> => {
  console.log(`[Analytics] Clearing presence for session: ${sessionId}`);
  await prisma.$executeRaw`
    DELETE FROM location_tracks WHERE session_id = ${sessionId}
  `;
};

// ─── 2. Save listen event ────────────────────────────────────────────────────
export const saveListenEvent = async (
  sessionId: string,
  poiId: string,
  durationSeconds: number = 0
): Promise<void> => {
  // Log for debugging per user request
  console.log(`[Analytics] Recording listen: session=${sessionId}, poiId=${poiId}, duration=${durationSeconds}s`);
  
  // Using Model-based create for reliability + pure insert
  await prisma.listenEvent.create({
    data: {
      sessionId,
      poiId,
      durationSeconds,
    }
  });
};

// ─── 3. Top POIs by visit count (location based) ───────────────────────────────
export interface TopPoiResult {
  poi_id: string;
  poi_name: string;
  visit_count: bigint;
}

export const getTopPois = async (limit: number): Promise<TopPoiResult[]> => {
  // Count using location_tracks and Haversine formula (radius 30m)
  const rows = await prisma.$queryRaw<TopPoiResult[]>`
    SELECT
      p.id AS poi_id,
      COALESCE(pt.name, 'Unnamed POI') AS poi_name,
      COUNT(lt.id) AS visit_count
    FROM pois p
    LEFT JOIN poi_translations pt ON pt.poi_id = p.id
    INNER JOIN location_tracks lt ON
      (
        6371000 * acos(
          least(1.0, cos(radians(p.lat)) * cos(radians(lt.lat)) *
          cos(radians(lt.lng) - radians(p.lng)) +
          sin(radians(p.lat)) * sin(radians(lt.lat)))
        )
      ) <= 30
    GROUP BY p.id, pt.name
    ORDER BY visit_count DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({ ...r, visit_count: Number(r.visit_count) as unknown as bigint }));
};

// ─── 4. Average listen duration ───────────────────────────────────────────────
export interface AvgListenTimeResult {
  poi_id: string | null;
  avg_duration_seconds: number;
}

export const getAvgListenTime = async (poiId?: string): Promise<AvgListenTimeResult> => {
  if (poiId) {
    const rows = await prisma.$queryRaw<{ avg_dur: number | null }[]>`
      SELECT AVG(duration_seconds)::float AS avg_dur
      FROM listen_events
      WHERE poi_id = ${poiId}::uuid
    `;
    return {
      poi_id: poiId,
      avg_duration_seconds: Number(rows[0]?.avg_dur ?? 0),
    };
  }

  const rows = await prisma.$queryRaw<{ avg_dur: number | null }[]>`
    SELECT AVG(duration_seconds)::float AS avg_dur
    FROM listen_events
  `;
  return {
    poi_id: null,
    avg_duration_seconds: Number(rows[0]?.avg_dur ?? 0),
  };
};

// ─── 5. Heatmap data (grid-cell clustering) ───────────────────────────────────
export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export const getHeatmapData = async (from?: Date, to?: Date): Promise<HeatmapPoint[]> => {
  const fromDate = from ?? new Date(0);
  const toDate = to ?? new Date();

  const rows = await prisma.$queryRaw<{ cell_lat: number; cell_lng: number; weight: bigint }[]>`
    SELECT
      ROUND((lat  / ${GRID_RESOLUTION})::numeric) * ${GRID_RESOLUTION} AS cell_lat,
      ROUND((lng  / ${GRID_RESOLUTION})::numeric) * ${GRID_RESOLUTION} AS cell_lng,
      COUNT(*) AS weight
    FROM location_tracks
    WHERE timestamp >= ${fromDate}
      AND timestamp <= ${toDate}
    GROUP BY cell_lat, cell_lng
    ORDER BY weight DESC
  `;

  return rows.map((r) => ({
    lat: Number(r.cell_lat),
    lng: Number(r.cell_lng),
    weight: Number(r.weight),
  }));
};

// ─── 6. Online users (session active in last 15 seconds) ────────────────────
export const getOnlineUsers = async (): Promise<number> => {
  // Real-time online count: tighter window (15s) paired with 10s heartbeat.
  const rows = await prisma.$queryRaw<{ online_count: bigint }[]>`
    SELECT COUNT(DISTINCT session_id) AS online_count
    FROM (
      SELECT session_id FROM location_tracks 
      WHERE timestamp >= NOW() - INTERVAL '15 seconds'
      UNION
      SELECT session_id FROM listen_events 
      WHERE listened_at >= NOW() - INTERVAL '15 seconds'
    ) AS active_sessions
  `;

  const count = Number(rows[0]?.online_count ?? 0);
  console.log(`[Analytics] Real-time online count (15s window): ${count}`);
  return count;
};

// ─── 7. Save QR scan event ───────────────────────────────────────────────────
export const saveQrScanEvent = async (
  sessionId: string,
  poiId: string,
  source: string = 'app'
): Promise<void> => {
  console.log(`[Analytics] Recording QR scan: session=${sessionId}, poiId=${poiId}, source=${source}`);
  
  await prisma.qrScanEvent.create({
    data: {
      sessionId,
      poiId,
      source,
    }
  });
};

// ─── 8. Get QR scan statistics ────────────────────────────────────────────────
export interface QrStatsResult {
  totalScans: number;
  bySource: { source: string; count: number }[];
  byPoi: { poiId: string; poiName: string; count: number }[];
}

export const getQrStats = async (ownerId?: string): Promise<QrStatsResult> => {
  // 1. Filter condition: if ownerId is provided, only include POIs owned by them
  const poiFilter = ownerId ? { owner: { id: ownerId } } : {};

  // 2. Get total count
  const totalScans = await prisma.qrScanEvent.count({
    where: {
      poi: poiFilter,
    },
  });

  // 3. Get count by source
  const sourceStats = await prisma.qrScanEvent.groupBy({
    by: ['source'],
    where: {
      poi: poiFilter,
    },
    _count: {
      id: true,
    },
  });

  // 4. Get top POIs by scan count
  const poiStatsRaw = await prisma.qrScanEvent.groupBy({
    by: ['poiId'],
    where: {
      poi: poiFilter,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 10,
  });

  // Fetch POI names for the top POIs
  const poiIds = poiStatsRaw.map((s) => s.poiId);
  const pois = await prisma.pOI.findMany({
    where: { id: { in: poiIds } },
    include: { translations: true },
  });

  const byPoi = poiStatsRaw.map((s) => {
    const poi = pois.find((p) => p.id === s.poiId);
    return {
      poiId: s.poiId,
      poiName: poi?.translations?.name || 'Unknown POI',
      count: s._count.id,
    };
  });

  return {
    totalScans,
    bySource: sourceStats.map((s) => ({ source: s.source, count: s._count.id })),
    byPoi,
  };
};
