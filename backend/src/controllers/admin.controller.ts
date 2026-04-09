import { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as adminService from '../services/admin.service';
import * as auditService from '../services/audit.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const updateUserSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'OWNER']).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

const updatePOISchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  ownerId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    specialties: z.string().max(500).optional(),
    priceRange: z.string().max(100).optional(),
  })).optional(),
});

// User Management
export const getUserDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    sendResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const payload = updateUserSchema.parse(req.body);
    const user = await adminService.updateUser(
      req.params.id,
      adminId,
      payload,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    const adminId = req.user!.userId;
    const user = await adminService.updateUserStatus(
      req.params.id,
      isActive,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, user, 'User status updated');
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    await adminService.deleteUser(
      req.params.id,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
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
    const poi = await adminService.updatePOIStatus(
      req.params.id,
      isActive,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, poi, 'POI status updated');
  } catch (error) {
    next(error);
  }
};

export const createPOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const poi = await adminService.createPOI(
      adminId,
      req.body,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 201, poi, 'POI created successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const payload = updatePOISchema.parse(req.body);
    const poi = await adminService.updatePOIAsAdmin(
      req.params.id,
      adminId,
      payload,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, poi, 'POI updated successfully');
  } catch (error) {
    next(error);
  }
};
export const approvePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      throw new Error('Invalid status. Must be APPROVED or REJECTED');
    }
    const adminId = req.user!.userId;
    const poi = await adminService.approvePOI(
      req.params.id,
      status,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, poi, `POI ${status.toLowerCase()} successfully`);
  } catch (error) {
    next(error);
  }
};
export const softDeletePOI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    await adminService.deletePOI(
      req.params.id,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
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

export const getPendingRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getPendingRequests();
    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const approvePOIRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const poi = await adminService.approvePendingPOI(
      req.params.id,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, poi, 'POI approved successfully');
  } catch (error) {
    next(error);
  }
};

export const rejectPOIRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const { rejectionReason } = req.body;
    const poi = await adminService.rejectPendingPOI(
      req.params.id,
      adminId,
      rejectionReason || 'Không rõ lý do',
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, poi, 'POI rejected successfully');
  } catch (error) {
    next(error);
  }
};

export const approveUserUpgrade = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const user = await adminService.approveUserUpgrade(
      req.params.id,
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, user, 'User upgrade approved');
  } catch (error) {
    next(error);
  }
};

export const rejectUserUpgrade = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const { rejectionReason } = req.body;
    const user = await adminService.rejectUserUpgrade(
      req.params.id,
      adminId,
      rejectionReason || 'Không rõ lý do',
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, user, 'User upgrade rejected');
  } catch (error) {
    next(error);
  }
};
