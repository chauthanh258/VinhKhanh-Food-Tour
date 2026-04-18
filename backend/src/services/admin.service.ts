import prisma from '../utils/prisma';
import { AppError } from '../middlewares/error.middleware';
import { logAdminAction } from './audit.service';
import * as translationRepo from '../repositories/translation.repo';

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { pois: true },
  });
  if (!user) throw new AppError(404, 'User not found');
  return user;
};

export const updateUserStatus = async (
  id: string,
  isActive: boolean,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
  });
  try {
    await logAdminAction(adminId, 'UPDATE_USER_STATUS', id, { isActive }, undefined, undefined, ipAddress, userAgent);
  } catch (e) { /* ignore */ }
  return user;
};

export const updateUser = async (id: string, adminId: string, data: any, ipAddress?: string, userAgent?: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  const { fullName, email, role, isActive } = data;

  if (role && role !== user.role) {
    const isValidRoleChange =
      (user.role === 'USER' && role === 'OWNER') ||
      (user.role === 'OWNER' && role === 'USER');

    if (!isValidRoleChange) {
      throw new AppError(400, 'Invalid role change. Chỉ có thể thay đổi giữa USER và OWNER.');
    }
  }

  const oldValue = {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(fullName !== undefined && { fullName }),
      ...(email !== undefined && { email }),
      ...(role !== undefined && { role }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  const newValue = {
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    role: updatedUser.role,
    isActive: updatedUser.isActive,
  };

  try {
    await logAdminAction(adminId, 'UPDATE_USER', id, { fullName: updatedUser.fullName, email: updatedUser.email }, oldValue, newValue, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return updatedUser;
};

export const deleteUser = async (
  id: string,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  const userUpdate = await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });
  try {
    await logAdminAction(adminId, 'SOFT_DELETE_USER', id, { fullName: user?.fullName, email: user?.email }, undefined, undefined, ipAddress, userAgent);
  } catch (e) { /* ignore */ }
  return userUpdate;
};

// POI Actions
export const getAllPOIs = async (
  skip: number = 0,
  take: number = 20,
  filters?: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
  }
) => {
  const where: any = {
    deletedAt: null,
    ...(filters?.categoryId && { categoryId: filters.categoryId }),
    ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    ...(filters?.search && {
      translations: {
        name: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
    }),
  };

  const [pois, total] = await Promise.all([
    prisma.pOI.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, email: true, fullName: true } },
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        _count: { select: { menuItems: true } },
      },
    }),
    prisma.pOI.count({ where }),
  ]);
  return { 
    pois: pois.map(poi => ({
      ...poi,
      translations: poi.translations ? [poi.translations] : [],
      category: poi.category ? {
        ...poi.category,
        translations: poi.category.translations ? [poi.category.translations] : []
      } : poi.category
    })), 
    total 
  };
};


export const getPendingRequests = async () => {
  const [pendingPOIs, pendingUsers] = await Promise.all([
    prisma.pOI.findMany({
      where: { status: 'PENDING' },
      include: {
        owner: { select: { id: true, email: true, fullName: true } },
        category: { include: { translations: true } },
        translations: true,
      },
      orderBy: { submittedAt: 'desc' },
    }),
    prisma.user.findMany({
      where: { requestedRole: 'OWNER', deletedAt: null },
      select: { id: true, email: true, fullName: true, role: true, requestedRole: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const mappedPois = pendingPOIs.map(poi => ({
    ...poi,
    translations: poi.translations ? [poi.translations] : [],
    category: poi.category ? {
      ...poi.category,
      translations: poi.category.translations ? [poi.category.translations] : []
    } : poi.category
  }));

  return {
    pendingPOIs: pendingPOIs.length,
    pendingUsers: pendingUsers.length,
    totalPending: pendingPOIs.length + pendingUsers.length,
    details: {
      pois: mappedPois,
      users: pendingUsers,
    },
  };
};

export const getPOIById = async (id: string) => {
  const poi = await prisma.pOI.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, email: true, fullName: true } },
      category: {
        include: {
          translations: true,
        },
      },
      translations: true,
      menuItems: true,
    },
  });
  if (!poi) throw new AppError(404, 'POI not found');
  
  return {
    ...poi,
    translations: poi.translations ? [poi.translations] : [],
    category: poi.category ? {
      ...poi.category,
      translations: poi.category.translations ? [poi.category.translations] : []
    } : poi.category
  };
};

