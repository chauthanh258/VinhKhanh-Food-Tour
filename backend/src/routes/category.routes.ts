import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin-Categories
 *   description: Category management for Admin
 */

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Admin-Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Include inactive/deleted categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', authenticate, categoryController.getAllCategories);

/**
 * @swagger
 * /admin/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Admin-Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/categories/:id', authenticate, authorize(['ADMIN']), categoryController.getCategoryById);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin-Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     description: { type: string }
 *                     language: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/categories', authenticate, authorize(['ADMIN']), categoryController.createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Admin-Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive: { type: boolean }
 *               translations: { type: array }
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/categories/:id', authenticate, authorize(['ADMIN']), categoryController.updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Soft delete a category
 *     tags: [Admin-Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), categoryController.deleteCategory);

/**
 * @swagger
 * /admin/categories/{id}/restore:
 *   post:
 *     summary: Restore a deleted category
 *     tags: [Admin-Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category restored
 */
router.post('/categories/:id/restore', authenticate, authorize(['ADMIN']), categoryController.restoreCategory);

export default router;
