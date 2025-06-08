import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
 
  // Used when no locale matches
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed', // Adds prefix for non-default locales
});
 
export const config = {
  // Match only internationalized pathnames
  // Skip paths for API, static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)']
};