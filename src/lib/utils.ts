import type { Lang } from './i18n';

export function getLocalizedPath(path: string, lang: Lang): string {
  const cleanPath = path.replace(/^\/(en|es)/, '');
  return `/${lang}${cleanPath || '/'}`;
}

export function removeLangFromPath(path: string): string {
  return path.replace(/^\/(en|es)/, '') || '/';
}
