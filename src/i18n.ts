import {getRequestConfig} from 'next-intl/server';
import { locales } from './i18n.config'; // Import from new config file
import {notFound} from 'next/navigation';

// All other exports (locales, defaultLocale, pathnames, localePrefix) are now in i18n.config.ts
// This file now ONLY exports the default getRequestConfig

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is a valid locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = (await import(`./messages/${locale}.json`)).default;
  return {messages};
});
