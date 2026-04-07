import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const createPOI = async (data: Prisma.POICreateInput) => {
  return prisma.pOI.create({ data });
};

export const findPOIById = async (id: string) => {
  return prisma.pOI.findUnique({
    where: { id },
    include: {
      translations: true,
      menuItems: true,
      owner: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });
};

export const updatePOI = async (id: string, data: Prisma.POIUpdateInput) => {
  return prisma.pOI.update({
    where: { id },
    data
  });
};

export const deletePOI = async (id: string) => {
  return prisma.pOI.delete({
    where: { id }
  });
};

export const findAllPOIs = async (filters: any = {}) => {
  return prisma.pOI.findMany({
    where: filters,
    include: {
      translations: true
    }
  });
};

export const findPOIsByOwner = async (ownerId: string) => {
  return prisma.pOI.findMany({
    where: { ownerId },
    include: {
      translations: true
    }
  });
};

export const findPOIsByOwnerWithFilters = async (
  ownerId: string,
  filters: {
    search?: string;
    status?: 'all' | 'active' | 'hidden';
    page?: number;
    limit?: number;
  } = {}
) => {
  const { search = '', status = 'all', page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Build where conditions
  const whereConditions: any = { ownerId };

  // Filter by status
  if (status === 'active') {
    whereConditions.isActive = true;
  } else if (status === 'hidden') {
    whereConditions.isActive = false;
  }

  // Filter by search (search in name, description, specialties)
  if (search.trim()) {
    whereConditions.OR = [
      {
        translations: {
          some: {
            name: {
              contains: search.trim(),
              mode: 'insensitive'
            }
          }
        }
      },
      {
        translations: {
          some: {
            description: {
              contains: search.trim(),
              mode: 'insensitive'
            }
          }
        }
      },
      {
        translations: {
          some: {
            specialties: {
              contains: search.trim(),
              mode: 'insensitive'
            }
          }
        }
      }
    ];
  }

  // Get total count
  const total = await prisma.pOI.count({ where: whereConditions });

  // Get paginated results
  const pois = await prisma.pOI.findMany({
    where: whereConditions,
    include: {
      translations: true
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return {
    data: pois,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
