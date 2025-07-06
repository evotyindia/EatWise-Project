
import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ScanLine, MessageCircle, CookingPot, BarChart3, Users, Lightbulb, User, UploadCloud, Cpu, ClipboardCheck } from "lucide-react";

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

  return (
    <div className="flex flex-col min-h-screen">
      <section className="hero-section w-full">
        <div className="relative z-10 container px-4 md:px-6 text-center animate-fade-in-up opacity-0 backdrop-blur-sm py-20 md:py-28 lg:py-32" style={{animationFillMode: 'forwards'}}>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
            EatWise India
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/90 md:text-xl mt-4">
            Empowering India to Eat Smarter with AI
          </p>
          <p className="mx-auto max-w-[600px] text-foreground/80 md:text-lg mt-2">
            Your personal AI-powered nutrition guide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <Link href="/analyze">Analyze a Food Label</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <Link href="/recipes">Get Recipe Ideas</Link>
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
                    <Link href={feature.link}>Try Now <CheckCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                  </Button>
                </CardFooter>
              </Card>
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
