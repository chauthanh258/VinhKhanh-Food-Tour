"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTranslation = exports.upsertTranslation = exports.createTranslation = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createTranslation = async (data) => {
    return prisma_1.default.pOITranslation.create({ data });
};
exports.createTranslation = createTranslation;
const upsertTranslation = async (poiId, language, data) => {
    return prisma_1.default.pOITranslation.upsert({
        where: {
            poiId_language: { poiId, language }
        },
        update: data,
        create: { ...data, poiId, language }
    });
};
exports.upsertTranslation = upsertTranslation;
const deleteTranslation = async (id) => {
    return prisma_1.default.pOITranslation.delete({
        where: { id }
    });
};
exports.deleteTranslation = deleteTranslation;
//# sourceMappingURL=translation.repo.js.map