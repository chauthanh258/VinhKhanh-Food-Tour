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
