import * as userRepo from '../repositories/user.repo';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';

const client = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

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
    role: user.role,
    language: user.language,
    isOnboarded: user.isOnboarded
  };
};

export const googleAuth = async (idToken: string) => {
  if (!client || !env.GOOGLE_CLIENT_ID) {
    throw new AppError(500, 'Google authentication is not configured');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError(400, 'Invalid Google token');
    }

    const { email, name, picture } = payload;
    let user = await userRepo.findUserByEmail(email);

    if (!user) {
      // Create user if not exists
      user = await userRepo.createUser({
        email,
        fullName: name || '',
        passwordHash: '', // No password for Google users
        role: Role.USER,
      });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        language: user.language,
        isOnboarded: user.isOnboarded,
        picture
      },
      token
    };
  } catch (error) {
    throw new AppError(401, 'Google authentication failed');
  }
};

export const updateProfile = async (userId: string, data: any) => {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const updateData: any = {};

  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName;
  }

  if (data.language !== undefined) {
    updateData.language = data.language;
  }

  if (data.isOnboarded !== undefined) {
    updateData.isOnboarded = data.isOnboarded;
  }

  if (data.newPassword !== undefined) {
    if (typeof data.newPassword !== 'string' || data.newPassword.length < 8) {
      throw new AppError(400, 'Mật khẩu mới cần tối thiểu 8 ký tự');
    }

    if (user.passwordHash) {
      if (!data.currentPassword || typeof data.currentPassword !== 'string') {
        throw new AppError(400, 'Mật khẩu hiện tại bắt buộc');
      }

      const isPasswordValid = await comparePassword(data.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError(400, 'Mật khẩu hiện tại không đúng');
      }
    }

    updateData.passwordHash = await hashPassword(data.newPassword);
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, 'No update fields provided');
  }

  const updatedUser = await userRepo.updateUser(userId, updateData);
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    fullName: updatedUser.fullName,
    role: updatedUser.role,
    language: updatedUser.language,
    isOnboarded: updatedUser.isOnboarded
  };
};
