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
 * /menu-items/owner/list:
 *   get:
 *     summary: List menu items for the authenticated owner with search and pagination
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by item name, description, or POI name
 *       - in: query
 *         name: poiId
 *         schema: { type: string, format: uuid }
 *         description: Filter by a specific POI
 *       - in: query
 *         name: page
 *         schema: { type: number, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated list of menu items
 */
router.get('/menu-items/owner/list', authenticate, authorize(['OWNER', 'ADMIN']), menuItemController.getOwnerMenuItems);

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
router.put('/menu-items/:id', authenticate, authorize(['OWNER', 'ADMIN']), menuItemController.updateMenuItem);

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
router.delete('/menu-items/:id', authenticate, authorize(['OWNER', 'ADMIN']), menuItemController.deleteMenuItem);

export default router;
