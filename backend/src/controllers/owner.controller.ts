import { Response, NextFunction } from 'express';
import * as poiService from '../services/poi.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as poiRepo from '../repositories/poi.repo';

export const getOwnerPOIs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.params.ownerId || req.user!.userId;
    const pois = await poiRepo.findPOIsByOwner(ownerId);
    sendResponse(res, 200, pois);
  } catch (error) {
    next(error);
  }
};
