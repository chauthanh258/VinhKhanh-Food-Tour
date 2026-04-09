import { Router } from 'express';
import authRoutes from './auth.routes';
import poiRoutes from './poi.routes';
import ownerRoutes from './owner.routes';
import adminRoutes from './admin.routes';
import menuItemRoutes from './menuItem.routes';
import categoryRoutes from './category.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pois', poiRoutes);
router.use('/admin', adminRoutes);
router.use('/admin', categoryRoutes);
router.use('/', ownerRoutes);
router.use('/', menuItemRoutes);

export default router;
