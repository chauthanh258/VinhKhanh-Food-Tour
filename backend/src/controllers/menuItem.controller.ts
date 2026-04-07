import { Response, NextFunction } from 'express';
import * as menuItemService from '../services/menuItem.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const addMenuItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { poiId } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const item = await menuItemService.addMenuItem(poiId, userId, userRole, req.body);
    sendResponse(res, 201, item, 'Menu item added successfully');
  } catch (error) {
    next(error);
  }
};

export const getOwnerMenuItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { search, poiId, page = 1, limit = 12 } = req.query;

    const result = await menuItemService.listOwnerMenuItems(userId, {
      search: search as string | undefined,
      poiId: poiId as string | undefined,
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 12
    });

    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const item = await menuItemService.updateMenuItem(id, userId, userRole, req.body);
    sendResponse(res, 200, item, 'Menu item updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    await menuItemService.deleteMenuItem(id, userId, userRole);
    sendResponse(res, 200, null, 'Menu item deleted successfully');
  } catch (error) {
    next(error);
  }
};
