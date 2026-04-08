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
 * /admin/pending-requests:
 *   get:
 *     summary: Get all pending requests (POIs and user role upgrades)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending requests retrieved
 */
router.get('/pending-requests', authenticate, authorize(['ADMIN']), adminController.getPendingRequests);

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
 *   put:
 *     summary: Update user details (Admin only)
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
 *               fullName: { type: string }
 *               email: { type: string }
 *               role: { type: string, enum: [USER, OWNER] }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/users/:id', authenticate, authorize(['ADMIN']), adminController.updateUser);

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
 * /admin/pois/{id}/approve:
 *   patch:
 *     summary: Approve or reject a pending POI
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
 *               status: { type: string, enum: [APPROVED, REJECTED] }
 *     responses:
 *       200:
 *         description: POI approved or rejected
 */
router.patch('/pois/:id/approve', authenticate, authorize(['ADMIN']), adminController.approvePOI);

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

/**
 * @swagger
 * /admin/requests:
 *   get:
 *     summary: Get pending POI and user upgrade requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending requests retrieved
 */
router.get('/requests', authenticate, authorize(['ADMIN']), adminController.getPendingRequests);

/**
 * @swagger
 * /admin/requests/poi/{id}/approve:
 *   post:
 *     summary: Approve pending POI request
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
 *         description: POI approved
 */
router.post('/requests/poi/:id/approve', authenticate, authorize(['ADMIN']), adminController.approvePOIRequest);

/**
 * @swagger
 * /admin/requests/poi/{id}/reject:
 *   post:
 *     summary: Reject pending POI request
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
 *               rejectionReason: { type: string }
 *     responses:
 *       200:
 *         description: POI rejected
 */
router.post('/requests/poi/:id/reject', authenticate, authorize(['ADMIN']), adminController.rejectPOIRequest);

/**
 * @swagger
 * /admin/requests/user/{id}/approve:
 *   post:
 *     summary: Approve user upgrade request
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
 *         description: User upgrade approved
 */
router.post('/requests/user/:id/approve', authenticate, authorize(['ADMIN']), adminController.approveUserUpgrade);

/**
 * @swagger
 * /admin/requests/user/{id}/reject:
 *   post:
 *     summary: Reject user upgrade request
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
 *               rejectionReason: { type: string }
 *     responses:
 *       200:
 *         description: User upgrade rejected
 */
router.post('/requests/user/:id/reject', authenticate, authorize(['ADMIN']), adminController.rejectUserUpgrade);

export default router;
