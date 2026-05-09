import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as trackingService from '../services/analytics.tracking.service';
import { sendResponse } from '../utils/response.util';

// ─── Validation Schemas ───────────────────────────────────────────────────────

const locationSchema = z.object({
  sessionId: z.string().min(1).max(128),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().datetime().optional(),
});

const offlineSchema = z.object({
  sessionId: z.string().min(1).max(128),
});

const listenSchema = z.object({
  sessionId: z.string().min(1).max(128),
  poiId: z.string().uuid(),
  durationSeconds: z.number().int().min(0).max(86400),
});

const topPoisSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 5))
    .pipe(z.number().int().min(1).max(100)),
});

const avgListenSchema = z.object({
  poi_id: z.string().uuid().optional(),
});

const heatmapSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// ─── 1. POST /api/analytics/location ─────────────────────────────────────────
/**
 * Track an anonymous location update.
 *
 * Request body:
 *   { sessionId: string, lat: number, lng: number, timestamp?: ISO8601 }
 *
 * Response 200:
 *   { success: true, message: "Location tracked", data: null }
 */
export const trackLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, lat, lng, timestamp } = locationSchema.parse(req.body);
    const ts = timestamp ? new Date(timestamp) : undefined;
    await trackingService.saveLocationTrack(sessionId, lat, lng, ts);
    sendResponse(res, 200, null, 'Location tracked');
  } catch (err) {
    next(err);
  }
};

/**
 * Handle explicit session logout/tab close.
 */
export const trackOffline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = offlineSchema.parse(req.body);
    await trackingService.clearSessionPresence(sessionId);
    sendResponse(res, 200, null, 'Session marked offline');
  } catch (err) {
    next(err);
  }
};

// ─── 2. POST /api/analytics/listen ───────────────────────────────────────────
/**
 * Record an audio-listen event for a POI.
 *
 * Request body:
 *   { sessionId: string, poiId: UUID, durationSeconds: number }
 *
 * Response 200:
 *   { success: true, message: "Listen event recorded", data: null }
 */
export const trackListen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, poiId, durationSeconds } = listenSchema.parse(req.body);
    await trackingService.saveListenEvent(sessionId, poiId, durationSeconds);
    sendResponse(res, 200, null, 'Listen event recorded');
  } catch (err) {
    next(err);
  }
};

// ─── 3. GET /api/analytics/top-pois ──────────────────────────────────────────
/**
 * Return the most-listened POIs.
 *
 * Query params:
 *   limit?: number (default 5, max 100)
 *
 * Response 200:
 *   { success: true, data: [{ poi_id, poi_name, listen_count }] }
 */
export const getTopPois = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = topPoisSchema.parse(req.query);
    const data = await trackingService.getTopPois(limit);
    sendResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
};

// ─── 4. GET /api/analytics/avg-listen-time ────────────────────────────────────
/**
 * Return the average audio-listen duration.
 *
 * Query params:
 *   poi_id?: UUID  – if omitted, returns the global average across all POIs.
 *
 * Response 200:
 *   { success: true, data: { poi_id: string|null, avg_duration_seconds: number } }
 */
export const getAvgListenTime = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { poi_id } = avgListenSchema.parse(req.query);
    const data = await trackingService.getAvgListenTime(poi_id);
    sendResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
};

// ─── 5. GET /api/analytics/heatmap-data ──────────────────────────────────────
/**
 * Return location density data for heatmap rendering.
 *
 * Query params:
 *   from?: ISO8601 datetime  – start of time range (default: epoch)
 *   to?:   ISO8601 datetime  – end   of time range (default: now)
 *
 * Response 200:
 *   { success: true, data: [{ lat, lng, weight }] }
 *
 * Notes:
 *   - Coordinates are rounded to 0.001° grid cells (~100 m resolution).
 *   - weight = number of location pings within that grid cell.
 */
export const getHeatmapData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = heatmapSchema.parse(req.query);
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    const data = await trackingService.getHeatmapData(fromDate, toDate);
    sendResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
};

export const getOnlineUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const online_count = await trackingService.getOnlineUsers();
    sendResponse(res, 200, { online_count });
  } catch (err) {
    next(err);
  }
};

const qrScanSchema = z.object({
  sessionId: z.string().min(1).max(128),
  poiId: z.string().uuid(),
  source: z.enum(['app', 'external']).default('app'),
});

// ─── 7. POST /api/analytics/qr-scan ──────────────────────────────────────────
/**
 * Record a QR scan event.
 */
export const trackQrScan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, poiId, source } = qrScanSchema.parse(req.body);
    await trackingService.saveQrScanEvent(sessionId, poiId, source);
    sendResponse(res, 200, null, 'QR scan recorded');
  } catch (err) {
    next(err);
  }
};

// ─── 8. GET /api/analytics/qr-stats ─────────────────────────────────────────
/**
 * Get QR scan statistics.
 * - Admin: Sees all data.
 * - Owner: Sees only their own POIs.
 */
export const getQrStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user; // From authenticate middleware
    const ownerId = user.role === 'ADMIN' ? undefined : user.userId;

    const stats = await trackingService.getQrStats(ownerId);
    sendResponse(res, 200, stats);
  } catch (err) {
    next(err);
  }
};
