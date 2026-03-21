import * as userRepo from '../repositories/user.repo';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleAuth = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
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
        picture
      },
      token
    };
  } catch (error) {
    throw new AppError(401, 'Google authentication failed');
  }
};
