
import Image from "next/image";
import { Link } from '@/navigation'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, ScanLine, MessageCircle, CookingPot, BarChart3 as ChartColumn, Users, Target, Lightbulb, User } from "lucide-react"; // Added User

export default function Home() {
  const features = [
    {
      icon: <ScanLine className="h-10 w-10 text-primary" />,
      title: "Smart Label Analysis", 
      description: "Upload or type in food label details. Our AI deciphers ingredients, detects risks, gives a health rating, and suggests healthier Indian alternatives.",
      link: "/analyze",
      dataAiHint: "food label scanning"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Contextual AI Chat",
      description: "After analyzing a product, ask specific questions. Get personalized advice from our AI nutrition assistant based on the report.",
      link: "/analyze",
      dataAiHint: "nutrition chat bot"
    },
    {
      icon: <CookingPot className="h-10 w-10 text-primary" />,
      title: "Indian Recipe Suggestions",
      description: "Tell us what ingredients you have at home, and our AI chef will suggest healthy, simple Indian meal ideas and a quick meal plan.",
      link: "/recipes",
      dataAiHint: "indian cuisine recipes"
    },
    {
      icon: <ChartColumn className="h-10 w-10 text-primary" />,
      title: "Detailed Nutrition Check",
      description: "Upload a nutrition table or manually input values for calories, fats, vitamins, etc. Get a detailed AI analysis of its balance and suitability.",
      link: "/nutrition-check",
      dataAiHint: "nutrition facts chart"
    },
  ];

  const testimonials = [
    {
      quote: "This app has changed how my family eats! Understanding labels is so much easier now, and the Indian alternatives are fantastic.",
      name: "Priya S.",
      location: "Mumbai, MH",
      dataAiHint: "happy family cooking"
    },
    {
      quote: "As a busy professional, planning healthy meals was tough. The recipe suggestions based on my ingredients are a lifesaver!",
      name: "Rahul K.",
      location: "Bengaluru, KA",
      dataAiHint: "busy professional healthy food"
    },
    {
      quote: "I finally understand what's in packaged foods. The AI chat helps clarify any doubts I have. Highly recommended!",
      name: "Aisha B.",
      location: "Delhi, DL",
      dataAiHint: "woman reading food label"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/35 via-background to-accent/35">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
            EatWise India
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4 font-headline">
            Empowering India to Eat Smarter with AI
          </p>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mt-2">
            Understand food labels, analyze ingredients, and get healthy Indian recipe suggestions. Your personal AI-powered nutrition guide for a healthier lifestyle.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <Link href="/analyze">Analyze a Food Label</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 border-primary text-primary hover:bg-primary/5">
              <Link href="/recipes">Get Recipe Ideas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Lightbulb className="mx-auto h-12 w-12 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unlock a Healthier You
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Our AI-powered tools provide comprehensive insights for informed food choices.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="px-0 mt-2 text-primary group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                    <Link href={feature.link}>Try Now <CheckCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section id="mission" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center">
            <Image
              src="/img/mission-community-image.jpg" 
              alt="Our mission: Diverse group of people enjoying healthy Indian food"
              width={600}
              height={450}
              className="rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
              data-ai-hint="healthy food community"
            />
          </div>
          <div>
            <Target className="h-12 w-12 text-accent mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Mission
            </h2>
            <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              To empower every Indian with the knowledge and tools to make healthier food choices, demystifying nutrition labels and promoting traditional healthy eating habits through accessible AI technology with EatWise India.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">Simplify Nutrition</h3>
                  <p className="text-sm text-muted-foreground">
                    Break down complex food information into easy-to-understand insights.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">Promote Healthy Alternatives</h3>
                  <p className="text-sm text-muted-foreground">
                    Highlight nutritious Indian food options and recipes.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">Foster Awareness</h3>
                  <p className="text-sm text-muted-foreground">
                    Educate users about hidden ingredients and making informed choices.
                  </p>
                </div>
              </li>
            </ul>
             <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                <Link href="/blogs">Read Our Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Users className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Loved by Users Across India
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Hear what our community is saying about EatWise India.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-card flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">1</div>
                <div>
                  <h3 className="font-semibold">Input Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a food label image, or manually enter ingredients and nutritional facts.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">2</div>
                <div>
                  <h3 className="font-semibold">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our advanced AI models extract text, analyze for health insights, ratings, and alternatives.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">3</div>
                <div>
                  <h3 className="font-semibold">Get Smart Advice</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a comprehensive report, chat with our AI for clarifications, or get recipe ideas.
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
              className="rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
              data-ai-hint="app interface diagram"
            />
          </div>
        </div>
      </section>

      <section id="call-to-action" className="w-full py-16 md:py-28 lg:py-36 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Make Healthier Choices?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8">
            Join thousands of Indians on their journey to better nutrition. Start analyzing, learning, and cooking with EatWise India today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <Link href="/analyze">Start Analyzing Labels</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <Link href="/nutrition-check">Check Nutrition Facts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
    
