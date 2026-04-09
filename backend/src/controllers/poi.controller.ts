import { Request, Response, NextFunction } from 'express';
import * as poiService from '../services/poi.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';

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

/** Return JSON with translated text and audioBase64 */
export const getTranslationAndTts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const uiLang = (req.query.lang as string) || 'vi';
    const result = await poiService.getTranslatedDescriptionAndTts(id, uiLang);
    res.setHeader('Cache-Control', 'public, max-age=10');
    sendResponse(res, 200, result);
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

export const getOwnerPOIs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { search, status = 'all', page = 1, limit = 10 } = req.query;

    const filters = {
      search: search as string | undefined,
      status: (status as 'all' | 'active' | 'hidden') || 'all',
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10
    };

    const result = await poiService.listOwnerPOIs(userId, filters);
    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const uploadPOIImage = async (
  req: AuthenticatedRequest & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No image file uploaded');
    }

    const configuredBaseUrl = process.env.PUBLIC_BASE_URL?.replace(/\/+$/, '');
    let baseUrl = configuredBaseUrl || `${req.protocol}://${req.get('host')}`;
    // If someone configures PUBLIC_BASE_URL as "http://host:port/api",
    // strip the trailing /api because static files are served at /img_modules.
    baseUrl = baseUrl.replace(/\/api$/, '');

    const imageUrl = `${baseUrl}/img_modules/poi/${req.file.filename}`;

    sendResponse(res, 201, { imageUrl }, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
};
