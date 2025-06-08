import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n-config'; // Import from the new config file

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)']
};
