
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {locales, pathnames, localePrefix} from './i18n.config'; // Import from new config file

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, pathnames, localePrefix});
