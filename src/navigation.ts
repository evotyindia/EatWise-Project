import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {locales} from './i18n-config'; // Import from the new config file

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix: 'as-needed'});
