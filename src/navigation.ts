
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {locales, pathnames, localePrefix} from './i18n';

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, pathnames, localePrefix});
