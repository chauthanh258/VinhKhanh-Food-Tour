/** Minimal shape for resolving locale (avoids tight coupling to Prisma exports). */
export type PoiTranslationRow = {
  language: string;
  description: string | null;
};

/** Map onboarding / UI codes to ISO-style codes stored in DB */
export const normalizeUiLangToDbLang = (lang: string): string => {
  const map: Record<string, string> = { jp: 'ja', kr: 'ko', cn: 'zh-CN', zh: 'zh-CN' };
  return map[lang] || lang;
};

/** Language code for google-tts-api (must match spoken language of the text) */
export const dbLangToGoogleTts = (lang: string): string => {
  const map: Record<string, string> = {
    vi: 'vi', en: 'en', ja: 'ja', jp: 'ja', ko: 'ko', kr: 'ko',
    zh: 'zh-CN', 'zh-CN': 'zh-CN', fr: 'fr', es: 'es', de: 'de',
    it: 'it', ru: 'ru', th: 'th', id: 'id', ms: 'ms', pt: 'pt', ar: 'ar'
  };
  return map[lang] || 'en';
};
