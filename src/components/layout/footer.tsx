
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Leaf } from 'lucide-react';
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
    <footer className="border-t bg-muted/20 dark:bg-card/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
             <Link href="/" className="flex items-center space-x-2 mb-3 group">
                <Leaf className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
                <span className="font-bold text-xl font-headline text-primary group-hover:text-accent transition-colors">
                    EatWise India
                </span>
            </Link>
            <p className="text-sm text-muted-foreground pr-4">
              Empowering India to Eat Smarter with AI. Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/analyze" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">Analyze Label</Link></li>
              <li><Link href="/recipes" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">Recipe Suggestions</Link></li>
              <li><Link href="/nutrition-check" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">Nutrition Check</Link></li>
              <li><Link href="/blogs" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">Blogs</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline text-primary">Connect With Us</h3>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full hover:bg-primary/10 hover:border-primary group transition-all duration-300 ease-in-out hover:scale-110 border-border"
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
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {currentYear} EatWise India. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2 md:mt-0">
            AI for a Healthier You. Made with <span className="text-red-500">❤</span> in India.
          </p>
        </div>
      </div>
    </footer>
  )
}
