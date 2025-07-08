
"use client"

import { Leaf, Menu } from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze Label" },
  { href: "/recipes", label: "Recipes" },
  { href: "/nutrition-check", label: "Nutrition Check" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact"},
]

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      isScrolled 
        ? "border-border/50 bg-[#f9f9fe]/80 dark:bg-background/80 shadow-lg backdrop-blur-xl"
        : "border-transparent"
    )}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="font-extrabold text-2xl sm:inline-block font-headline text-foreground">
            EatWise India
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center space-x-1 md:flex">
            {navItems.map((item) => {
              const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-[#f9f9fe]/90 dark:bg-background/90 backdrop-blur-xl">
                  <nav className="flex flex-col space-y-4 pt-8">
                    {navItems.map((item) => {
                      const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "rounded-lg p-3 text-base font-medium transition-colors",
                              isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
