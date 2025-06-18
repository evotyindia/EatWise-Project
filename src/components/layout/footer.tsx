
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

  const footerWaveSvgLight = `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1200 120' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 C150,120 300,0 450,60 C600,120 750,0 900,60 C1050,120 1200,60 1200,60 L1200,120 L0,120 Z' fill='%23f1f5f9'/%3E%3C/svg%3E")`; // hsl(220, 13%, 96%) ~ slate-100
  const footerWaveSvgDark = `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1200 120' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 C150,120 300,0 450,60 C600,120 750,0 900,60 C1050,120 1200,60 1200,60 L1200,120 L0,120 Z' fill='%231e293b'/%3E%3C/svg%3E")`; // hsl(215, 28%, 17%) ~ slate-800


  return (
    <footer className="bg-background text-foreground/90 border-t border-border/60">
      <div 
        className="relative pt-20 pb-12 md:pb-16 bg-muted dark:bg-neutral-900 overflow-hidden"
      >
        {/* Decorative SVG Wave - Light mode */}
        <div 
            className="absolute top-0 left-0 w-full h-[100px] sm:h-[120px] dark:hidden" 
            style={{ backgroundImage: footerWaveSvgLight, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'bottom center' }}
            aria-hidden="true"
        ></div>
        {/* Decorative SVG Wave - Dark mode */}
        <div 
            className="absolute top-0 left-0 w-full h-[100px] sm:h-[120px] hidden dark:block" 
            style={{ backgroundImage: footerWaveSvgDark, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'bottom center' }}
            aria-hidden="true"
        ></div>

        <div className="container relative z-10"> {/* Ensure content is above the SVG */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10 md:mb-12">
            
            <div className="md:col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-5 group">
                  <Leaf className="h-9 w-9 text-primary group-hover:text-accent transition-colors duration-300 ease-in-out transform group-hover:rotate-12" />
                  <span className="font-bold text-3xl font-headline text-primary group-hover:text-accent transition-colors duration-300 ease-in-out">
                      EatWise India
                  </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Empowering India to Eat Smarter with AI. Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions for a conscious lifestyle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-5 font-headline text-primary">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/analyze" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors duration-200">Analyze Label</Link></li>
                <li><Link href="/recipes" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors duration-200">Recipe Suggestions</Link></li>
                <li><Link href="/nutrition-check" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors duration-200">Nutrition Check</Link></li>
                <li><Link href="/blogs" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors duration-200">Our Blogs</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors duration-200">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-5 font-headline text-primary">Connect With Us</h3>
              <div className="flex space-x-2.5 mb-4">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-lg hover:bg-primary/10 hover:border-primary/60 group transition-all duration-300 ease-in-out hover:scale-110 border-border/80 shadow-sm"
                    title={social.name}
                  >
                    <Link href={social.url} target="_blank" rel="noopener noreferrer">
                      {React.cloneElement(social.icon, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" })}
                    </Link>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/90 leading-normal">
                Follow us on social media for the latest tips, feature updates, and community health discussions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-background dark:bg-neutral-950 py-6 border-t border-border/70">
        <div className="container">
            <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <p className="text-xs text-muted-foreground">
                © {currentYear} EatWise India. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-0">
                AI for a Healthier You. Made with <span className="text-red-500 animate-pulse">❤</span> in India.
            </p>
            </div>
        </div>
      </div>
    </footer>
  )
}
