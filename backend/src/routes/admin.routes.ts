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

// ==========================================
// USER MANAGEMENT
// ==========================================

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
 * /admin/users/{id}:
 *   get:
 *     summary: Get details of a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details retrieved
 */
router.get('/users/:id', authenticate, authorize(['ADMIN']), adminController.getUserDetails);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user active status (Ban/Unban)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/users/:id/status', authenticate, authorize(['ADMIN']), adminController.updateUserStatus);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User soft deleted
 */
router.delete('/users/:id', authenticate, authorize(['ADMIN']), adminController.softDeleteUser);

// ==========================================
// POI MANAGEMENT
// ==========================================

/**
 * @swagger
 * /admin/pois:
 *   get:
 *     summary: List all POIs globally (including inactive)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of POIs
 */
router.get('/pois', authenticate, authorize(['ADMIN']), adminController.getAllPOIs);

/**
 * @swagger
 * /admin/pois/{id}:
 *   get:
 *     summary: Get specific POI details globally
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: POI details
 */
router.get('/pois/:id', authenticate, authorize(['ADMIN']), adminController.getPOIDetails);

/**
 * @swagger
 * /admin/pois/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a POI
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: POI status updated
 */
router.patch('/pois/:id/status', authenticate, authorize(['ADMIN']), adminController.updatePOIStatus);

/**
 * @swagger
 * /admin/pois:
 *   post:
 *     summary: Create a new POI (Admin only)
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
 *               lat: { type: number }
 *               lng: { type: number }
 *               categoryId: { type: string, format: uuid }
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language: { type: string }
 *                     name: { type: string }
 *                     description: { type: string }
 *     responses:
 *       201:
 *         description: POI created successfully
 */
router.post('/pois', authenticate, authorize(['ADMIN']), adminController.createPOI);

/**
 * @swagger
 * /admin/pois/{id}:
 *   put:
 *     summary: Update a POI (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat: { type: number }
 *               lng: { type: number }
 *               categoryId: { type: string, format: uuid }
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: POI updated successfully
 */
router.put('/pois/:id', authenticate, authorize(['ADMIN']), adminController.updatePOI);

/**
 * @swagger
 * /admin/pois/{id}:
 *   delete:
 *     summary: Soft delete a POI
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: POI soft deleted
 */
router.delete('/pois/:id', authenticate, authorize(['ADMIN']), adminController.softDeletePOI);

// ==========================================
// SYSTEM STATS & LOGS
// ==========================================

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

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Get system audit logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Audit logs retrieved
 */
router.get('/audit-logs', authenticate, authorize(['ADMIN']), adminController.getAuditLogs);

export default router;
