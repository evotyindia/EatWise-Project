"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com/eatwiseindia" },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com/eatwiseindia" },
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com/eatwiseindia" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, url: "https://linkedin.com/company/eatwiseindia" },
    { name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com/c/eatwiseindia" },
  ];

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2 font-headline text-primary">EatWise India</h3>
            <p className="text-sm text-muted-foreground">
              Empowering India to Eat Smarter with AI. Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 font-headline text-primary">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link href="/analyze" className="text-sm text-muted-foreground hover:text-primary transition-colors">Analyze Label</Link></li>
              <li><Link href="/recipes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Recipe Suggestions</Link></li>
              <li><Link href="/nutrition-check" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nutrition Check</Link></li>
              <li><Link href="/blogs" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blogs</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 font-headline text-primary">Connect With Us</h3>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <TooltipProvider key={social.name}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="cursor-not-allowed inline-block">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-transparent group transition-all duration-300 ease-in-out opacity-70 cursor-not-allowed"
                          title={social.name}
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="pointer-events-none">
                            {React.cloneElement(social.icon, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" })}
                          </span>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Coming Soon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Follow us on social media for tips, updates, and community discussions.
            </p>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {currentYear} EatWise India. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2 md:mt-0">
            AI for a Healthier You.
          </p>
        </div>
      </div>
    </footer>
  )
}
