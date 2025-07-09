"use client"

import { Leaf, Home, ScanLine, CookingPot, BarChart3, BookOpen, Mail, User, LogOut, UserCog, History } from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { cn } from "@/lib/utils";
import '../common/theme-toggle-button.css';
import { Button } from "../ui/button";

const navItems = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/analyze", label: "Analyze Label", icon: <ScanLine className="h-5 w-5" /> },
  { href: "/recipes", label: "Recipes", icon: <CookingPot className="h-5 w-5" /> },
  { href: "/nutrition-check", label: "Nutrition Check", icon: <BarChart3 className="h-5 w-5" /> },
  { href: "/history", label: "History", icon: <History className="h-5 w-5" /> },
  { href: "/blogs", label: "Blogs", icon: <BookOpen className="h-5 w-5" /> },
  { href: "/contact", label: "Contact", icon: <Mail className="h-5 w-5" />},
]

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for logged-in user
    const user = localStorage.getItem("loggedInUser");
    setIsLoggedIn(!!user);
  }, [pathname]); // Re-check on path change

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-sm"
    )}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-extrabold text-2xl sm:inline-block font-headline">
            {mounted ? (
              <>
                <span className="text-primary">EatWise</span>
                <span className="text-accent"> India</span>
              </>
            ) : (
              // This placeholder renders on the server and initial client render, avoiding mismatch.
              <span className="text-primary">EatWise India</span>
            )}
          </span>
        </Link>

        {/* Desktop nav + theme toggle */}
        <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1 flex-wrap">
                {navItems.map((item) => {
                const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium transition-colors duration-300 rounded-md",
                        isActive 
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    >
                    {item.label}
                    </Link>
                );
                })}
            </nav>
            <div className="flex items-center gap-2">
              {mounted && isLoggedIn ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/account">
                      <UserCog className="mr-2 h-4 w-4" /> Account
                    </Link>
                  </Button>
                ) : (
                   mounted && <Button asChild size="sm">
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" /> Login
                    </Link>
                  </Button>
                )}
              <ThemeToggleButton />
            </div>
        </div>
      </div>
    </header>
  )
}
