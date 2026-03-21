import { Router } from 'express';
import authRoutes from './auth.routes';
import poiRoutes from './poi.routes';
import ownerRoutes from './owner.routes';
import adminRoutes from './admin.routes';
import menuItemRoutes from './menuItem.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pois', poiRoutes);
router.use('/', ownerRoutes); // Using '/' because it has owners/:ownerId/pois
router.use('/admin', adminRoutes);
router.use('/', menuItemRoutes); // Using '/' because it has pois/:poiId/menu-items and menu-items/:id

export default router;
