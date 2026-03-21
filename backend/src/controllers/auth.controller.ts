import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName, role } = req.body;
    const result = await authService.register(email, password, fullName, role);
    sendResponse(res, 201, result, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendResponse(res, 200, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await authService.getMe(userId);
    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    const result = await authService.googleAuth(idToken);
    sendResponse(res, 200, result, 'Google login successful');
  } catch (error) {
    next(error);
  }
};
