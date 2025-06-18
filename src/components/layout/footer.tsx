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

  const footerLinkClass = "text-sm text-slate-600 dark:text-slate-400 hover:text-primary hover:underline underline-offset-4 transition-colors duration-200";

  return (
    <footer className="bg-background border-t border-border/40">
      {/* Main Footer Content Area */}
      <div className="bg-slate-100 dark:bg-slate-800/50">
        <div className="container py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12 lg:gap-x-16">

            {/* Branding Section */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col">
              <Link href="/" className="flex items-center space-x-2.5 mb-5 group">
                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-accent/10 transition-colors duration-300">
                    <Leaf className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300 ease-in-out transform group-hover:rotate-12" />
                </div>
                <span className="font-bold text-3xl font-headline text-slate-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 ease-in-out">
                  EatWise India
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-md mb-6 text-slate-600 dark:text-slate-400">
                Empowering India to Eat Smarter with AI. Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions for a conscious lifestyle.
              </p>
               <div className="flex space-x-3 mt-auto pt-4"> {/* mt-auto to push to bottom if this col is taller */}
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full w-10 h-10 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-all duration-300 ease-in-out hover:scale-110 shadow-sm"
                    title={social.name}
                  >
                    <Link href={social.url} target="_blank" rel="noopener noreferrer">
                      {React.cloneElement(social.icon, { className: "h-5 w-5" })}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="md:col-span-6 lg:col-span-3 lg:col-start-7"> {/* Adjusted col-start for wider screens */}
              <h3 className="text-lg font-semibold mb-5 font-headline text-primary dark:text-primary-foreground/90">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/analyze" className={footerLinkClass}>Analyze Label</Link></li>
                <li><Link href="/recipes" className={footerLinkClass}>Recipe Suggestions</Link></li>
                <li><Link href="/nutrition-check" className={footerLinkClass}>Nutrition Check</Link></li>
                <li><Link href="/blogs" className={footerLinkClass}>Our Blogs</Link></li>
                <li><Link href="/contact" className={footerLinkClass}>Contact Us</Link></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="md:col-span-6 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-5 font-headline text-primary dark:text-primary-foreground/90">Resources</h3>
              <ul className="space-y-3">
                 <li><Link href="/#features" className={footerLinkClass}>Features</Link></li>
                 <li><Link href="/#how-it-works" className={footerLinkClass}>How It Works</Link></li>
                 <li><Link href="/#mission" className={footerLinkClass}>Our Mission</Link></li>
                 <li><p className="text-sm text-slate-500 dark:text-slate-500">Privacy Policy (TBD)</p></li>
                 <li><p className="text-sm text-slate-500 dark:text-slate-500">Terms of Service (TBD)</p></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-background dark:bg-neutral-950 py-4 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {currentYear} EatWise India. All Rights Reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-0">
              AI for a Healthier You. Made in India.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
