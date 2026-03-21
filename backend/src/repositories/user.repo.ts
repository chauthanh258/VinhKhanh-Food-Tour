import prisma from '../utils/prisma';
import { Prisma, Role } from '@prisma/client';

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const updateUserRole = async (id: string, role: Role) => {
  return prisma.user.update({
    where: { id },
    data: { role }
  });
};
