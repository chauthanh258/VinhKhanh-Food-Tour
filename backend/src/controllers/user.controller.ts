import { Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    sendResponse(res, 200, users);
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
