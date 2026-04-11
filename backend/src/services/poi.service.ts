import * as poiRepo from '../repositories/poi.repo';
import * as translationRepo from '../repositories/translation.repo';
import * as auditService from './audit.service';
import * as moderationService from './moderation.service';
import { AppError } from '../middlewares/error.middleware';
import { dbLangToGoogleTts, normalizeUiLangToDbLang } from '../utils/language.util';
import { synthesizeTextToMp3Buffer } from './tts.service';
import { translate } from '@vitalets/google-translate-api';
import { destroyCloudinaryAsset, uploadAudioBuffer, uploadImageBuffer } from '../utils/cloudinary';

const TRANSLATION_CACHE_TTL_MS = 10_000;
type CachedTranslationTts = { text: string; audioBase64: string; expiresAt: number };

const translationCache = new Map<string, CachedTranslationTts>();

export const createNewPOI = async (ownerId: string, data: any) => {
  const { lat, lng, categoryId, translations } = data;

  const poi = await poiRepo.createPOI({
    lat,
    lng,
    category: categoryId ? { connect: { id: categoryId } } : undefined,
    owner: { connect: { id: ownerId } },
    status: 'PENDING',
    isActive: false,
    submittedAt: new Date(),
  });

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const { language, ...transData } = translations[0];
    await translationRepo.createTranslation({
      ...transData,
      poi: { connect: { id: poi.id } }
    });
  }

  // Tạo yêu cầu duyệt
  await moderationService.createRequest({
    type: 'POI_CREATE',
    targetId: poi.id,
    requesterId: ownerId,
  });

  const poiResult = await poiRepo.findPOIById(poi.id);
  return {
    ...poiResult,
    translations: poiResult?.translations ? [poiResult.translations] : []
  };
};

export const getPOIDetails = async (id: string) => {
  const poi = await poiRepo.findPOIById(id);
  if (!poi) {
    throw new AppError(404, 'POI not found');
  }
  return {
    ...poi,
    translations: poi.translations ? [poi.translations] : []
  };
};

export const updatePOIAsOwner = async (poiId: string, userId: string, userRole: string, data: any) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  // Authorization check
  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to update this POI');
  }

  const { translations, ...poiData } = data;

  if (poiData.lat !== undefined || poiData.lng !== undefined || poiData.isActive !== undefined) {
    await poiRepo.updatePOI(poiId, poiData);
  }

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const { language, ...transData } = translations[0];
    await translationRepo.upsertTranslation(poiId, transData);
  }

  const poiResult = await poiRepo.findPOIById(poiId);
  return {
    ...poiResult,
    translations: poiResult?.translations ? [poiResult.translations] : []
  };
};

export const uploadPOIMedia = async (
  poiId: string,
  userId: string,
  userRole: string,
  files: {
    image?: Express.Multer.File[];
    audio?: Express.Multer.File[];
  }
) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to update this POI');
  }

  const translation = poi.translations?.[0];
  if (!translation) {
    throw new AppError(404, 'POI translation not found');
  }

  const imageFile = files.image?.[0];
  const audioFile = files.audio?.[0];

  if (!imageFile && !audioFile) {
    throw new AppError(400, 'No media file uploaded');
  }

  const nextData: Record<string, string | undefined> = {};
  const cleanupTasks: Array<Promise<void>> = [];

  if (imageFile) {
    const uploadedImage = await uploadImageBuffer(
      imageFile.buffer,
      `poi-${poiId}-image-${Date.now()}`
    );
    nextData.imageUrl = uploadedImage.secure_url;
    nextData.imagePublicId = uploadedImage.public_id;
    if (translation.imagePublicId) {
      cleanupTasks.push(destroyCloudinaryAsset(translation.imagePublicId, 'image'));
    }
  }

  if (audioFile) {
    const uploadedAudio = await uploadAudioBuffer(
      audioFile.buffer,
      `poi-${poiId}-audio-${Date.now()}`
    );
    nextData.audioUrl = uploadedAudio.secure_url;
    nextData.audioPublicId = uploadedAudio.public_id;
    if (translation.audioPublicId) {
      cleanupTasks.push(destroyCloudinaryAsset(translation.audioPublicId, 'video'));
    }
  }

  const updatedTranslation = await translationRepo.updateTranslationByPoiId(poiId, nextData);
  await Promise.all(cleanupTasks);

  return updatedTranslation;
};

