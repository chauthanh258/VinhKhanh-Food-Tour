"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.findAllUsers = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createUser = async (data) => {
    return prisma_1.default.user.create({ data });
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return prisma_1.default.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return prisma_1.default.user.findUnique({ where: { id } });
};
exports.findUserById = findUserById;
const findAllUsers = async () => {
    return prisma_1.default.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
};
exports.findAllUsers = findAllUsers;
const updateUserRole = async (id, role) => {
    return prisma_1.default.user.update({
        where: { id },
        data: { role }
    });
};
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=user.repo.js.map