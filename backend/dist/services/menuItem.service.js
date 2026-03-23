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
exports.deleteMenuItem = exports.updateMenuItem = exports.addMenuItem = void 0;
const menuItemRepo = __importStar(require("../repositories/menuItem.repo"));
const poiRepo = __importStar(require("../repositories/poi.repo"));
const error_middleware_1 = require("../middlewares/error.middleware");
const addMenuItem = async (poiId, userId, userRole, data) => {
    const poi = await poiRepo.findPOIById(poiId);
    if (!poi)
        throw new error_middleware_1.AppError(404, 'POI not found');
    if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
        throw new error_middleware_1.AppError(403, 'You do not have permission to add menu items to this POI');
    }
    return menuItemRepo.createMenuItem({
        ...data,
        poi: { connect: { id: poiId } }
    });
};
exports.addMenuItem = addMenuItem;
const updateMenuItem = async (id, userId, userRole, data) => {
    const item = await menuItemRepo.findMenuItemById(id);
    if (!item)
        throw new error_middleware_1.AppError(404, 'Menu item not found');
    const poi = await poiRepo.findPOIById(item.poiId);
    if (!poi)
        throw new error_middleware_1.AppError(404, 'POI not found');
    if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
        throw new error_middleware_1.AppError(403, 'You do not have permission to update this menu item');
    }
    return menuItemRepo.updateMenuItem(id, data);
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = async (id, userId, userRole) => {
    const item = await menuItemRepo.findMenuItemById(id);
    if (!item)
        throw new error_middleware_1.AppError(404, 'Menu item not found');
    const poi = await poiRepo.findPOIById(item.poiId);
    if (!poi)
        throw new error_middleware_1.AppError(404, 'POI not found');
    if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
        throw new error_middleware_1.AppError(403, 'You do not have permission to delete this menu item');
    }
    return menuItemRepo.deleteMenuItem(id);
};
exports.deleteMenuItem = deleteMenuItem;
//# sourceMappingURL=menuItem.service.js.map