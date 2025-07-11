

"use client"

import { Leaf, Home, ScanLine, CookingPot, BarChart3, BookOpen, Mail, User, LogOut, UserCog, Menu, Save } from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { cn } from "@/lib/utils";
import '../common/theme-toggle-button.css';
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../common/AuthManager";

const navItems = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/analyze", label: "Analyze Label", icon: <ScanLine className="h-5 w-5" /> },
  { href: "/recipes", label: "Recipes", icon: <CookingPot className="h-5 w-5" /> },
  { href: "/nutrition-check", label: "Nutrition Check", icon: <BarChart3 className="h-5 w-5" /> },
  { href: "/saved", label: "Saved", icon: <Save className="h-5 w-5" /> },
  { href: "/blogs", label: "Blogs", icon: <BookOpen className="h-5 w-5" /> },
  { href: "/contact", label: "Contact", icon: <Mail className="h-5 w-5" />},
]

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn, isLoading, logout } = useAuth();

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-sm"
    )}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-extrabold text-2xl sm:inline-block font-headline">
            <>
              <span className="text-primary">EatWise</span>
              <span className="text-accent"> India</span>
            </>
          </span>
        </Link>
        
        {/* Wrapper for right-aligned desktop nav and buttons */}
        <div className="hidden lg-1050:flex items-center gap-4">
            {/* Desktop nav */}
            <nav className="flex items-center gap-1 flex-wrap">
                {navItems.map((item) => {
                const isActive = !isLoading && ((item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href)));
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium transition-colors duration-300 rounded-md",
                        isActive 
                        ? "bg-secondary text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    >
                    {item.label}
                    </Link>
                );
                })}
            </nav>
            
            {/* Account and theme buttons */}
            <div className="flex items-center gap-2">
                {!isLoading && (
                  isLoggedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Account</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="cursor-pointer">
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Account Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button asChild size="sm">
                      <Link href="/login">
                          <User className="mr-2 h-4 w-4" /> Login
                      </Link>
                    </Button>
                  )
                )}
                <ThemeToggleButton />
            </div>
        </div>

        {/* Tablet/Desktop Sidebar Trigger (MD up to lg-1050) */}
        <div className="hidden md:flex lg-1050:hidden items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Main Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
                        <div className="border-b pb-4 mb-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <Leaf className="h-7 w-7 text-primary" />
                                <span className="font-extrabold text-xl font-headline">
                                    <span className="text-primary">EatWise</span>
                                    <span className="text-accent"> India</span>
                                </span>
                            </Link>
                        </div>
                        <nav className="flex flex-col gap-2 flex-grow">
                            {navItems.map((item) => {
                                const isActive = !isLoading && ((item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href)));
                                return (
                                <SheetClose asChild key={item.href}>
                                    <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md p-3 text-base font-medium transition-colors",
                                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                                    )}
                                    >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    </Link>
                                </SheetClose>
                                );
                            })}
                        </nav>
                        <div className="border-t pt-4 mt-4 space-y-3">
                           {!isLoading && (
                             isLoggedIn ? (
                                <>
                                <SheetClose asChild>
                                    <Link href="/account" className="flex items-center gap-3 rounded-md p-3 text-base font-medium transition-colors text-foreground hover:bg-muted">
                                        <UserCog /> Account Settings
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button variant="ghost" onClick={logout} className="w-full justify-start flex items-center gap-3 rounded-md p-3 text-base font-medium text-destructive hover:bg-destructive/10 hover:text-destructive">
                                        <LogOut /> Logout
                                    </Button>
                                </SheetClose>
                                </>
                            ) : (
                                <SheetClose asChild>
                                    <Link href="/login" className="flex items-center gap-3 rounded-md p-3 text-base font-medium transition-colors text-foreground hover:bg-muted">
                                        <User /> Login / Signup
                                    </Link>
                                </SheetClose>
                            )
                           )}
                            <div className="flex justify-center pt-2">
                                <ThemeToggleButton />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

      </div>
    </header>
  )
}
