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

export const findAllUsers = async (
  skip: number = 0,
  take: number = 20,
  filters?: {
    search?: string;
    role?: Role;
    isActive?: boolean;
  }
) => {
  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(filters?.role && { role: filters.role }),
    ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    ...(filters?.search && {
      OR: [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};


export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
    where: { id },
    data
  });
};
