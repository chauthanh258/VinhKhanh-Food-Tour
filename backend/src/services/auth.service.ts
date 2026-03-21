import * as userRepo from '../repositories/user.repo';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '@prisma/client';

export const register = async (email: string, password: string, fullName: string, role: Role = Role.USER) => {
  const existingUser = await userRepo.findUserByEmail(email);
  if (existingUser) {
    throw new AppError(400, 'User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await userRepo.createUser({
    email,
    passwordHash: hashedPassword,
    fullName,
    role
  });

  const token = generateToken({ userId: user.id, role: user.role });
  
  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    },
    token
  };
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    },
    token
  };
};

export const getMe = async (userId: string) => {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
};
