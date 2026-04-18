import { Router } from 'express';
import * as locationController from '../controllers/location.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: User location tracking and presence analytics
 */

/**
 * @swagger
 * /location/report:
 *   post:
 *     summary: Report user's current location
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat: { type: number, example: 10.7629 }
 *               lng: { type: number, example: 106.6630 }
 *     responses:
 *       200:
 *         description: Location reported successfully
 */
router.post('/report', locationController.reportLocation);

/**
 * @swagger
 * /location/heatmap:
 *   get:
 *     summary: Get user density heatmap data (Admin only)
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minutes
 *         schema: { type: number, default: 30 }
 *         description: Time window to collect locations
 *     responses:
 *       200:
 *         description: List of location coordinates
 */
router.get('/heatmap', authenticate, authorize(['ADMIN']), locationController.getHeatmapData);

/**
 * @swagger
 * /location/presence:
 *   get:
 *     summary: Get user presence count per POI (Admin only)
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minutes
 *         schema: { type: number, default: 30 }
 *         description: Time window for presence calculation
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 50 }
 *         description: Geofence radius in meters
 *     responses:
 *       200:
 *         description: List of POIs with user counts
 */
router.get('/presence', authenticate, authorize(['ADMIN']), locationController.getPoiPresence);

export default router;
