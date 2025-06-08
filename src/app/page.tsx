
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ScanLine, MessageCircle, CookingPot, BarChart3 } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <ScanLine className="h-10 w-10 text-primary" />,
      title: "Smart Label Analysis",
      description: "Upload or type in food label details. Our AI deciphers ingredients, detects risks, and gives a health rating.",
      link: "/analyze",
      dataAiHint: "food label scanning"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Contextual AI Chat",
      description: "Ask questions about the analyzed product. Get personalized advice from our AI nutrition assistant.",
      link: "/analyze",
      dataAiHint: "nutrition chat bot"
    },
    {
      icon: <CookingPot className="h-10 w-10 text-primary" />,
      title: "Indian Recipe Suggestions",
      description: "Tell us what ingredients you have, and get healthy, simple Indian meal ideas.",
      link: "/recipes",
      dataAiHint: "indian cuisine recipes"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Nutrition Tracking",
      description: "Analyze nutritional information from labels or manual input to understand your food's balance.",
      link: "/nutrition-check",
      dataAiHint: "nutrition facts chart"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
            Swasth Bharat Advisor
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4 font-headline">
            Empowering India to Eat Smarter with AI
          </p>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mt-2">
            Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions.
            Your personal AI-powered nutrition guide.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105">
              <Link href="/analyze">Analyze a Label</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-transform duration-300 ease-in-out hover:scale-105">
              <Link href="/recipes">Get Recipe Ideas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
            Features Overview
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-center md:text-xl mt-4">
            Everything you need to make informed food choices.
          </p>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button variant="link" asChild className="px-0 mt-2 text-primary">
                    <Link href={feature.link}>Learn More <CheckCircle className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Our platform uses cutting-edge AI to simplify nutrition for you.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">1. Input Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a food label image, or manually enter ingredients and nutritional facts.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">2. AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Google Cloud Vision API extracts text, and Gemini API analyzes for health insights, ratings, and alternatives.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">3. Get Smart Advice</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a comprehensive report, chat with our AI for clarifications, or get recipe ideas based on your preferences.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="How it works illustration"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              data-ai-hint="app interface diagram"
            />
          </div>
        </div>
      </section>

      <section id="screenshots" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
            See It In Action
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-center md:text-xl mt-4 mb-12">
            A glimpse into the Swasth Bharat Advisor experience.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { src: "https://placehold.co/600x400.png", alt: "Label Analyzer Screenshot", dataAiHint: "app screenshot analysis" },
              { src: "https://placehold.co/600x400.png", alt: "Recipe Suggestion Screenshot", dataAiHint: "app screenshot recipe" },
              { src: "https://placehold.co/600x400.png", alt: "AI Chat Screenshot", dataAiHint: "app screenshot chat" },
            ].map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  className="aspect-video object-cover"
                  data-ai-hint={img.dataAiHint}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
