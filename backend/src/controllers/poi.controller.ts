import { Request, Response, NextFunction } from 'express';
import * as poiService from '../services/poi.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getNearbyPOIs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius, lang } = req.query;
    const pois = await poiService.listNearbyPOIs(
      parseFloat(lat as string),
      parseFloat(lng as string),
      parseInt(radius as string || '1000'),
      (lang as string) || 'vi'
    );
    sendResponse(res, 200, pois);
  } catch (error) {
    next(error);
  }
};

export const getPOIDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const poi = await poiService.getPOIDetails(id);
    sendResponse(res, 200, poi);
  } catch (error) {
    next(error);
  }
};

export const createPOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const poi = await poiService.createNewPOI(userId, req.body);
    sendResponse(res, 201, poi, 'POI created successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const poi = await poiService.updatePOIAsOwner(id, userId, userRole, req.body);
    sendResponse(res, 200, poi, 'POI updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deletePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    await poiService.deletePOI(id, userId, userRole);
    sendResponse(res, 200, null, 'POI deleted successfully');
  } catch (error) {
    next(error);
  }
};
