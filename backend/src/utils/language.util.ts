/** Minimal shape for resolving locale (avoids tight coupling to Prisma exports). */
export type PoiTranslationRow = {
  language: string;
  description: string | null;
};

/** Map onboarding / UI codes to ISO-style codes stored in DB */
export const normalizeUiLangToDbLang = (lang: string): string => {
  const map: Record<string, string> = { jp: 'ja', kr: 'ko' };
  return map[lang] || lang;
};

/**
 * Pick the translation row for the user's language, with sensible fallbacks.
 * TTS voice must match the actual text language (the row we picked).
 */
export const resolvePoiTranslation = (
  translations: PoiTranslationRow[],
  uiLang: string
): PoiTranslationRow | undefined => {
  if (!translations?.length) return undefined;
  const dbLang = normalizeUiLangToDbLang(uiLang);
  return (
    translations.find((t) => t.language === uiLang) ||
    translations.find((t) => t.language === dbLang) ||
    translations.find((t) => t.language === 'en') ||
    translations.find((t) => t.language === 'vi') ||
    translations[0]
  );
};

/** Language code for google-tts-api (must match spoken language of the text) */
export const dbLangToGoogleTts = (lang: string): string => {
  const map: Record<string, string> = {
    vi: 'vi',
    en: 'en',
    ja: 'ja',
    jp: 'ja',
    ko: 'ko',
    kr: 'ko',
    zh: 'zh-CN',
  };
  return map[lang] || 'en';
};
