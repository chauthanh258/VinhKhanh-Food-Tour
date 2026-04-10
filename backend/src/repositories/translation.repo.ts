import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const createTranslation = async (data: Prisma.POITranslationCreateInput) => {
  return prisma.pOITranslation.create({ data });
};

export const upsertTranslation = async (poiId: string, data: any) => {
  return prisma.pOITranslation.upsert({
    where: { poiId },
    update: data,
    create: { ...data, poiId }
  });
};

export const findTranslationByPOIId = async (poiId: string) => {
  return prisma.pOITranslation.findFirst({
    where: { poiId }
  });
};

export const deleteTranslation = async (id: string) => {
  return prisma.pOITranslation.delete({
    where: { id }
  });
};
