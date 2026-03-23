"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.getMe = exports.login = exports.register = void 0;
const userRepo = __importStar(require("../repositories/user.repo"));
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
const error_middleware_1 = require("../middlewares/error.middleware");
const client_1 = require("@prisma/client");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const register = async (email, password, fullName, role = client_1.Role.USER) => {
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
        throw new error_middleware_1.AppError(400, 'User already exists');
    }
    const hashedPassword = await (0, password_util_1.hashPassword)(password);
    const user = await userRepo.createUser({
        email,
        passwordHash: hashedPassword,
        fullName,
        role
    });
    const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
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
exports.register = register;
const login = async (email, password) => {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        throw new error_middleware_1.AppError(401, 'Invalid email or password');
    }
    const isPasswordValid = await (0, password_util_1.comparePassword)(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new error_middleware_1.AppError(401, 'Invalid email or password');
    }
    const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
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
exports.login = login;
const getMe = async (userId) => {
    const user = await userRepo.findUserById(userId);
    if (!user) {
        throw new error_middleware_1.AppError(404, 'User not found');
    }
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
    };
};
exports.getMe = getMe;
const googleAuth = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new error_middleware_1.AppError(400, 'Invalid Google token');
        }
        const { email, name, picture } = payload;
        let user = await userRepo.findUserByEmail(email);
        if (!user) {
            // Create user if not exists
            user = await userRepo.createUser({
                email,
                fullName: name || '',
                passwordHash: '', // No password for Google users
                role: client_1.Role.USER,
            });
        }
        const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
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
    }
    catch (error) {
        throw new error_middleware_1.AppError(401, 'Google authentication failed');
    }
};
exports.googleAuth = googleAuth;
//# sourceMappingURL=auth.service.js.map