export const createPOI = async (
  adminId: string,
  data: any,
  ipAddress?: string,
  userAgent?: string
) => {
  const { lat, lng, categoryId, ownerId, translations } = data;

  if (ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'OWNER') {
      throw new AppError(400, 'Invalid owner. Chỉ có thể chọn user role OWNER.');
    }
  }

  const poi = await prisma.pOI.create({
    data: {
      lat,
      lng,
      ownerId: ownerId || null,
      categoryId: categoryId || null,
      status: 'APPROVED',
      isActive: true,
    },
    include: {
      owner: { select: { id: true, email: true, fullName: true } },
      category: { include: { translations: true } },
      translations: true,
    },
  });

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const { language, ...transData } = translations[0];
    await translationRepo.createTranslation({
      ...transData,
      poi: { connect: { id: poi.id } }
    });
  }

  try {
    const poiName = poi.translations?.name || `POI ${poi.id.slice(0, 8)}`;
    await logAdminAction(
      adminId,
      'CREATE_POI',
      poi.id,
      { name: poiName },
      null,
      null,
      ipAddress,
      userAgent
    );
  } catch (e) { /* ignore */ }

  return getPOIById(poi.id);
};

export const updatePOIAsAdmin = async (
  id: string,
  adminId: string,
  data: any,
  ipAddress?: string,
  userAgent?: string
) => {
  const poi = await prisma.pOI.findUnique({ where: { id } });
  if (!poi) throw new AppError(404, 'POI not found');

  const { lat, lng, categoryId, ownerId, isActive, translations } = data;

  if (ownerId !== undefined && ownerId !== null) {
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'OWNER') {
      throw new AppError(400, 'Invalid owner. Chỉ có thể chọn user role OWNER.');
    }
  }

  const oldValue = {
    lat: poi.lat,
    lng: poi.lng,
    categoryId: poi.categoryId,
    ownerId: poi.ownerId,
    isActive: poi.isActive,
  };

  const updatedPoi = await prisma.pOI.update({
    where: { id },
    data: {
      ...(lat !== undefined && { lat }),
      ...(lng !== undefined && { lng }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(ownerId !== undefined && { ownerId: ownerId || null }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      translations: true,
    },
  });

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const translation = translations[0];
    const { language, ...transData } = translation;
    await translationRepo.upsertTranslation(id, {
      ...transData,
      language,
    });
  }

  const newValue = {
    lat: updatedPoi.lat,
    lng: updatedPoi.lng,
    categoryId: updatedPoi.categoryId,
    ownerId: updatedPoi.ownerId,
    isActive: updatedPoi.isActive,
  };

  const poiTranslation = await prisma.pOITranslation.findFirst({ where: { poiId: id } });
  const poiName = poiTranslation?.name || 'POI';

  try {
    await logAdminAction(adminId, 'UPDATE_POI', id, { name: poiName }, oldValue, newValue, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return getPOIById(id);
};

export const updatePOIStatus = async (
  id: string,
  isActive: boolean,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const poi = await prisma.pOI.update({
    where: { id },
    data: { isActive },
    include: { translations: true },
  });
  const poiTranslation = await prisma.pOITranslation.findFirst({ where: { poiId: id } });
  const poiName = poiTranslation?.name || 'POI';
  try {
    await logAdminAction(adminId, 'UPDATE_POI_STATUS', id, { name: poiName, isActive }, undefined, undefined, ipAddress, userAgent);
  } catch (e) { /* ignore */ }
  return {
    ...poi,
    translations: poi.translations ? [poi.translations] : []
  };
};

export const approvePOI = async (
  id: string,
  status: 'APPROVED' | 'REJECTED',
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const poi = await prisma.pOI.findUnique({ where: { id } });
  if (!poi) throw new AppError(404, 'POI not found');

  if (poi.status !== 'PENDING') {
    throw new AppError(400, 'POI is not pending approval');
  }

  const oldValue = { status: poi.status, isActive: poi.isActive };

  const updatedPoi = await prisma.pOI.update({
    where: { id },
    data: {
      status,
      isActive: status === 'APPROVED',
    },
    include: { translations: true },
  });

  const newValue = { status: updatedPoi.status, isActive: updatedPoi.isActive };
  const poiTranslation = await prisma.pOITranslation.findFirst({ where: { poiId: id } });
  const poiName = poiTranslation?.name || 'POI';

  try {
    await logAdminAction(adminId, 'APPROVE_POI', id, { name: poiName, decision: status }, oldValue, newValue, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return getPOIById(id);
};

export const deletePOI = async (
  id: string,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const poi = await prisma.pOI.findUnique({ where: { id }, include: { translations: true } });
  const poiUpdate = await prisma.pOI.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
    include: { translations: true },
  });
  try {
    const poiName = poi?.translations?.name || `POI ${id.slice(0, 8)}`;
    await logAdminAction(adminId, 'SOFT_DELETE_POI', id, { name: poiName }, undefined, undefined, ipAddress, userAgent);
  } catch (e) { /* ignore */ }
  return {
    ...poiUpdate,
    translations: poiUpdate.translations ? [poiUpdate.translations] : []
  };
};

// System Stats

export const approvePendingPOI = async (
  id: string,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const poi = await prisma.pOI.findUnique({ where: { id } });
  if (!poi || poi.status !== 'PENDING') throw new AppError(404, 'POI request not found');

  const updatedPoi = await prisma.pOI.update({
    where: { id },
    data: {
      status: 'APPROVED',
      isActive: true,
      approvedAt: new Date(),
    },
  });

  try {
    await logAdminAction(adminId, 'APPROVE_POI', id, undefined, { status: 'PENDING' }, { status: 'APPROVED' }, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return updatedPoi;
};

export const rejectPendingPOI = async (
  id: string,
  adminId: string,
  rejectionReason: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const poi = await prisma.pOI.findUnique({ where: { id } });
  if (!poi || poi.status !== 'PENDING') throw new AppError(404, 'POI request not found');

  const updatedPoi = await prisma.pOI.update({
    where: { id },
    data: {
      status: 'REJECTED',
      rejectedAt: new Date(),
      rejectionReason,
      isActive: false,
    },
  });

  const poiTranslation = await prisma.pOITranslation.findFirst({ where: { poiId: id } });
  const poiName = poiTranslation?.name || 'POI';
  try {
    await logAdminAction(adminId, 'REJECT_POI', id, { name: poiName, rejectionReason }, { status: 'PENDING' }, { status: 'REJECTED' }, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return updatedPoi;
};

export const approveUserUpgrade = async (
  id: string,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.requestedRole !== 'OWNER') throw new AppError(404, 'Upgrade request not found');
  if (user.role !== 'USER') throw new AppError(400, 'Only USER can be upgraded to OWNER');

  const oldValue = { role: user.role, requestedRole: user.requestedRole };
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      role: 'OWNER',
      requestedRole: null,
    },
  });

  const newValue = { role: updatedUser.role, requestedRole: updatedUser.requestedRole };

  try {
    await logAdminAction(adminId, 'APPROVE_USER_UPGRADE', id, undefined, oldValue, newValue, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return updatedUser;
};

export const rejectUserUpgrade = async (
  id: string,
  adminId: string,
  rejectionReason: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.requestedRole !== 'OWNER') throw new AppError(404, 'Upgrade request not found');

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      requestedRole: null,
    },
  });

  try {
    await logAdminAction(adminId, 'REJECT_USER_UPGRADE', id, { rejectionReason }, { requestedRole: 'OWNER' }, { requestedRole: null }, ipAddress, userAgent);
  } catch (e) { /* ignore */ }

  return updatedUser;
};

export const getSystemStats = async () => {
  const [totalUsers, totalPOIs, totalMenuItems, activePOIs, adminCount, totalCategories] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.pOI.count({ where: { deletedAt: null } }),
    prisma.menuItem.count({ where: { deletedAt: null } }),
    prisma.pOI.count({ where: { isActive: true, deletedAt: null } }),
    prisma.user.count({ where: { role: 'ADMIN', deletedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
  ]);

  return {
    users: {
      total: totalUsers,
      admins: adminCount,
    },
    pois: {
      total: totalPOIs,
      active: activePOIs,
    },
    menuItems: {
      total: totalMenuItems,
    },
    categories: {
      total: totalCategories,
    },
  };
};
