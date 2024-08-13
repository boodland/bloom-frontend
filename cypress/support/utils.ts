export type LOCALES = 'en' | 'es' | 'hi' | 'fr' | 'pt' | 'de';

export const getLocalePageUrl = (pageUrl: string, locale: LOCALES = 'en') => {
  return `${Cypress.config('baseUrl')}/${locale}/${pageUrl}`;
};
