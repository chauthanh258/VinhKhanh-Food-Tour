import { Router } from 'express';
import * as poiController from '../controllers/poi.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { poiImageUpload } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: POI
 *   description: Points of Interest management and search
 */

/**
 * @swagger
 * /pois:
 *   get:
 *     summary: List nearby POIs based on geo-coordinates
 *     tags: [POI]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number, example: 10.7601 }
 *         description: Latitude of search center
 *       - in: query
 *         name: lng
 *         required: true
 *         schema: { type: number, example: 106.7056 }
 *         description: Longitude of search center
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 1000 }
 *         description: Search radius in meters
 *       - in: query
 *         name: lang
 *         schema: { type: string, default: vi, enum: [vi, en, ja, zh] }
 *         description: Prefered language for name and description
 *     responses:
 *       200:
 *         description: List of nearby POIs
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
 *                       id: { type: string, format: uuid }
 *                       lat: { type: number }
 *                       lng: { type: number }
 *                       distance: { type: number }
 *                       translation: { type: object }
 */
router.get('/', poiController.getNearbyPOIs);

/**
 * @swagger
 * /pois/owner/list:
 *   get:
 *     summary: Get owner's POIs with search and filter (all, active, hidden)
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by POI name, description, or specialties
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [all, active, hidden], default: all }
 *         description: Filter by POI status (all, active, or hidden)
 *       - in: query
 *         name: page
 *         schema: { type: number, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 10 }
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of owner's POIs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page: { type: number }
 *                         limit: { type: number }
 *                         total: { type: number }
 *                         totalPages: { type: number }
 */
router.get('/owner/list', authenticate, authorize(['OWNER', 'ADMIN']), poiController.getOwnerPOIs);

/**
 * @swagger
 * /pois/upload-image:
 *   post:
 *     summary: Upload a POI image
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post('/upload-image', authenticate, authorize(['OWNER', 'ADMIN']), poiImageUpload.single('image'), poiController.uploadPOIImage);

/**
 * @swagger
 * /pois/{id}/translate-tts:
 *   get:
 *     summary: Get translated description and TTS audio base64 for POI
 *     tags: [POI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: lang
 *         schema: { type: string, default: vi }
 *     responses:
 *       200:
 *         description: JSON containing translated text and base64 audio
 *       404:
 *         description: POI or description missing
 */
router.get('/:id/translate-tts', poiController.getTranslationAndTts);

/**
 * @swagger
 * /pois/{id}:
 *   get:
 *     summary: Get detailed information of a specific POI
 *     tags: [POI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: POI details with translations and menu items
 *       404:
 *         description: POI not found
 */
router.get('/:id', poiController.getPOIDetails);

/**
 * @swagger
 * /pois:
 *   post:
 *     summary: Create a new POI (Requires Owner or Admin role)
 *     tags: [Owner]
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
 *         description: POI created
 */
router.post('/', authenticate, authorize(['OWNER', 'ADMIN']), poiController.createPOI);

/**
 * @swagger
 * /pois/{id}:
 *   put:
 *     summary: Update POI details (Requires Owner or Admin role)
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: POI updated
 */
router.put('/:id', authenticate, authorize(['OWNER', 'ADMIN']), poiController.updatePOI);

/**
 * @swagger
 * /pois/{id}:
 *   delete:
 *     summary: Delete POI (Requires Owner or Admin role)
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: POI deleted
 */
router.delete('/:id', authenticate, authorize(['OWNER', 'ADMIN']), poiController.deletePOI);

export default router;