export const deletePOI = async (poiId: string, userId: string, userRole: string) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to delete this POI');
  }

  // Only admin can actually delete POI. Owner can only request deletion
  if (userRole !== 'ADMIN') {
    throw new AppError(403, 'Owner cannot directly delete POI. Please contact admin for deletion requests.');
  }

  return poiRepo.deletePOI(poiId);
};

export const requestDeletePOI = async (poiId: string, userId: string, userRole: string) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to delete this POI');
  }

  // Owner can request deletion, admin can directly delete
  if (userRole === 'ADMIN') {
    throw new AppError(400, 'Admin should use direct delete instead of request');
  }

  // Tạo yêu cầu duyệt xóa
  await moderationService.createRequest({
    type: 'POI_DELETE',
    targetId: poiId,
    requesterId: userId,
  });

  return {
    ...poi,
    translations: poi.translations ? [poi.translations] : []
  };
};

export const listNearbyPOIs = async (lat: number, lng: number, radius: number, _lang: string) => {
  const allPois = await poiRepo.findAllPOIs({ isActive: true });
  type ListedPoi = (typeof allPois)[number];

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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
    .map((poi: any) => {
      const distance = getDistance(lat, lng, poi.lat, poi.lng);
      // We return the default Vietnamese translation
      const translations = poi.translations ? [poi.translations] : [];
      const translation = translations[0];
      return {
        ...poi,
        translations,
        distance: Math.round(distance),
        translation,
      };
    })
    .filter((poi: any) => poi.distance <= radius && poi.translation)
    .sort((a: any, b: any) => a.distance - b.distance);
};

/** API endpoint logical handler for translations */
export const getTranslatedDescriptionAndTts = async (poiId: string, uiLang: string) => {
  const cacheKey = `${poiId}_${uiLang}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return { text: cached.text, audioBase64: cached.audioBase64 };
    }
    translationCache.delete(cacheKey);
  }

  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) {
    throw new AppError(404, 'POI not found');
  }
  const translations = poi.translations ? [poi.translations] : [];
  const defaultTranslation = translations[0];
  let text = defaultTranslation?.description?.trim();

  if (!defaultTranslation || !text) {
    throw new AppError(404, 'No description available for TTS');
  }

  if (defaultTranslation.audioUrl) {
    return {
      text,
      audioUrl: defaultTranslation.audioUrl,
      audioSource: 'custom',
    };
  }

  const dbLang = normalizeUiLangToDbLang(uiLang);
  if (dbLang !== 'vi') {
    try {
      const { text: translatedText } = await translate(text, { to: dbLang });
      text = translatedText;
    } catch (e) {
      console.warn('Translation failed, falling back to original:', e);
    }
  }

  const googleLang = dbLangToGoogleTts(dbLang);
  const buffer = await synthesizeTextToMp3Buffer(text, googleLang);
  const audioBase64 = buffer.toString('base64');

  const result = {
    text,
    audioBase64: `data:audio/mpeg;base64,${audioBase64}`,
    audioSource: 'generated'
  };
  translationCache.set(cacheKey, {
    ...result,
    expiresAt: Date.now() + TRANSLATION_CACHE_TTL_MS
  });
  return result;
};

export const listOwnerPOIs = async (ownerId: string, filters: any) => {
  return poiRepo.findPOIsByOwnerWithFilters(ownerId, filters);
};
