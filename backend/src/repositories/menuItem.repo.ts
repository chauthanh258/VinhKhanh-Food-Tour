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
    where: { poiId }
  });
};
