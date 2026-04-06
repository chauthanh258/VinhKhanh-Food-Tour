import { Router } from 'express';
import * as ownerController from '../controllers/owner.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Owner
 *   description: Owner-specific POI management
 */

/**
 * @swagger
 * /owners/{ownerId}/pois:
 *   get:
 *     summary: List all POIs owned by a specific user
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: The ID of the owner
 *     responses:
 *       200:
 *         description: List of owned POIs
 *       403:
 *         description: Forbidden
 */
router.get('/:ownerId/pois', authenticate, authorize(['OWNER', 'ADMIN']), ownerController.getOwnerPOIs);

/**
 * @swagger
 * /owners/analytics:
 *   get:
 *     summary: Get analytics dashboard data for authenticated owner
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics summary and chart data
 */
router.get('/owners/analytics', authenticate, authorize(['OWNER', 'ADMIN']), ownerController.getOwnerAnalytics);

/**
 * @swagger
 * /owners/dashboard:
 *   get:
 *     summary: Get dashboard data for authenticated owner
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats, chart and recent activities
 */
router.get('/owners/dashboard', authenticate, authorize(['OWNER', 'ADMIN']), ownerController.getOwnerDashboard);

export default router;
