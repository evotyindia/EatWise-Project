
"use client"

import { Leaf, Menu } from "lucide-react"
import { Link, usePathname } from '@/navigation'; 
import React, { useState, useEffect } from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
      // Set to true if scrolled more than 20px, false otherwise
      setScrolled(window.scrollY > 20);
    };

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);
    // Call handler right away so state is correct on initial mount if page is already scrolled
    handleScroll();

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
      scrolled 
        ? "bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 shadow-lg border-b border-border" 
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Logo (far left) */}
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            EatWise India
          </span>
        </Link>

        {/* Right aligned group: Desktop Nav + Theme/Mobile Toggles */}
        <div className="flex items-center space-x-4"> {/* Outer group for all right-side items */}
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex"> {/* Reduced space-x-1 for tighter packing with bg */}
            {navItems.map((item) => {
              const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors px-3 py-1.5 rounded-md", // Added padding and rounded-md
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle and Mobile Menu Trigger */}
          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            {/* Mobile Menu - only trigger is visible on desktop, content shown on mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden"> {/* md:hidden ensures this only shows on mobile */}
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 pt-8">
                  {navItems.map((item) => {
                    const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-md p-3 text-lg font-medium", // Increased padding for mobile
                          isActive 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
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
