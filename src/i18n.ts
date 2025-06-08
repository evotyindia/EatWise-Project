import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'hi', 'bn', 'mr'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Potentially redirect to a default locale or handle error
    // For now, we'll load English messages as a fallback
    // but in a real app, you might want to throw an error or redirect.
    console.warn(`Invalid locale "${locale}" requested. Falling back to "${defaultLocale}".`);
    const messages = (await import(`@/messages/${defaultLocale}.json`)).default;
    return {messages};
  }
 
  // Provide a static import for messages supported by this application.
  const messages = (await import(`@/messages/${locale}.json`)).default;
 
  return {messages};
});