
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
      scrolled 
        ? "bg-[#f1f1ff]/70 dark:bg-background/70 backdrop-blur-xl shadow-md border-b border-white/10" 
        : "bg-transparent"
    )}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-accent" />
          <span className="font-bold text-lg sm:inline-block font-headline text-primary">
            EatWise India
          </span>
        </Link>

        <nav className="hidden items-center space-x-2 md:flex">
          {navItems.map((item) => {
            const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors px-3 py-2 rounded-md",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-primary"
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
              <SheetContent side="right" className="w-[280px] bg-[#f1f1ff]/90 dark:bg-background/90 backdrop-blur-xl">
                <nav className="flex flex-col space-y-4 pt-8">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-md p-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
