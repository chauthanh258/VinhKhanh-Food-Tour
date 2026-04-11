import { Response, NextFunction } from 'express';
import * as poiService from '../services/poi.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as poiRepo from '../repositories/poi.repo';
import * as analyticsService from '../services/analytics.service';

export const getOwnerPOIs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.params.ownerId || req.user!.userId;
    const rawPois = await poiRepo.findPOIsByOwner(ownerId);
    
    // Map translations to arrays for frontend compatibility
    const pois = rawPois.map(poi => ({
      ...poi,
      translations: poi.translations ? [poi.translations] : []
    }));
    
    sendResponse(res, 200, pois);
  } catch (error) {
    next(error);
  }
};

export const getOwnerAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user!.userId;
    const analytics = await analyticsService.getOwnerAnalytics(ownerId);
    sendResponse(res, 200, analytics);
  } catch (error) {
    next(error);
  }
};

export const getOwnerDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user!.userId;
    const dashboard = await analyticsService.getOwnerDashboard(ownerId);
    sendResponse(res, 200, dashboard);
  } catch (error) {
    next(error);
  }
};

export const requestPOIDeletion = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const poiId = req.params.id;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    
    await poiService.requestDeletePOI(poiId, userId, userRole);
    sendResponse(res, 200, null, 'Yêu cầu xóa POI đã được gửi');
  } catch (error) {
    next(error);
  }
};
