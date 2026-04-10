import { Response, NextFunction } from 'express';
import * as poiService from '../services/poi.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as poiRepo from '../repositories/poi.repo';

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
