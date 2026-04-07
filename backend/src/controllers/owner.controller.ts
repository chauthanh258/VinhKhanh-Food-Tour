import { Response, NextFunction } from 'express';
import * as poiService from '../services/poi.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as poiRepo from '../repositories/poi.repo';
import * as analyticsService from '../services/analytics.service';

export const getOwnerPOIs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.params.ownerId || req.user!.userId;
    const pois = await poiRepo.findPOIsByOwner(ownerId);
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
