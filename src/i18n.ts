
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'hi', 'bn', 'mr'] as const;
export const defaultLocale = 'en' as const;

export const pathnames = {
  '/': '/',
  '/analyze': '/analyze',
  '/blogs': '/blogs',
  '/nutrition-check': '/nutrition-check',
  '/recipes': '/recipes',
} satisfies Pathnames<typeof locales>;

export const localePrefix = 'as-needed';

export default getRequestConfig(async ({locale}) => {
  // Basic validation, though we are forcing 'en' below for testing
  if (!locales.includes(locale as any)) {
    console.warn(`[i18n.ts] Warning: Requested locale "${locale}" is not in the defined locales. Will attempt to load 'en.json'.`);
    //ตก Even if locale is invalid, we'll try 'en' for this test.
  }

  let messages;
  try {
    console.log(`[i18n.ts] Attempting to statically load messages from ./messages/en.json for locale: ${locale}`);
    // DIAGNOSTIC: Force loading 'en.json'
    messages = (await import('./messages/en.json')).default;
    console.log(`[i18n.ts] Successfully loaded messages from ./messages/en.json`);
  } catch (error) {
    console.error(`[i18n.ts] CRITICAL: Could not load messages from ./messages/en.json. Error:`, error);
    // If even the static import fails, then there's a deeper issue with module resolution or file access.
    notFound(); // Gracefully handle as not found
  }

  return {messages};
});
