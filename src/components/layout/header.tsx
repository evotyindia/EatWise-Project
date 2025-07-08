
"use client"

import { Leaf, Home, ScanLine, CookingPot, BarChart3, BookOpen, Mail } from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { cn } from "@/lib/utils";
import '../common/theme-toggle-button.css';

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
      "sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-sm"
    )}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-extrabold text-2xl sm:inline-block font-headline text-foreground">
            EatWise India
          </span>
        </Link>

        {/* Desktop nav + theme toggle */}
        <div className="hidden md:flex items-center gap-4">
            <nav className="items-center space-x-1 flex">
                {navItems.map((item) => {
                const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium transition-colors duration-300 rounded-md",
                        isActive 
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    >
                    {item.label}
                    </Link>
                );
                })}
            </nav>
            <ThemeToggleButton />
        </div>

        {/* Mobile theme toggle */}
        <div className="md:hidden">
            <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}
