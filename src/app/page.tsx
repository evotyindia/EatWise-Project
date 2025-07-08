
import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, ScanLine, MessageCircle, CookingPot, BarChart3 as ChartColumn, Users, Target, Lightbulb, User, UploadCloud, Cpu, ClipboardCheck, Utensils, Smile, MapPin, ShieldCheck, HeartPulse, Leaf } from "lucide-react";
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

=======
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ScanLine, MessageCircle, CookingPot, BarChart3, Users, Lightbulb, User, UploadCloud, Cpu, ClipboardCheck, ArrowRight, Leaf } from "lucide-react";
>>>>>>> finalprotest

export default function Home() {
  const features = [
    {
<<<<<<< HEAD
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
=======
      icon: <ScanLine className="h-10 w-10 text-accent" />,
      title: "Smart Label Analysis",
      description: "Upload or type in food label details. Our AI deciphers ingredients, gives a health rating, and suggests healthier Indian alternatives.",
      link: "/analyze",
    },
    {
      icon: <CookingPot className="h-10 w-10 text-accent" />,
      title: "AI Recipe Suggestions",
      description: "Tell us what ingredients you have. Our AI chef will suggest healthy, simple Indian meal ideas tailored to your needs.",
      link: "/recipes",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-accent" />,
      title: "Detailed Nutrition Check",
      description: "Input nutrition values to get a detailed AI analysis of the food's balance, nutrient density, and dietary suitability.",
      link: "/nutrition-check",
    },
     {
      icon: <MessageCircle className="h-10 w-10 text-accent" />,
      title: "Contextual AI Chat",
      description: "After analyzing a product or recipe, ask specific questions and get personalized advice from our AI nutrition assistant.",
      link: "/analyze",
    },
>>>>>>> finalprotest
  ];

  const testimonials = [
    {
      quote: "This app has changed how my family eats! Understanding labels is so much easier now, and the Indian alternatives are fantastic.",
      name: "Priya S.",
      location: "Mumbai, MH",
<<<<<<< HEAD
      animationDelay: "delay-100"
=======
>>>>>>> finalprotest
    },
    {
      quote: "As a busy professional, planning healthy meals was tough. The recipe suggestions based on my ingredients are a lifesaver!",
      name: "Rahul K.",
      location: "Bengaluru, KA",
<<<<<<< HEAD
      animationDelay: "delay-200"
=======
>>>>>>> finalprotest
    },
    {
      quote: "I finally understand what's in packaged foods. The AI chat helps clarify any doubts I have. Highly recommended!",
      name: "Aisha B.",
      location: "Delhi, DL",
<<<<<<< HEAD
      animationDelay: "delay-300"
    }
  ];

  const howItWorksSteps = [
    {
      icon: <UploadCloud className="w-8 h-8" />,
      title: "1. Input Your Data",
      description: "Upload a food label image, or manually enter ingredients and nutritional facts.",
      animationDelay: "delay-100"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "2. AI Analysis",
      description: "Our advanced AI models extract text, analyze for health insights, ratings, and alternatives.",
      animationDelay: "delay-200"
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/35 via-background to-accent/35 overflow-hidden">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
            EatWise India
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4 font-headline animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out delay-200">
            Empowering India to Eat Smarter with AI
          </p>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mt-2 animate-in fade-in slide-in-from-bottom-14 duration-700 ease-out delay-300">
            Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions. Your personal AI-powered nutrition guide for a healthier lifestyle.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-700 ease-out delay-400">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg">
              <Link href="/analyze">Analyze a Food Label</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 border-primary text-primary hover:bg-primary/5 hover:shadow-md">
              <Link href="/recipes">Get Recipe Ideas</Link>
=======
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="hero-section w-full">
        <div className="relative z-10 container px-4 md:px-6 text-center animate-fade-in-up opacity-0 backdrop-blur-md py-24 md:py-32 lg:py-40" style={{animationFillMode: 'forwards'}}>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
            Welcome to <span className="text-primary">EatWise India</span>
          </h1>
          <p className="mt-4 text-2xl font-medium tracking-tight text-foreground/90">
            Decode Your Food. Unleash Your Health.
          </p>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-6">
            Your intelligent nutrition partner, designed for India. Simply scan a food label or list your ingredients, and let our AI provide instant health reports, personalized recipe ideas, and healthier local alternatives. Make every bite a conscious, healthy choice.
          </p>
          <div className="mt-10 flex flex-col items-center sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/40 group">
              <Link href="/analyze">Start Analyzing <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 border-2 border-input hover:bg-accent/10">
              <Link href="/recipes">Find a Recipe</Link>
>>>>>>> finalprotest
            </Button>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
=======
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
          <div className="text-center mb-12">
            <Lightbulb className="mx-auto h-12 w-12 text-accent mb-4" />
>>>>>>> finalprotest
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unlock a Healthier You
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Our AI-powered tools provide comprehensive insights for informed food choices.
            </p>
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className={`group transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out ${feature.animationDelay}`}>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="px-0 mt-2 text-primary group-hover:text-primary/80 transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-95">
=======
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col text-center items-center p-4">
                <CardHeader className="items-center pb-2">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>

                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="px-0 mt-2 text-accent group">
>>>>>>> finalprotest
                    <Link href={feature.link}>Try Now <CheckCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section id="why-choose-us" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose EatWise India?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Your Smart Companion for Healthier Eating in India.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {whyChoosePoints.slice(0, 3).map((point) => (
              <div key={point.title} className={`flex flex-col items-center text-center p-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:bg-card rounded-lg animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out ${point.animationDelay}`}>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-2 lg:gap-x-16 md:px-16 lg:px-32">
             {whyChoosePoints.slice(3).map((point) => (
              <div key={point.title} className={`flex flex-col items-center text-center p-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:bg-card rounded-lg animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out ${point.animationDelay}`}>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-200">
        <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center animate-in fade-in slide-in-from-left-20 duration-1000 ease-out delay-200">
            <Image
              src="/img/mission-community-image.jpg"
              alt="Our mission: Diverse group of people enjoying healthy Indian food"
              width={600}
              height={450}
              className="rounded-xl shadow-lg transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-[1.03]"
              data-ai-hint="healthy food community"
            />
          </div>
          <div className="animate-in fade-in slide-in-from-right-20 duration-1000 ease-out delay-200">
            <Target className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Mission
            </h2>
            <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              To empower every Indian with the knowledge and tools to make healthier food choices, demystifying nutrition labels and promoting traditional healthy eating habits through accessible AI technology with EatWise India.
            </p>
            <ul className="mt-6 space-y-4">
              {[{title: "Simplify Nutrition", desc: "Break down complex food information into easy-to-understand insights.", delay: "delay-300"},
               {title: "Promote Healthy Alternatives", desc: "Highlight nutritious Indian food options and recipes.", delay: "delay-400"},
               {title: "Foster Awareness", desc: "Educate users about hidden ingredients and making informed choices.", delay: "delay-500"}].map(item => (
                <li key={item.title} className={`flex items-start animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out ${item.delay}`}>
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
             <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-600">
                <Link href="/blogs">Read Our Blogs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
=======
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
          <div className="text-center mb-12">
>>>>>>> finalprotest
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
<<<<<<< HEAD
              Our platform uses cutting-edge AI to simplify nutrition for you in three easy steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className={`flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:border-primary border border-transparent hover:-translate-y-1.5 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out ${step.animationDelay}`}>
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary text-primary-foreground">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
=======
              Simplify nutrition in three easy steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent text-accent-foreground">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Input Data</h3>
              <p className="text-sm text-muted-foreground">
                Upload a food label image, or manually enter ingredients and nutritional facts.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent text-accent-foreground">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes the data for health insights, ratings, and healthy alternatives.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent text-accent-foreground">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Smart Advice</h3>
              <p className="text-sm text-muted-foreground">
                Receive a comprehensive report and chat with our AI for clarifications.
              </p>
            </div>
>>>>>>> finalprotest
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <Users className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Loved by Users Across India
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Hear what our community is saying about EatWise India.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className={`bg-card flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1.5 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out ${testimonial.animationDelay}`}>
=======
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
          <div className="text-center mb-12">
            <Users className="mx-auto h-12 w-12 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Loved by Users Across India
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
>>>>>>> finalprotest
                <CardContent className="pt-6 pb-4 flex-grow">
                  <blockquote className="text-lg italic text-foreground/90">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </CardContent>
                <CardFooter className="flex items-center gap-4 pt-0 pb-6 px-6">
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

<<<<<<< HEAD
      <section id="call-to-action" className="w-full py-16 md:py-28 lg:py-36 bg-primary text-primary-foreground overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-200">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            Ready to Make Healthier Choices?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out delay-200">
            Join thousands of Indians on their journey to better nutrition. Start analyzing, learning, and cooking with EatWise India today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out delay-400">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg">
              <Link href="/analyze">Start Analyzing Labels</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-md">
              <Link href="/nutrition-check">Check Nutrition Facts</Link>
            </Button>
          </div>
=======
      <section id="call-to-action" className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center animate-fade-in-up opacity-0" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Make Healthier Choices?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8">
            Join thousands of Indians on their journey to better nutrition. Start analyzing, learning, and cooking with EatWise India today!
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
            <Link href="/analyze">Start Analyzing Now</Link>
          </Button>
>>>>>>> finalprotest
        </div>
      </section>
    </div>
  );
}
