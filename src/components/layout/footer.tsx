<<<<<<< HEAD

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
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
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full hover:bg-primary/10 hover:border-primary group transition-all duration-300 ease-in-out hover:scale-110"
                  title={social.name}
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    {React.cloneElement(social.icon, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" })}
                  </Link>
                </Button>
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
=======
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t flex-shrink-0">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} EatWise India. All rights reserved.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Empowering India to Eat Smarter.
        </p>
>>>>>>> finalprotest
      </div>
    </footer>
  )
}
