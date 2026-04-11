import { Router } from 'express';
import authRoutes from './auth.routes';
import poiRoutes from './poi.routes';
import ownerRoutes from './owner.routes';
import adminRoutes from './admin.routes';
import moderationRoutes from './moderation.routes';
import menuItemRoutes from './menuItem.routes';
import categoryRoutes from './category.routes';

import publicCategoryRoutes from './public.category.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pois', poiRoutes);
router.use('/admin', adminRoutes);
router.use('/admin', categoryRoutes);
router.use('/categories', publicCategoryRoutes);
router.use('/', ownerRoutes);
router.use('/moderation', moderationRoutes);
router.use('/owners', ownerRoutes);
router.use('/', menuItemRoutes);

export default router;
