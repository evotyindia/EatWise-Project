
import React from "react";
import { Mail, Phone, Share2, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Contact Us & Support",
  description: "Get in touch with the EatWise India team. We're here to help with support, feedback, or any inquiries on your journey to healthier eating.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
};

const ContactPage: NextPage = () => {
  const contactEmail = "support@evotyindia.me";
  const contactPhone = "+91-8290610907";

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, url: "https://facebook.com/eatwiseindia" },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, url: "https://twitter.com/eatwiseindia" },
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, url: "https://instagram.com/eatwiseindia" },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, url: "https://linkedin.com/company/eatwiseindia" },
    { name: "YouTube", icon: <Youtube className="h-6 w-6" />, url: "https://youtube.com/c/eatwiseindia" },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className="flex flex-col items-center mb-12">
        <Share2 className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Contact Us</h1>
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          We'd love to hear from you! Reach out through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Mail className="mr-3 h-7 w-7 text-accent" /> General Inquiries
            </CardTitle>
            <CardDescription>For any questions, feedback, or support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Please feel free to email us. We aim to respond within 24-48 business hours.
            </p>
            <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-medium flex items-center">
              <Mail className="mr-2 h-5 w-5" /> {contactEmail}
            </a>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Phone className="mr-3 h-7 w-7 text-accent" /> Phone Support
            </CardTitle>
            <CardDescription>Available during business hours (Mon-Fri, 9 AM - 6 PM IST).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              For urgent matters, you can call us on our support line.
            </p>
            <a href={`tel:${contactPhone}`} className="text-primary hover:underline font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5" /> {contactPhone}
            </a>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12 max-w-4xl mx-auto" />

      <Card className="max-w-4xl mx-auto transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl justify-center">
            <Share2 className="mr-3 h-7 w-7 text-accent" /> Connect With Us on Social Media
          </CardTitle>
          <CardDescription className="text-center">
            Stay updated and engage with our community.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-4">
          <TooltipProvider>
            {socialLinks.map((social) => (
              <Tooltip key={social.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/10 group cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      {React.cloneElement(social.icon, { className: "h-6 w-6 mr-2 group-hover:text-accent transition-colors" })}
                      {social.name}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </CardContent>
      </Card>

      <Separator className="my-12 max-w-4xl mx-auto" />

      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">Our Office</h2>
        <p className="text-muted-foreground mb-1">EatWise India Headquarters</p>
        <p className="text-muted-foreground mb-1">The NorthCap University</p>
        <p className="text-muted-foreground">Huda, Sector 23A, Gurugram, Haryana 122017</p>
        <div className="mt-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7012.311878628939!2d77.0448767!3d28.5049557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d199c98e90ff1%3A0x8b2aa76c53fb738e!2sThe%20NorthCap%20University!5e0!3m2!1sen!2sin!4v1767287111833!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="EatWise India Office Location"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
