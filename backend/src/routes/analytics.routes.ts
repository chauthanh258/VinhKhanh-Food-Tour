import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Anonymous user behaviour tracking and analytics queries
 */

// ─── Public Write Endpoints (no auth required) ────────────────────────────────
// Designed to be called from mobile/web clients with a random session UUID.
// session_id is NEVER linked to a user account.

/**
 * @swagger
 * /analytics/location:
 *   post:
 *     summary: Track an anonymous location update
 *     description: |
 *       Called by the client whenever the user's GPS position changes significantly.
 *       `sessionId` must be a random UUID stored in localStorage / AsyncStorage —
 *       **never** the authenticated user's ID.
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, lat, lng]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               lat:
 *                 type: number
 *                 example: 10.7629
 *               lng:
 *                 type: number
 *                 example: 106.6630
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-08T12:00:00.000Z"
 *     responses:
 *       200:
 *         description: Location tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Location tracked" }
 *                 data:    { type: "null" }
 *       400:
 *         description: Validation error
 */
router.post('/location', analyticsController.trackLocation);
router.post('/offline', analyticsController.trackOffline);

/**
 * @swagger
 * /analytics/listen:
 *   post:
 *     summary: Record an audio-listen event for a POI
 *     description: |
 *       Call this endpoint when the user **finishes** (or pauses) listening to a
 *       POI's audio guide. Send the total playback duration in seconds.
 *       Alternatively, call it when playback starts with `durationSeconds: 0` and
 *       send a follow-up call on stop with the actual duration.
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, poiId, durationSeconds]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               poiId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               durationSeconds:
 *                 type: integer
 *                 minimum: 0
 *                 example: 87
 *     responses:
 *       200:
 *         description: Listen event recorded
 *       400:
 *         description: Validation error (invalid UUID, negative duration, etc.)
 */
router.post('/listen', analyticsController.trackListen);

// ─── Admin-only Read Endpoints ────────────────────────────────────────────────

/**
 * @swagger
 * /analytics/top-pois:
 *   get:
 *     summary: Top POIs by listen count (Admin)
 *     description: Returns the N most-listened POIs, ordered by total listen events descending.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 100
 *         description: Number of POIs to return
 *     responses:
 *       200:
 *         description: List of top POIs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       poi_id:       { type: string, format: uuid }
 *                       poi_name:     { type: string }
 *                       listen_count: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Admin role required
 */
router.get('/top-pois', authenticate, authorize(['ADMIN']), analyticsController.getTopPois);

/**
 * @swagger
 * /analytics/avg-listen-time:
 *   get:
 *     summary: Average audio listen duration (Admin)
 *     description: |
 *       Returns the average `duration_seconds` from `listen_events`.
 *       - With `poi_id` → average for that specific POI.
 *       - Without `poi_id` → global average across all POIs.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: poi_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by a specific POI (optional)
 *     responses:
 *       200:
 *         description: Average listen time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     poi_id:               { type: string, nullable: true }
 *                     avg_duration_seconds: { type: number, example: 73.5 }
 */
router.get(
  '/avg-listen-time',
  authenticate,
  authorize(['ADMIN']),
  analyticsController.getAvgListenTime
);

/**
 * @swagger
 * /analytics/heatmap-data:
 *   get:
 *     summary: Location density data for heatmap rendering (Admin)
 *     description: |
 *       Returns aggregated GPS pings grouped into ~100 m grid cells.
 *       Use the `weight` field as the intensity value for leaflet-heatmap.js.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of time range (ISO 8601). Defaults to epoch.
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of time range (ISO 8601). Defaults to now.
 *     responses:
 *       200:
 *         description: Heatmap data points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lat:    { type: number }
 *                       lng:    { type: number }
 *                       weight: { type: integer }
 */
router.get(
  '/heatmap-data',
  authenticate,
  authorize(['ADMIN']),
  analyticsController.getHeatmapData
);

/**
 * @swagger
 * /analytics/online-users:
 *   get:
 *     summary: Count of sessions active in the last 5 minutes (Admin)
 *     description: |
 *       A session is "online" if it has recorded at least one location ping
 *       OR one listen event within the past 5 minutes.
 *       No new table is created – this query runs directly on `location_tracks`
 *       and `listen_events`.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current online session count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     online_count: { type: integer, example: 42 }
 */
router.get(
  '/online-users',
  authenticate,
  authorize(['ADMIN']),
  analyticsController.getOnlineUsers
);

export default router;
