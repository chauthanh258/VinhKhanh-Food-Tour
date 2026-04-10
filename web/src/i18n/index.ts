import { useUserStore } from '@/store/userStore';
import VI, { type Translations } from './locales/VI';
import EN from './locales/EN';
import ZH from './locales/ZH';
import HI from './locales/HI';
import ES from './locales/ES';
import FR from './locales/FR';
import AR from './locales/AR';
import PT from './locales/PT';
import RU from './locales/RU';
import ID from './locales/ID';
import JA from './locales/JA';
import KO from './locales/KO';
import DE from './locales/DE';
import IT from './locales/IT';
import TH from './locales/TH';


const translations: Record<string, Translations> = {
  vi: VI,
  en: EN,
  zh: ZH,
  hi: HI,
  es: ES,
  fr: FR,
  ar: AR,
  pt: PT,
  ru: RU,
  id: ID,
  ja: JA,
  ko: KO,
  de: DE,
  it: IT,
  th: TH,
};

/**
 * Hook to access the current language's translations.
 * Falls back to Vietnamese if the language is not supported.
 */
export function useTranslation(): Translations {
  const language = useUserStore((s) => s.language);
  return translations[language] ?? EN;
}

export { VI, EN, ZH, HI, ES, FR, AR, PT, RU, ID, JA, KO, DE, IT, TH };
export type { Translations };
