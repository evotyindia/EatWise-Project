
"use client"

import { Leaf, Menu } from "lucide-react"
import { Link, usePathname } from '@/navigation'; 
import React, { useState, useEffect } from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet" 
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze Label" },
  { href: "/recipes", label: "Recipes" },
  { href: "/nutrition-check", label: "Nutrition Check" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact"},
]

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on mount to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
      scrolled 
        ? "bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-md border-b border-border/70" 
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Leaf className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
          <span className="font-bold sm:inline-block font-headline text-lg group-hover:text-primary transition-colors duration-300">
            EatWise India
          </span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden items-center space-x-1 md:flex">
            {navItems.map((item) => {
              const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors px-2 py-1.5 rounded-md", 
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[320px] bg-background/95 backdrop-blur-md">
                <SheetTitle className="sr-only">Main Navigation Menu</SheetTitle> 
                <nav className="flex flex-col space-y-3 pt-10">
                  {navItems.map((item) => {
                    const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <SheetClose asChild key={item.href + "-close"}>
                        <Link
                          href={item.href}
                          className={cn(
                            "rounded-lg p-3 text-base font-medium transition-all duration-200 ease-in-out",
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                              : "hover:bg-accent hover:text-accent-foreground active:scale-95"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
