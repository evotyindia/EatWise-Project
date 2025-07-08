"use client"

import { Menu, Leaf, Home, ScanLine, CookingPot, BarChart3, BookOpen, Mail } from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/analyze", label: "Analyze Label", icon: <ScanLine className="h-5 w-5" /> },
  { href: "/recipes", label: "Recipes", icon: <CookingPot className="h-5 w-5" /> },
  { href: "/nutrition-check", label: "Nutrition Check", icon: <BarChart3 className="h-5 w-5" /> },
  { href: "/blogs", label: "Blog", icon: <BookOpen className="h-5 w-5" /> },
  { href: "/contact", label: "Contact", icon: <Mail className="h-5 w-5" />},
]

export function Header() {
  const pathname = usePathname();

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/80 shadow-md backdrop-blur-xl"
    )}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-primary" />
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
                <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-sm">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Main navigation menu for the website.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 pt-8">
                    {navItems.map((item) => {
                      const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg p-3 text-base font-medium transition-colors",
                              isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                            )}
                          >
                            {item.icon}
                            <span>{item.label}</span>
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
