"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPOIsByOwner = exports.findAllPOIs = exports.deletePOI = exports.updatePOI = exports.findPOIById = exports.createPOI = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createPOI = async (data) => {
    return prisma_1.default.pOI.create({ data });
};
exports.createPOI = createPOI;
const findPOIById = async (id) => {
    return prisma_1.default.pOI.findUnique({
        where: { id },
        include: {
            translations: true,
            menuItems: true,
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        }
    });
};
exports.findPOIById = findPOIById;
const updatePOI = async (id, data) => {
    return prisma_1.default.pOI.update({
        where: { id },
        data
    });
};
exports.updatePOI = updatePOI;
const deletePOI = async (id) => {
    return prisma_1.default.pOI.delete({
        where: { id }
    });
};
exports.deletePOI = deletePOI;
const findAllPOIs = async (filters = {}) => {
    return prisma_1.default.pOI.findMany({
        where: filters,
        include: {
            translations: true
        }
    });
};
exports.findAllPOIs = findAllPOIs;
const findPOIsByOwner = async (ownerId) => {
    return prisma_1.default.pOI.findMany({
        where: { ownerId },
        include: {
            translations: true
        }
    });
};
exports.findPOIsByOwner = findPOIsByOwner;
//# sourceMappingURL=poi.repo.js.map