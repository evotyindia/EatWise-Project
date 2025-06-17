
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found (404) | EatWise India',
  description: 'The page you are looking for could not be found. Please check the URL or return to the homepage.',
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4 md:px-6 text-center">
      <AlertTriangle className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-5xl font-bold tracking-tight mb-4 font-headline">
        404 - Page Not Found
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved or deleted.
      </p>
      <Button asChild size="lg" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Return to Homepage
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground mt-12">
        If you believe this is an error, please feel free to <Link href="/contact" className="underline hover:text-primary">contact us</Link>.
      </p>
    </div>
  );
}
