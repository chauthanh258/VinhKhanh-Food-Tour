import { Response, NextFunction, Request } from 'express';
import { z } from 'zod';
import * as locationService from '../services/location.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const reportLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
});

export const reportLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = reportLocationSchema.parse(req.body);
    // User might be authenticated or not, if not we just save lat/lng
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;
    
    await locationService.saveLocation(payload.lat, payload.lng, userId);
    sendResponse(res, 200, { success: true }, 'Location reported successfully');
  } catch (error) {
    next(error);
  }
};

export const getHeatmapData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const minutes = req.query.minutes ? parseInt(req.query.minutes as string) : 30;
    const data = await locationService.getHeatmapData(minutes);
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const getPoiPresence = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const minutes = req.query.minutes ? parseInt(req.query.minutes as string) : 30;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : 50;
    const data = await locationService.getPoiPresence(minutes, radius);
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};
