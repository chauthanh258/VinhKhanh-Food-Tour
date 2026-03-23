"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const poi_routes_1 = __importDefault(require("./poi.routes"));
const owner_routes_1 = __importDefault(require("./owner.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const menuItem_routes_1 = __importDefault(require("./menuItem.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/pois', poi_routes_1.default);
router.use('/', owner_routes_1.default); // Using '/' because it has owners/:ownerId/pois
router.use('/admin', admin_routes_1.default);
router.use('/', menuItem_routes_1.default); // Using '/' because it has pois/:poiId/menu-items and menu-items/:id
exports.default = router;
//# sourceMappingURL=index.js.map