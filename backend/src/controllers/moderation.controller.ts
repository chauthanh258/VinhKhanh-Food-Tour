import { Response, NextFunction } from 'express';
import * as moderationService from '../services/moderation.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';
import prisma from '../utils/prisma';

/**
 * Lấy danh sách yêu cầu chờ duyệt (Admin)
 */
export const getPendingRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const requests = await moderationService.getPendingRequests();
    sendResponse(res, 200, requests);
  } catch (error) {
    next(error);
  }
};

/**
 * Duyệt yêu cầu (Admin)
 */
export const approveRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const result = await moderationService.processRequest(
      req.params.id,
      'APPROVED',
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, result, 'Yêu cầu đã được duyệt thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * Từ chối yêu cầu (Admin)
 */
export const rejectRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const result = await moderationService.processRequest(
      req.params.id,
      'REJECTED',
      adminId,
      req.ip,
      req.headers['user-agent'] as string | undefined
    );
    sendResponse(res, 200, result, 'Yêu cầu đã bị từ chối');
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách yêu cầu của tôi (Owner/User)
 */
export const getMyRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const requests = await moderationService.getMyRequests(userId);
    sendResponse(res, 200, requests);
  } catch (error) {
    next(error);
  }
};

/**
 * Gửi yêu cầu nâng cấp Owner (User)
 */
export const requestOwnerUpgrade = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    
    // Kiểm tra xem đã có yêu cầu PENDING chưa
    const existing = await prisma.moderationRequest.findFirst({
      where: {
        requesterId: userId,
        type: 'UPGRADE_OWNER',
        status: 'PENDING'
      }
    });

    if (existing) {
      throw new Error('Bạn đã có một yêu cầu nâng cấp đang chờ duyệt');
    }

    const result = await moderationService.createRequest({
      type: 'UPGRADE_OWNER',
      targetId: userId,
      requesterId: userId
    });

    sendResponse(res, 201, result, 'Yêu cầu nâng cấp đã được gửi');
  } catch (error) {
    next(error);
  }
};
