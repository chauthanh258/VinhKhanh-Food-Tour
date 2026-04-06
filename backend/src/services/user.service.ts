import * as userRepo from '../repositories/user.repo';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '@prisma/client';

export const getAllUsers = async () => {
  return userRepo.findAllUsers();
};

export const updateRole = async (userId: string, role: Role) => {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return userRepo.updateUser(userId, { role });
};
