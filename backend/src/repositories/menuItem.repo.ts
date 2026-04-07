import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const createMenuItem = async (data: Prisma.MenuItemCreateInput) => {
  return prisma.menuItem.create({ data });
};

export const findMenuItemById = async (id: string) => {
  return prisma.menuItem.findUnique({
    where: { id }
  });
};

export const updateMenuItem = async (id: string, data: Prisma.MenuItemUpdateInput) => {
  return prisma.menuItem.update({
    where: { id },
    data
  });
};

export const deleteMenuItem = async (id: string) => {
  return prisma.menuItem.delete({
    where: { id }
  });
};

export const findMenuItemsByPOI = async (poiId: string) => {
  return prisma.menuItem.findMany({
    where: { poiId },
    include: {
      poi: {
        include: {
          translations: true
        }
      }
    }
  });
};

export const findMenuItemsByOwnerWithFilters = async (
  ownerId: string,
  filters: {
    search?: string;
    poiId?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const { search = '', poiId, page = 1, limit = 12 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.MenuItemWhereInput = {
    poi: {
      ownerId,
      ...(poiId ? { id: poiId } : {})
    }
  };

  if (search.trim()) {
    where.OR = [
      {
        name: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      },
      {
        poi: {
          translations: {
            some: {
              name: {
                contains: search.trim(),
                mode: 'insensitive'
              }
            }
          }
        }
      }
    ];
  }

  const total = await prisma.menuItem.count({ where });

  const items = await prisma.menuItem.findMany({
    where,
    include: {
      poi: {
        include: {
          translations: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: limit
  });

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
