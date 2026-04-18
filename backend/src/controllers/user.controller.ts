import { Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;
    const search = req.query.search as string;
    const role = (req.query.role as string) === 'all' ? undefined : (req.query.role as any);

    const { users, total } = await userService.getAllUsers(skip, take, { search, role });
    sendResponse(res, 200, { data: users, total });
  } catch (error) {
    next(error);
  }
};


export const updateRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;
    const user = await userService.updateRole(userId, role);
    sendResponse(res, 200, user, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

export const requestOwnerUpgrade = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await userService.requestOwnerUpgrade(userId);
    sendResponse(res, 200, user, 'Owner upgrade request submitted successfully');
  } catch (error) {
    next(error);
  }
};
