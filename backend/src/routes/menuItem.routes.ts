import { Router } from 'express';
import * as menuItemController from '../controllers/menuItem.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Specialized dish/menu item management
 */

/**
 * @swagger
 * /pois/{poiId}/menu-items:
 *   post:
 *     summary: Add a new dish to a restaurant
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: poiId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Menu item added
 */
router.post('/pois/:poiId/menu-items', authenticate, authorize(['OWNER', 'ADMIN']), menuItemController.addMenuItem);

/**
 * @swagger
 * /menu-items/{id}:
 *   put:
 *     summary: Update an existing dish
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.put('/:id', authenticate, authorize(['OWNER', 'ADMIN']), menuItemController.updateMenuItem);

/**
 * @swagger
 * /menu-items/{id}:
 *   delete:
 *     summary: Remove a dish from the menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Menu item deleted
 */
router.delete('/:id', authenticate, authorize(['OWNER', 'ADMIN']), menuItemController.deleteMenuItem);

export default router;
