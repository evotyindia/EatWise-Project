
import React from "react";
import { Mail, Phone, Share2, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function ContactPage() {
  const contactEmail = "support@eatwiseindia.com";
  const contactPhone = "+91-123-456-7890";

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, url: "#" },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, url: "#" },
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, url: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, url: "#" },
  ];

  return (
    <div className="container mx-auto py-12 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-12 text-center">
        <Share2 className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          We&apos;d love to hear from you! Reach out through any of the channels below.
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
            <a href={`mailto:${contactEmail}`} className="text-accent hover:underline font-medium flex items-center">
              <Mail className="mr-2 h-5 w-5" /> {contactEmail}
            </a>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Phone className="mr-3 h-7 w-7 text-accent" /> Phone Support
            </CardTitle>
            <CardDescription>Mon-Fri, 9 AM - 6 PM IST</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <p className="text-muted-foreground">
              For urgent matters, you can call us on our support line.
            </p>
            <a href={`tel:${contactPhone}`} className="text-accent hover:underline font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5" /> {contactPhone}
            </a>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12 max-w-4xl mx-auto" />

      <Card className="max-w-4xl mx-auto transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl justify-center">
            <Share2 className="mr-3 h-7 w-7 text-accent" /> Connect With Us
          </CardTitle>
          <CardDescription className="text-center">
            Stay updated and engage with our community.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              size="lg"
              asChild
              className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/10 group"
            >
              <Link href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                {React.cloneElement(social.icon, { className: "h-6 w-6 mr-2 group-hover:text-accent transition-colors" })}
                {social.name}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
