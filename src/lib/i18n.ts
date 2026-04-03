export type Lang = 'en' | 'es';

export const defaultLang: Lang = 'en';
export const supportedLangs: Lang[] = ['en', 'es'];

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (supportedLangs.includes(lang as Lang)) {
    return lang as Lang;
  }
  return defaultLang;
}

export async function useTranslations(lang: Lang) {
  const translations = await import(`../i18n/${lang}.json`);
  return translations.default;
}
