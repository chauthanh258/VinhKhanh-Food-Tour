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
exports.getPoiDescriptionTtsBuffer = exports.listNearbyPOIs = exports.deletePOI = exports.updatePOIAsOwner = exports.getPOIDetails = exports.createNewPOI = void 0;
const poiRepo = __importStar(require("../repositories/poi.repo"));
const translationRepo = __importStar(require("../repositories/translation.repo"));
const error_middleware_1 = require("../middlewares/error.middleware");
const language_util_1 = require("../utils/language.util");
const tts_service_1 = require("./tts.service");
const createNewPOI = async (ownerId, data) => {
    const { lat, lng, translations } = data;
    const poi = await poiRepo.createPOI({
        lat,
        lng,
        owner: { connect: { id: ownerId } }
    });
    if (translations && Array.isArray(translations)) {
        for (const trans of translations) {
            await translationRepo.createTranslation({
                ...trans,
                poi: { connect: { id: poi.id } }
            });
        }
    }
    return poiRepo.findPOIById(poi.id);
};
exports.createNewPOI = createNewPOI;
const getPOIDetails = async (id) => {
    const poi = await poiRepo.findPOIById(id);
    if (!poi) {
        throw new error_middleware_1.AppError(404, 'POI not found');
    }
    return poi;
};
exports.getPOIDetails = getPOIDetails;
const updatePOIAsOwner = async (poiId, userId, userRole, data) => {
    const poi = await poiRepo.findPOIById(poiId);
    if (!poi)
        throw new error_middleware_1.AppError(404, 'POI not found');
    // Authorization check
    if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
        throw new error_middleware_1.AppError(403, 'You do not have permission to update this POI');
    }
    const { translations, ...poiData } = data;
    if (poiData.lat !== undefined || poiData.lng !== undefined || poiData.isActive !== undefined) {
        await poiRepo.updatePOI(poiId, poiData);
    }
    if (translations && Array.isArray(translations)) {
        for (const trans of translations) {
            const { language, ...transData } = trans;
            await translationRepo.upsertTranslation(poiId, language, transData);
        }
    }
    return poiRepo.findPOIById(poiId);
};
exports.updatePOIAsOwner = updatePOIAsOwner;
const deletePOI = async (poiId, userId, userRole) => {
    const poi = await poiRepo.findPOIById(poiId);
    if (!poi)
        throw new error_middleware_1.AppError(404, 'POI not found');
    if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
        throw new error_middleware_1.AppError(403, 'You do not have permission to delete this POI');
    }
    return poiRepo.deletePOI(poiId);
};
exports.deletePOI = deletePOI;
const listNearbyPOIs = async (lat, lng, radius, lang) => {
    const allPois = await poiRepo.findAllPOIs({ isActive: true });
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    return allPois
        .map((poi) => {
        const distance = getDistance(lat, lng, poi.lat, poi.lng);
        const translation = (0, language_util_1.resolvePoiTranslation)(poi.translations, lang);
        return {
            ...poi,
            distance: Math.round(distance),
            translation,
        };
    })
        .filter((poi) => poi.distance <= radius && poi.translation)
        .sort((a, b) => a.distance - b.distance);
};
exports.listNearbyPOIs = listNearbyPOIs;
/** MP3 buffer for POI description TTS; text + voice match resolved translation row. */
const getPoiDescriptionTtsBuffer = async (poiId, uiLang) => {
    const poi = await poiRepo.findPOIById(poiId);
    if (!poi) {
        throw new error_middleware_1.AppError(404, 'POI not found');
    }
    const translation = (0, language_util_1.resolvePoiTranslation)(poi.translations, uiLang);
    const text = translation?.description?.trim();
    if (!translation || !text) {
        throw new error_middleware_1.AppError(404, 'No description available for TTS');
    }
    const googleLang = (0, language_util_1.dbLangToGoogleTts)(translation.language);
    return (0, tts_service_1.synthesizeTextToMp3Buffer)(text, googleLang);
};
exports.getPoiDescriptionTtsBuffer = getPoiDescriptionTtsBuffer;
//# sourceMappingURL=poi.service.js.map