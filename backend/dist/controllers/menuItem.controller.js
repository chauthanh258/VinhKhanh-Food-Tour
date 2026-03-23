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
const menuItemService = __importStar(require("../services/menuItem.service"));
const response_util_1 = require("../utils/response.util");
const addMenuItem = async (req, res, next) => {
    try {
        const { poiId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const item = await menuItemService.addMenuItem(poiId, userId, userRole, req.body);
        (0, response_util_1.sendResponse)(res, 201, item, 'Menu item added successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.addMenuItem = addMenuItem;
const updateMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const item = await menuItemService.updateMenuItem(id, userId, userRole, req.body);
        (0, response_util_1.sendResponse)(res, 200, item, 'Menu item updated successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        await menuItemService.deleteMenuItem(id, userId, userRole);
        (0, response_util_1.sendResponse)(res, 200, null, 'Menu item deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMenuItem = deleteMenuItem;
//# sourceMappingURL=menuItem.controller.js.map