
import Link from "next/link"
import { Leaf, Languages, Menu } from "lucide-react" // Added Languages icon
import { ThemeToggleButton } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze Label" },
  { href: "/recipes", label: "Recipes" },
  { href: "/nutrition-check", label: "Nutrition Check" },
  { href: "/blogs", label: "Blog" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            Swasth Bharat Advisor
          </span>
        </Link>
        
        {/* Spacer to push subsequent items to the right */}
        <div className="flex-1" />

        {/* Right-aligned items */}
        <div className="flex items-center space-x-2">
          {/* Desktop Navigation (now on the right) */}
          <nav className="hidden items-center space-x-4 md:flex mr-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ThemeToggleButton />

          {/* New Translate Button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9" 
            onClick={() => console.log('Translate button clicked')}
          >
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Translate Language</span>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 pt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md p-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
