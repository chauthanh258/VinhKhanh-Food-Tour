import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const createTranslation = async (data: Prisma.POITranslationCreateInput) => {
  return prisma.pOITranslation.create({ data });
};

export const upsertTranslation = async (poiId: string, language: string, data: any) => {
  return prisma.pOITranslation.upsert({
    where: {
      poiId_language: { poiId, language }
    },
    update: data,
    create: { ...data, poiId, language }
  });
};

export const deleteTranslation = async (id: string) => {
  return prisma.pOITranslation.delete({
    where: { id }
  });
};
