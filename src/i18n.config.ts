// src/i18n.config.ts
import type { Pathnames } from 'next-intl/navigation';

export const locales = ['en', 'hi', 'bn', 'mr'] as const;
export const defaultLocale = 'en' as const;

export const pathnames = {
  '/': '/',
  '/analyze': '/analyze',
  '/blogs': '/blogs',
  '/nutrition-check': '/nutrition-check',
  '/recipes': '/recipes',
} satisfies Pathnames<typeof locales>;

export const localePrefix = 'as-needed'; // Strategy for prefixing locales in URLs
