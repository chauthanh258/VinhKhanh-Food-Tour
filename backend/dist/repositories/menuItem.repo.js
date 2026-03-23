"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMenuItemsByPOI = exports.deleteMenuItem = exports.updateMenuItem = exports.findMenuItemById = exports.createMenuItem = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createMenuItem = async (data) => {
    return prisma_1.default.menuItem.create({ data });
};
exports.createMenuItem = createMenuItem;
const findMenuItemById = async (id) => {
    return prisma_1.default.menuItem.findUnique({
        where: { id }
    });
};
exports.findMenuItemById = findMenuItemById;
const updateMenuItem = async (id, data) => {
    return prisma_1.default.menuItem.update({
        where: { id },
        data
    });
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = async (id) => {
    return prisma_1.default.menuItem.delete({
        where: { id }
    });
};
exports.deleteMenuItem = deleteMenuItem;
const findMenuItemsByPOI = async (poiId) => {
    return prisma_1.default.menuItem.findMany({
        where: { poiId }
    });
};
exports.findMenuItemsByPOI = findMenuItemsByPOI;
//# sourceMappingURL=menuItem.repo.js.map