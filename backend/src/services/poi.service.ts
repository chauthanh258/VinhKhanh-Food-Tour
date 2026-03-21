import * as poiRepo from '../repositories/poi.repo';
import * as translationRepo from '../repositories/translation.repo';
import { AppError } from '../middlewares/error.middleware';

export const createNewPOI = async (ownerId: string, data: any) => {
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

export const getPOIDetails = async (id: string) => {
  const poi = await poiRepo.findPOIById(id);
  if (!poi) {
    throw new AppError(404, 'POI not found');
  }
  return poi;
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

  if (translations && Array.isArray(translations)) {
    for (const trans of translations) {
      const { language, ...transData } = trans;
      await translationRepo.upsertTranslation(poiId, language, transData);
    }
  }

  return poiRepo.findPOIById(poiId);
};

export const deletePOI = async (poiId: string, userId: string, userRole: string) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to delete this POI');
  }

  return poiRepo.deletePOI(poiId);
};

export const listNearbyPOIs = async (lat: number, lng: number, radius: number, lang: string) => {
  const allPois = await poiRepo.findAllPOIs({ isActive: true });

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  return allPois
    .map(poi => {
      const distance = getDistance(lat, lng, poi.lat, poi.lng);
      const translation = poi.translations.find(t => t.language === lang) || poi.translations[0];
      return {
        ...poi,
        distance: Math.round(distance),
        translation
      };
    })
    .filter(poi => poi.distance <= radius && poi.translation)
    .sort((a, b) => a.distance - b.distance);
};
