import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System-wide administrative operations
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all registered users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/users', authenticate, authorize(['ADMIN']), userController.getAllUsers);

/**
 * @swagger
 * /admin/users/role:
 *   put:
 *     summary: Change the role of a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string, format: uuid }
 *               role: { type: string, enum: [ADMIN, OWNER, USER] }
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.put('/users/role', authenticate, authorize(['ADMIN']), userController.updateRole);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get system-wide statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 */
router.get('/stats', authenticate, authorize(['ADMIN']), adminController.getSystemStats);

export default router;
