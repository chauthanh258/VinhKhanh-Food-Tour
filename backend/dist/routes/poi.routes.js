"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const poiController = __importStar(require("../controllers/poi.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
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
 * /pois/{id}/description-tts:
 *   get:
 *     summary: Text-to-speech MP3 for POI description (google-tts-api), language follows query `lang` (UI codes jp/kr supported)
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
 *         description: audio/mpeg
 *       404:
 *         description: POI or description missing
 */
router.get('/:id/description-tts', poiController.streamDescriptionTts);
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
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['OWNER', 'ADMIN']), poiController.createPOI);
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
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['OWNER', 'ADMIN']), poiController.updatePOI);
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
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['OWNER', 'ADMIN']), poiController.deletePOI);
exports.default = router;
//# sourceMappingURL=poi.routes.js.map