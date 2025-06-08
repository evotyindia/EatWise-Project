import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './i18n-config';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.warn(`Invalid locale "${locale}" requested. Falling back to "${defaultLocale}".`);
    const messages = (await import(`./messages/${defaultLocale}.json`)).default;
    return {messages};
  }

  // Provide a static import for messages supported by this application.
  const messages = (await import(`./messages/${locale}.json`)).default;

  return {messages};
});
