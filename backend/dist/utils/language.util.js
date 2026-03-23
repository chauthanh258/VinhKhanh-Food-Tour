"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbLangToGoogleTts = exports.resolvePoiTranslation = exports.normalizeUiLangToDbLang = void 0;
/** Map onboarding / UI codes to ISO-style codes stored in DB */
const normalizeUiLangToDbLang = (lang) => {
    const map = { jp: 'ja', kr: 'ko' };
    return map[lang] || lang;
};
exports.normalizeUiLangToDbLang = normalizeUiLangToDbLang;
/**
 * Pick the translation row for the user's language, with sensible fallbacks.
 * TTS voice must match the actual text language (the row we picked).
 */
const resolvePoiTranslation = (translations, uiLang) => {
    if (!translations?.length)
        return undefined;
    const dbLang = (0, exports.normalizeUiLangToDbLang)(uiLang);
    return (translations.find((t) => t.language === uiLang) ||
        translations.find((t) => t.language === dbLang) ||
        translations.find((t) => t.language === 'en') ||
        translations.find((t) => t.language === 'vi') ||
        translations[0]);
};
exports.resolvePoiTranslation = resolvePoiTranslation;
/** Language code for google-tts-api (must match spoken language of the text) */
const dbLangToGoogleTts = (lang) => {
    const map = {
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
exports.dbLangToGoogleTts = dbLangToGoogleTts;
//# sourceMappingURL=language.util.js.map