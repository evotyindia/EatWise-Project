
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
    <footer className="bg-muted/40 dark:bg-neutral-900/50 border-t border-border/60 text-foreground/90">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10 md:mb-12">
          
          <div className="md:col-span-2 lg:col-span-2">
             <Link href="/" className="flex items-center space-x-2.5 mb-4 group">
                <Leaf className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300 ease-in-out" />
                <span className="font-bold text-2xl font-headline text-primary group-hover:text-accent transition-colors duration-300 ease-in-out">
                    EatWise India
                </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Empowering India to Eat Smarter with AI. Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions for a conscious lifestyle.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline text-primary/90">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/analyze" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors">Analyze Label</Link></li>
              <li><Link href="/recipes" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors">Recipe Suggestions</Link></li>
              <li><Link href="/nutrition-check" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors">Nutrition Check</Link></li>
              <li><Link href="/blogs" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors">Our Blogs</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline text-primary/90">Connect With Us</h3>
            <div className="flex space-x-2 mb-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-lg hover:bg-primary/10 hover:border-primary/50 group transition-all duration-300 ease-in-out hover:scale-110 border-border/70 shadow-sm"
                  title={social.name}
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    {React.cloneElement(social.icon, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" })}
                  </Link>
                </Button>
              ))}
            </div>
             <p className="text-xs text-muted-foreground/80 leading-normal">
              Follow us on social media for the latest tips, feature updates, and community health discussions.
            </p>
          </div>
        </div>
        
        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {currentYear} EatWise India. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1 sm:mt-0">
            AI for a Healthier You. Made with <span className="text-red-500 animate-pulse">❤</span> in India.
          </p>
        </div>
      </div>
    </footer>
  )
}
