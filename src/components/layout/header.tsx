"use client"

import { Leaf, Menu, Languages as LanguagesIcon } from "lucide-react"
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/navigation'; // Use from next-intl/navigation
import React from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { locales } from '@/i18n-config';


export function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t('navHome') },
    { href: "/analyze", label: t('navAnalyze') },
    { href: "/recipes", label: t('navRecipes') },
    { href: "/nutrition-check", label: t('navNutrition') },
    { href: "/blogs", label: t('navBlog') },
  ]

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    if (typeof window !== "undefined") {
      localStorage.setItem('preferredLocale', newLocale);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            {t('siteTitle')}
          </span>
        </Link>
        
        <nav className="hidden items-center space-x-4 md:flex flex-1 justify-end mr-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggleButton />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <LanguagesIcon className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{t('translateLanguage')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  disabled={locale === loc}
                >
                  {t(`../Locales.${loc}` as any)} {}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 pt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md p-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
