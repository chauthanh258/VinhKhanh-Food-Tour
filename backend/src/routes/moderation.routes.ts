import { Router } from 'express';
import * as moderationController from '../controllers/moderation.controller';
import * as ownerController from '../controllers/owner.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Moderation
 *   description: Moderation request system for POIs and User upgrades
 */

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

router.get('/admin/requests', authenticate, authorize(['ADMIN']), moderationController.getPendingRequests);
router.post('/admin/requests/:id/approve', authenticate, authorize(['ADMIN']), moderationController.approveRequest);
router.post('/admin/requests/:id/reject', authenticate, authorize(['ADMIN']), moderationController.rejectRequest);

// ==========================================
// USER/OWNER ENDPOINTS
// ==========================================

// Lấy danh sách yêu cầu của bản thân
router.get('/my-requests', authenticate, moderationController.getMyRequests);

// Yêu cầu nâng cấp lên Owner (Dành cho User)
router.post('/request-upgrade', authenticate, authorize(['USER']), moderationController.requestOwnerUpgrade);

export default router;
