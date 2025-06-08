// Remove "use client" if it was added, Footer can be a Server Component
// "use client"; // No longer needed if only using t from server/props or if no translations here yet

import {useTranslations} from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('copyright', {year: currentYear})}
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {t('tagline')}
        </p>
      </div>
    </footer>
  )
}