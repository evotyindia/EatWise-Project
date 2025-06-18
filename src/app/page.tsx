
import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, ScanLine, MessageCircle, CookingPot, BarChart3 as ChartColumn, Users, Target, Lightbulb, User, UploadCloud, Cpu, ClipboardCheck, Utensils, Smile, MapPin, ShieldCheck, HeartPulse, Leaf, ArrowRight } from "lucide-react";
import type { WebApplication } from 'schema-dts';
import Script from 'next/script';

const BASE_URL = 'https://eatwise.evotyindia.me';

const WebAppStructuredData: WebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "EatWise India",
  description: "Empowering India to Eat Smarter with AI. Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions.",
  applicationCategory: "HealthApplication",
  operatingSystem: "WEB",
  url: BASE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR"
  },
  publisher: { 
    "@type": "Organization",
    name: "EatWise India",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/img/logo_200x60.png`,
      width: "200",
      height: "60"
    }
  }
};


export default function Home() {
  const features = [
    {
      icon: <ScanLine className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />,
      title: "Smart Label Analysis",
      description: "Upload or type in food label details. Our AI deciphers ingredients, detects risks, gives a health rating, and suggests healthier Indian alternatives.",
      link: "/analyze",
      dataAiHint: "food label scanning",
      animationDelay: "delay-100"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />,
      title: "Contextual AI Chat",
      description: "After analyzing a product, ask specific questions. Get personalized advice from our AI nutrition assistant based on the report.",
      link: "/analyze", 
      dataAiHint: "nutrition chat bot",
      animationDelay: "delay-200"
    },
    {
      icon: <CookingPot className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />,
      title: "Indian Recipe Suggestions",
      description: "Tell us what ingredients you have at home, and our AI chef will suggest healthy, simple Indian meal ideas and a quick meal plan.",
      link: "/recipes",
      dataAiHint: "indian cuisine recipes",
      animationDelay: "delay-300"
    },
    {
      icon: <ChartColumn className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />,
      title: "Detailed Nutrition Check",
      description: "Upload a nutrition table or manually input values for calories, fats, vitamins, etc. Get a detailed AI analysis of its balance and suitability.",
      link: "/nutrition-check",
      dataAiHint: "nutrition facts chart",
      animationDelay: "delay-400"
    },
  ];

  const whyChoosePoints = [
    {
      icon: <Cpu className="h-10 w-10 text-primary" />,
      title: "AI-Powered Precision",
      description: "Harness advanced AI to decode complex food labels and nutritional data in seconds, providing you with accurate, quick insights.",
      animationDelay: "delay-100"
    },
    {
      icon: <CookingPot className="h-10 w-10 text-primary" />,
      title: "Culturally Relevant Advice",
      description: "Discover healthier Indian food alternatives and recipes tailored to local tastes and dietary preferences, making healthy eating enjoyable.",
      animationDelay: "delay-200"
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
      title: "Clear & Actionable Guidance",
      description: "Receive straightforward health ratings, risk highlights, and practical suggestions, empowering confident food choices.",
      animationDelay: "delay-300"
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: "Comprehensive Nutrition Tools",
      description: "From analyzing processed foods to suggesting wholesome recipes, access a suite of tools for a holistic approach to your diet.",
      animationDelay: "delay-400"
    },
    {
      icon: <Smile className="h-10 w-10 text-primary" />,
      title: "User-Friendly Experience",
      description: "Navigate your path to better health with an intuitive interface, making nutritional awareness accessible to everyone.",
      animationDelay: "delay-500"
    }
  ];

  const testimonials = [
    {
      quote: "This app has changed how my family eats! Understanding labels is so much easier now, and the Indian alternatives are fantastic.",
      name: "Priya S.",
      location: "Mumbai, MH",
      animationDelay: "delay-100"
    },
    {
      quote: "As a busy professional, planning healthy meals was tough. The recipe suggestions based on my ingredients are a lifesaver!",
      name: "Rahul K.",
      location: "Bengaluru, KA",
      animationDelay: "delay-200"
    },
    {
      quote: "I finally understand what's in packaged foods. The AI chat helps clarify any doubts I have. Highly recommended!",
      name: "Aisha B.",
      location: "Delhi, DL",
      animationDelay: "delay-300"
    }
  ];

  const howItWorksSteps = [
    {
      icon: <UploadCloud className="w-10 h-10 text-primary" />,
      title: "1. Input Your Data",
      description: "Upload a food label image, or manually enter ingredients and nutritional facts.",
      animationDelay: "delay-100"
    },
    {
      icon: <Cpu className="w-10 h-10 text-primary" />,
      title: "2. AI Analysis",
      description: "Our advanced AI models extract text, analyze for health insights, ratings, and alternatives.",
      animationDelay: "delay-200"
    },
    {
      icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
      title: "3. Get Smart Advice",
      description: "Receive a comprehensive report, chat with our AI for clarifications, or get recipe ideas.",
      animationDelay: "delay-300"
    }
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Script
        id="webapplication-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WebAppStructuredData) }}
      />
      <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-primary/20 via-background to-accent/20 overflow-hidden">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-primary animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
            EatWise India
          </h1>
          <p className="mx-auto max-w-[750px] text-foreground/80 md:text-xl lg:text-2xl mt-6 font-headline animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out delay-200">
            Empowering India to Eat Smarter with AI
          </p>
          <p className="mx-auto max-w-[650px] text-muted-foreground md:text-lg mt-4 animate-in fade-in slide-in-from-bottom-14 duration-700 ease-out delay-300">
            Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions. Your personal AI-powered nutrition guide for a healthier lifestyle.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-700 ease-out delay-400">
            <Button asChild size="lg" className="text-base py-3 px-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg">
              <Link href="/analyze">Analyze a Food Label</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base py-3 px-8 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 border-primary text-primary hover:bg-primary/5 hover:shadow-md">
              <Link href="/recipes">Get Recipe Ideas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            <Lightbulb className="mx-auto h-14 w-14 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unlock a Healthier You
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Our AI-powered tools provide comprehensive insights for informed food choices.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className={`group transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col bg-card border-border hover:border-primary/50 animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out ${feature.animationDelay} rounded-xl min-w-0`}>
                <CardHeader className="flex flex-row items-start gap-4 pb-3">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="px-0 mt-2 text-primary group-hover:text-accent transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-95 font-semibold">
                    <Link href={feature.link}>Try Now <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <Cpu className="mx-auto h-14 w-14 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple Steps to Smart Eating
            </h2>
            <p className="mt-4 mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Our platform uses cutting-edge AI to simplify nutrition for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className={`flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:border-primary/50 border border-transparent hover:-translate-y-1.5 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out ${step.animationDelay} min-w-0`}>
                <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-choose-us" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            <ShieldCheck className="mx-auto h-14 w-14 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose EatWise India?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Your Smart Companion for Healthier Eating in India.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {whyChoosePoints.map((point) => (
              <div key={point.title} className={`flex flex-col items-center text-center p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:bg-card rounded-xl border border-border animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out ${point.animationDelay} min-w-0`}>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-200">
        <div className="container grid items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center animate-in fade-in slide-in-from-left-20 duration-1000 ease-out delay-200 min-w-0">
            <Image
              src="/img/mission-community-image.jpg"
              alt="Our mission: Diverse group of people enjoying healthy Indian food"
              width={600}
              height={450}
              className="rounded-xl shadow-2xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-[1.03]"
              data-ai-hint="healthy food community"
            />
          </div>
          <div className="animate-in fade-in slide-in-from-right-20 duration-1000 ease-out delay-200 min-w-0">
            <Target className="h-14 w-14 text-accent mb-5" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Mission
            </h2>
            <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              To empower every Indian with the knowledge and tools to make healthier food choices, demystifying nutrition labels and promoting traditional healthy eating habits through accessible AI technology with EatWise India.
            </p>
            <ul className="mt-6 space-y-5">
              {[{title: "Simplify Nutrition", desc: "Break down complex food information into easy-to-understand insights.", delay: "delay-300", icon: <Leaf className="text-primary"/>},
               {title: "Promote Healthy Alternatives", desc: "Highlight nutritious Indian food options and recipes.", delay: "delay-400", icon: <CookingPot className="text-primary"/>},
               {title: "Foster Awareness", desc: "Educate users about hidden ingredients and making informed choices.", delay: "delay-500", icon: <Lightbulb className="text-primary"/>}].map(item => (
                <li key={item.title} className={`flex items-start animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out ${item.delay}`}>
                  <div className="mr-4 mt-1 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 p-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
             <Button asChild size="lg" className="mt-10 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-600 text-base py-3 px-6">
                <Link href="/blogs">Read Our Blogs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <Users className="mx-auto h-14 w-14 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Loved by Users Across India
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Hear what our community is saying about EatWise India.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className={`bg-card flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1.5 border border-border animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out ${testimonial.animationDelay} rounded-xl min-w-0`}>
                <CardContent className="pt-8 pb-6 flex-grow">
                  <blockquote className="text-lg italic text-foreground/90 before:content-['“'] before:mr-1 before:text-2xl before:text-primary after:content-['”'] after:ml-1 after:text-2xl after:text-primary">
                    {testimonial.quote}
                  </blockquote>
                </CardContent>
                <CardFooter className="flex items-center gap-4 pt-0 pb-6 px-6 border-t border-border mt-4 pt-4">
                   <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="call-to-action" className="w-full py-16 md:py-28 lg:py-36 bg-primary text-primary-foreground overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-200">
        <div className="container px-4 md:px-6 text-center">
          <HeartPulse className="mx-auto h-16 w-16 text-background mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000" />
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-5xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            Ready to Make Healthier Choices?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out delay-200">
            Join thousands of Indians on their journey to better nutrition. Start analyzing, learning, and cooking with EatWise India today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out delay-400">
            <Button asChild size="lg" className="text-base py-3 px-8 bg-background text-primary hover:bg-background/90 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg">
              <Link href="/analyze">Start Analyzing Labels</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-base py-3 px-8 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-md bg-background/20 hover:bg-background/30 text-primary-foreground border-primary-foreground/50">
              <Link href="/nutrition-check">Check Nutrition Facts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
