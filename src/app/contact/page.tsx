
import React from "react";
import { Mail, Phone, Share2, Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { NextPage, Metadata } from 'next';

const BASE_URL = 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "Contact Us | EatWise India",
  description: "Get in touch with the EatWise India team for support, feedback, or inquiries. We're here to help you on your journey to healthier eating.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
};

const ContactPage: NextPage = () => {
  const contactEmail = "support@eatwiseindia.com"; 
  const contactPhone = "+91-123-456-7890"; 

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, url: "https://facebook.com/eatwiseindia" }, 
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, url: "https://twitter.com/eatwiseindia" },   
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, url: "https://instagram.com/eatwiseindia" }, 
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, url: "https://linkedin.com/company/eatwiseindia" }, 
    { name: "YouTube", icon: <Youtube className="h-6 w-6" />, url: "https://youtube.com/c/eatwiseindia" }, 
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-5 inline-block">
            <MessageSquare className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">Contact Us</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, reach out through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-border hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-accent">
              <Mail className="mr-3 h-7 w-7" /> Email Us
            </CardTitle>
            <CardDescription>For general inquiries, support, or feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Please feel free to email us. We aim to respond within 24-48 business hours.
            </p>
            <Button variant="outline" asChild className="text-base hover:bg-accent/10 hover:text-accent border-accent/50">
                <a href={`mailto:${contactEmail}`} className="font-medium flex items-center">
                <Mail className="mr-2 h-5 w-5" /> {contactEmail}
                </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-border hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-accent">
              <Phone className="mr-3 h-7 w-7" /> Phone Support
            </CardTitle>
            <CardDescription>Available Mon-Fri, 9 AM - 6 PM IST.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <p className="text-muted-foreground">
              For urgent matters or if you prefer to call, use our support line.
            </p>
            <Button variant="outline" asChild className="text-base hover:bg-accent/10 hover:text-accent border-accent/50">
                <a href={`tel:${contactPhone}`} className="font-medium flex items-center">
                <Phone className="mr-2 h-5 w-5" /> {contactPhone}
                </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-16 max-w-4xl mx-auto border-border" />

      <Card className="max-w-4xl mx-auto shadow-xl transition-shadow duration-300 rounded-xl border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-2xl justify-center text-primary">
            <Share2 className="mr-3 h-7 w-7" /> Connect With Us
          </CardTitle>
          <CardDescription className="text-center mt-1">
            Stay updated, join discussions, and be part of the EatWise India community on social media.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2 pb-4">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              size="lg"
              asChild
              className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/5 hover:border-primary group text-base py-2.5 px-5 rounded-lg"
            >
              <Link href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                {React.cloneElement(social.icon, { className: "h-5 w-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" })}
                {social.name}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

       <Separator className="my-16 max-w-4xl mx-auto border-border" />

       <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center text-primary mb-4">
                 <MapPin className="w-8 h-8 mr-2" />
                <h2 className="text-2xl sm:text-3xl font-semibold">Our Office</h2>
            </div>
            <address className="text-muted-foreground not-italic space-y-0.5 text-base">
                <p>EatWise India Headquarters</p>
                <p>123 Health Street, Nutrition Nagar</p>
                <p>Bengaluru, Karnataka, India - 560001</p>
            </address>
            <div className="mt-8">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15552.095176380716!2d77.58639704003026!3d12.970080891368713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf802837a2d1d7cde!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="350" 
                    style={{ border:0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="EatWise India Office Location"
                    className="rounded-xl shadow-lg border border-border"
                ></iframe>
            </div>
        </div>

    </div>
  );
}

export default ContactPage;
