
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { ScanLine, MessageCircle, CookingPot, BarChart3, Users, Lightbulb, User, UploadCloud, Cpu, ClipboardCheck, ArrowRight, Leaf, ShieldCheck, Smile, Target, Utensils, BookOpen } from "lucide-react";
import type { WebApplication } from 'schema-dts';
import Script from 'next/script';
import { blogPosts } from "@/lib/blog-data";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
  ];

  const whyChoosePoints = [
    {
      icon: <Cpu className="h-10 w-10 text-primary" />,
      title: "AI-Powered Precision",
      description: "Harness advanced AI to decode complex food labels and nutritional data in seconds, providing you with accurate, quick insights.",
    },
    {
      icon: <CookingPot className="h-10 w-10 text-primary" />,
      title: "Culturally Relevant Advice",
      description: "Discover healthier Indian food alternatives and recipes tailored to local tastes and dietary preferences, making healthy eating enjoyable.",
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
      title: "Clear & Actionable Guidance",
      description: "Receive straightforward health ratings, risk highlights, and practical suggestions, empowering confident food choices.",
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: "Comprehensive Nutrition Tools",
      description: "From analyzing processed foods to suggesting wholesome recipes, access a suite of tools for a holistic approach to your diet.",
    },
    {
      icon: <Smile className="h-10 w-10 text-primary" />,
      title: "User-Friendly Experience",
      description: "Navigate your path to better health with an intuitive interface, making nutritional awareness accessible to everyone.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Personalized for You",
      description: "Get advice that adapts to your needs, from dietary restrictions to the number of people in your household.",
    }
  ];

  const testimonials = [
    {
      quote: "This app has changed how my family eats! Understanding labels is so much easier now, and the Indian alternatives are fantastic.",
      name: "Priya S.",
      location: "Mumbai, MH",
    },
    {
      quote: "As a busy professional, planning healthy meals was tough. The recipe suggestions based on my ingredients are a lifesaver!",
      name: "Rahul K.",
      location: "Bengaluru, KA",
    },
    {
      quote: "I finally understand what's in packaged foods. The AI chat helps clarify any doubts I have. Highly recommended!",
      name: "Aisha B.",
      location: "Delhi, DL",
    }
  ];

  const howItWorksSteps = [
    {
      icon: <UploadCloud className="w-8 h-8" />,
      title: "1. Input Your Data",
      description: "Upload a food label image, or manually enter ingredients and nutritional facts.",
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "2. AI Analysis",
      description: "Our advanced AI models extract text, analyze for health insights, ratings, and alternatives.",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "3. Get Smart Advice",
      description: "Receive a comprehensive report, chat with our AI for clarifications, or get recipe ideas.",
    }
  ];

  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
       <Script
        id="webapplication-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WebAppStructuredData) }}
      />
      <section className="hero-section w-full">
        <div className="relative z-10 container px-4 md:px-6 text-center animate-fade-in-up opacity-0 backdrop-blur-md py-24 md:py-32 lg:py-40" style={{animationFillMode: 'forwards'}}>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
            Welcome to <span className="text-primary">EatWise</span><span className="text-accent"> India</span>
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
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
          <div className="text-center mb-12">
            <Lightbulb className="mx-auto h-12 w-12 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unlock a Healthier You
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Our AI-powered tools provide comprehensive insights for informed food choices.
            </p>
          </div>
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
                    <Link href={feature.link}>Try Now <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="our-mission" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 md:px-6">
            <div className="grid items-center gap-8">
                <div className="space-y-4 animate-in fade-in duration-500 ease-out text-center">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Our Mission</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Empowering Healthier Choices, Together</h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed mx-auto">
                        At EatWise India, our mission is to bridge the gap between complex nutritional science and everyday food choices. We believe that everyone deserves to understand what's in their food. By harnessing the power of AI, we provide clear, culturally relevant, and actionable insights, helping you navigate your health journey with confidence and ease.
                    </p>
                </div>
            </div>
        </div>
      </section>

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
            {whyChoosePoints.map((point) => (
              <div key={point.title} className="flex flex-col items-center text-center p-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:bg-card rounded-lg">
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

      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Simplify nutrition in three easy steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent text-accent-foreground">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section id="from-the-blog" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 md:px-6">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
                <BookOpen className="mx-auto h-12 w-12 text-accent mb-4" />
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    From Our Blog
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                    Get the latest insights on nutrition, healthy recipes, and wellness tips.
                </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-12 duration-500 ease-out">
                {latestPosts.map((post) => (
                    <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6 flex-grow">
                            <p className="text-sm text-accent font-medium mb-1">{post.category}</p>
                            <Link href={`/blogs/${post.slug}`}>
                                <CardTitle className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </CardTitle>
                            </Link>
                            <CardDescription className="mt-2 text-sm line-clamp-3">{post.preview}</CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button variant="link" asChild className="px-0 text-primary group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                                <Link href={`/blogs/${post.slug}`}>
                                    Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-16 duration-500 ease-out">
                <Button asChild size="lg" variant="outline" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                    <Link href="/blogs">View All Articles</Link>
                </Button>
            </div>
        </div>
      </section>

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
        </div>
      </section>
    </div>
  );
}
