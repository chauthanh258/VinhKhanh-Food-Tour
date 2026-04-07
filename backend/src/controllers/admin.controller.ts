import { Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';
import * as auditService from '../services/audit.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// User Management
export const getUserDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    sendResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    const adminId = req.user!.userId;
    const user = await adminService.updateUserStatus(req.params.id, isActive, adminId);
    sendResponse(res, 200, user, 'User status updated');
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    await adminService.deleteUser(req.params.id, adminId);
    sendResponse(res, 200, null, 'User soft deleted successfully');
  } catch (error) {
    next(error);
  }
};

// POI Management
export const getAllPOIs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;
    const result = await adminService.getAllPOIs(skip, take);
    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const getPOIDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const poi = await adminService.getPOIById(req.params.id);
    sendResponse(res, 200, poi);
  } catch (error) {
    next(error);
  }
};

export const updatePOIStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    const adminId = req.user!.userId;
    const poi = await adminService.updatePOIStatus(req.params.id, isActive, adminId);
    sendResponse(res, 200, poi, 'POI status updated');
  } catch (error) {
    next(error);
  }
};

export const createPOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const poi = await adminService.createPOI(adminId, req.body);
    sendResponse(res, 201, poi, 'POI created successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const poi = await adminService.updatePOIAsAdmin(req.params.id, adminId, req.body);
    sendResponse(res, 200, poi, 'POI updated successfully');
  } catch (error) {
    next(error);
  }
};

export const softDeletePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    await adminService.deletePOI(req.params.id, adminId);
    sendResponse(res, 200, null, 'POI soft deleted successfully');
  } catch (error) {
    next(error);
  }
};

// System Stats & Logs
export const getSystemStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getSystemStats();
    sendResponse(res, 200, stats);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;
    const logs = await auditService.getAuditLogs(skip, take);
    sendResponse(res, 200, logs);
  } catch (error) {
    next(error);
  }
};
