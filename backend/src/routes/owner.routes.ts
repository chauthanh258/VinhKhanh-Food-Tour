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

export default router;
