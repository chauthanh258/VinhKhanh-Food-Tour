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
exports.deletePOI = exports.updatePOI = exports.createPOI = exports.getPOIDetails = exports.streamDescriptionTts = exports.getNearbyPOIs = void 0;
const poiService = __importStar(require("../services/poi.service"));
const response_util_1 = require("../utils/response.util");
const getNearbyPOIs = async (req, res, next) => {
    try {
        const { lat, lng, radius, lang } = req.query;
        const pois = await poiService.listNearbyPOIs(parseFloat(lat), parseFloat(lng), parseInt(radius || '1000'), lang || 'vi');
        (0, response_util_1.sendResponse)(res, 200, pois);
    }
    catch (error) {
        next(error);
    }
};
exports.getNearbyPOIs = getNearbyPOIs;
/** Stream MP3: Google TTS for `description` of resolved translation (matches UI language + fallbacks). */
const streamDescriptionTts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const uiLang = req.query.lang || 'vi';
        const buffer = await poiService.getPoiDescriptionTtsBuffer(id, uiLang);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.send(buffer);
    }
    catch (error) {
        next(error);
    }
};
exports.streamDescriptionTts = streamDescriptionTts;
const getPOIDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const poi = await poiService.getPOIDetails(id);
        (0, response_util_1.sendResponse)(res, 200, poi);
    }
    catch (error) {
        next(error);
    }
};
exports.getPOIDetails = getPOIDetails;
const createPOI = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const poi = await poiService.createNewPOI(userId, req.body);
        (0, response_util_1.sendResponse)(res, 201, poi, 'POI created successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.createPOI = createPOI;
const updatePOI = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const poi = await poiService.updatePOIAsOwner(id, userId, userRole, req.body);
        (0, response_util_1.sendResponse)(res, 200, poi, 'POI updated successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.updatePOI = updatePOI;
const deletePOI = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        await poiService.deletePOI(id, userId, userRole);
        (0, response_util_1.sendResponse)(res, 200, null, 'POI deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deletePOI = deletePOI;
//# sourceMappingURL=poi.controller.js.map