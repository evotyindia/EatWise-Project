
"use client"

import { Home, ScanLine, CookingPot, Menu, BarChart3, Mail, User, LogOut, UserCog, Save, BookOpen } from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "../common/theme-toggle-button";
import { Button } from "../ui/button";
import { useAuth } from "../common/AuthManager";

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analyze", label: "Analyze", icon: ScanLine },
  { href: "/recipes", label: "Recipes", icon: CookingPot },
  { href: "/nutrition-check", label: "Nutrition", icon: BarChart3 },
];

const moreNavItems = [
    { href: "/saved", label: "Saved", icon: Save },
    { href: "/blogs", label: "Blogs", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Mail},
];

const moreNavPaths = moreNavItems.map(item => item.href).concat(['/account']);

export function BottomNavbar() {
  const pathname = usePathname();
  const { isLoggedIn, isLoading, logout } = useAuth();
  
  const isMoreSectionActive = !isLoading && moreNavPaths.some(path => pathname.startsWith(path));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t shadow-[0_-1px_10px_rgba(0,0,0,0.05)] backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="container flex items-center justify-around h-20 max-w-screen-xl px-2">
        {mainNavItems.map((item) => {
          const isActive = !isLoading && ((item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href)));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200",
                 isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full py-1.5 transition-all duration-300",
                  isActive ? "bg-secondary px-6" : "bg-transparent px-4"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-xs",
                isActive ? "font-semibold" : "font-normal"
              )}>{item.label}</span>
            </Link>
          );
        })}
        <Sheet>
          <SheetTrigger asChild>
             <button className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200",
                isMoreSectionActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}>
                <div className={cn(
                    "flex items-center justify-center rounded-full py-1.5 transition-all duration-300",
                    isMoreSectionActive ? "bg-secondary px-6" : "bg-transparent px-4"
                )}>
                    <Menu className="h-5 w-5" />
                </div>
                <span className={cn(
                    "text-xs",
                    isMoreSectionActive ? "font-semibold" : "font-normal"
                )}>More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-full h-auto rounded-t-2xl">
            <SheetHeader className="text-left mb-4 pr-12">
              <div className="flex items-center justify-between">
                <SheetTitle>More Options</SheetTitle>
                <ThemeToggleButton />
              </div>
              <SheetDescription>
                Additional pages and settings.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-2">
              {moreNavItems.map((item) => {
                const isActive = !isLoading && pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3 text-base font-medium transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                )
              })}
              {/* Conditional Login/Logout Button */}
              {!isLoading && (
                isLoggedIn ? (
                  <>
                  <SheetClose asChild>
                     <Link
                      href="/account"
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3 text-base font-medium transition-colors text-foreground hover:bg-muted",
                         !isLoading && pathname.startsWith('/account') && "bg-primary text-primary-foreground"
                      )}
                    >
                      <UserCog className="h-5 w-5" />
                      <span>Account Settings</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                     <Button variant="ghost" onClick={logout} className="flex items-center justify-start gap-3 rounded-lg p-3 text-base font-medium text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                     <Link
                      href="/login"
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3 text-base font-medium transition-colors text-foreground hover:bg-muted"
                      )}
                    >
                      <User className="h-5 w-5" />
                      <span>Login / Signup</span>
                    </Link>
                  </SheetClose>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
