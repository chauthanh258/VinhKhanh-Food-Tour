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

export const updateUserStatus = async (id: string, isActive: boolean, adminId: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
  });
  try {
    await logAdminAction(adminId, 'UPDATE_USER_STATUS', id, { isActive });
  } catch (e) { /* ignore */ }
  return user;
};

export const deleteUser = async (id: string, adminId: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });
  try {
    await logAdminAction(adminId, 'SOFT_DELETE_USER', id);
  } catch (e) { /* ignore */ }
  return user;
};

// POI Actions
export const getAllPOIs = async (skip: number = 0, take: number = 20) => {
  const [pois, total] = await Promise.all([
    prisma.pOI.findMany({
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
      },
    }),
    prisma.pOI.count(),
  ]);
  return { pois, total };
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
  return poi;
};

export const createPOI = async (adminId: string, data: any) => {
  const { lat, lng, categoryId, translations } = data;

  const poi = await prisma.pOI.create({
    data: {
      lat,
      lng,
      categoryId: categoryId || null,
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
    await logAdminAction(adminId, 'CREATE_POI', poi.id);
  } catch (e) { /* ignore */ }

  return getPOIById(poi.id);
};

export const updatePOIAsAdmin = async (id: string, adminId: string, data: any) => {
  const poi = await prisma.pOI.findUnique({ where: { id } });
  if (!poi) throw new AppError(404, 'POI not found');

  const { lat, lng, categoryId, translations, isActive } = data;

  const updatedPoi = await prisma.pOI.update({
    where: { id },
    data: {
      ...(lat !== undefined && { lat }),
      ...(lng !== undefined && { lng }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const { language, ...transData } = translations[0];
    await translationRepo.upsertTranslation(id, transData);
  }

  try {
    await logAdminAction(adminId, 'UPDATE_POI', id);
  } catch (e) { /* ignore */ }

  return getPOIById(id);
};

export const updatePOIStatus = async (id: string, isActive: boolean, adminId: string) => {
  const poi = await prisma.pOI.update({
    where: { id },
    data: { isActive },
  });
  try {
    await logAdminAction(adminId, 'UPDATE_POI_STATUS', id, { isActive });
  } catch (e) { /* ignore */ }
  return poi;
};

export const deletePOI = async (id: string, adminId: string) => {
  const poi = await prisma.pOI.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });
  try {
    await logAdminAction(adminId, 'SOFT_DELETE_POI', id);
  } catch (e) { /* ignore */ }
  return poi;
};

// System Stats
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
