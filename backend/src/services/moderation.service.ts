import prisma from '../utils/prisma';
import { ModerationType, ModerationStatus } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';
import { logAdminAction } from './audit.service';

/**
 * Tạo yêu cầu duyệt mới
 */
export const createRequest = async (data: {
  type: ModerationType;
  targetId: string;
  requesterId: string;
}) => {
  try {
    return await prisma.moderationRequest.create({
      data: {
        type: data.type,
        targetId: data.targetId,
        requesterId: data.requesterId,
        status: 'PENDING',
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new AppError(400, 'Một yêu cầu tương tự đã tồn tại.');
    }
    throw error;
  }
};

/**
 * Lấy danh sách yêu cầu đang chờ duyệt (cho Admin)
 */
export const getPendingRequests = async () => {
  const requests = await prisma.moderationRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { requestedAt: 'desc' },
  });
  return await mapRequestTargets(requests);
};

/**
 * Lấy danh sách yêu cầu của người dùng hiện tại (cho Owner/User)
 */
export const getMyRequests = async (userId: string) => {
  const requests = await prisma.moderationRequest.findMany({
    where: { requesterId: userId },
    orderBy: { requestedAt: 'desc' },
  });
  return await mapRequestTargets(requests);
};

/**
 * Helper to map target details (POI or User) for requests
 */
async function mapRequestTargets(requests: any[]) {
  return await Promise.all(requests.map(async (req) => {
    let targetInfo = null;
    const requester = await prisma.user.findUnique({
      where: { id: req.requesterId },
      select: { id: true, email: true, fullName: true }
    });

    if (req.type === 'POI_CREATE' || req.type === 'POI_DELETE') {
      const poi = await prisma.pOI.findUnique({
        where: { id: req.targetId },
        include: { 
          translations: true,
          category: { include: { translations: true } }
        }
      });
      if (poi) {
        targetInfo = {
          ...poi,
          translations: poi.translations ? [poi.translations] : [],
          category: poi.category ? {
            ...poi.category,
            translations: poi.category.translations ? [poi.category.translations] : []
          } : null
        };
      }
    } else if (req.type === 'UPGRADE_OWNER') {
      targetInfo = await prisma.user.findUnique({
        where: { id: req.targetId },
        select: { id: true, email: true, fullName: true, role: true }
      });
    }
    return { ...req, targetInfo, requester };
  }));
}

/**
 * Xử lý duyệt hoặc từ chối yêu cầu
 */
export const processRequest = async (
  requestId: string,
  status: ModerationStatus,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  return await prisma.$transaction(async (tx) => {
    const request = await tx.moderationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new AppError(404, 'Không tìm thấy yêu cầu duyệt');
    if (request.status !== 'PENDING') throw new AppError(400, 'Yêu cầu này đã được xử lý');

    // 1. Cập nhật trạng thái yêu cầu
    const updatedRequest = await tx.moderationRequest.update({
      where: { id: requestId },
      data: {
        status,
        approvedAt: status === 'APPROVED' ? new Date() : null,
      },
    });

    // 2. Thực thi nghiệp vụ nếu được DUYỆT
    if (status === 'APPROVED') {
      switch (request.type) {
        case 'POI_CREATE':
          await tx.pOI.update({
            where: { id: request.targetId },
            data: { 
              isActive: true, 
              status: 'APPROVED', 
              approvedAt: new Date() 
            },
          });
          break;
        case 'POI_DELETE':
          await tx.pOI.update({
            where: { id: request.targetId },
            data: { isActive: false, deletedAt: new Date() },
          });
          break;
        case 'UPGRADE_OWNER':
          await tx.user.update({
            where: { id: request.targetId },
            data: { role: 'OWNER', requestedRole: null },
          });
          break;
      }
    }

    // 3. Ghi log hành động admin
    try {
      await logAdminAction(
        adminId,
        `${status.toString()}_REQUEST_${request.type}`,
        request.targetId,
        { requestId },
        undefined,
        undefined,
        ipAddress,
        userAgent
      );
    } catch (e) { /* ignore */ }

    return updatedRequest;
  });
};
