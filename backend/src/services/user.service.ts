import * as userRepo from '../repositories/user.repo';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '@prisma/client';

export const getAllUsers = async (
  skip: number = 0,
  take: number = 20,
  filters?: {
    search?: string;
    role?: Role;
  }
) => {
  return userRepo.findAllUsers(skip, take, filters);
};


export const updateRole = async (userId: string, role: Role) => {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Allow both USER -> OWNER and OWNER -> USER changes.
  if (user.role !== role) {
    const isValidRoleChange =
      (user.role === 'USER' && role === 'OWNER') ||
      (user.role === 'OWNER' && role === 'USER');

    if (!isValidRoleChange) {
      throw new AppError(400, 'Invalid role change. Chỉ có thể thay đổi giữa USER và OWNER.');
    }
  }

  return userRepo.updateUser(userId, { role });
};

export const requestOwnerUpgrade = async (userId: string) => {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role !== 'USER') {
    throw new AppError(400, 'Only users with USER role can request owner upgrade');
  }

  if (user.requestedRole === 'OWNER') {
    throw new AppError(400, 'Owner upgrade request already exists');
  }

  return userRepo.updateUser(userId, { requestedRole: 'OWNER' });
};
