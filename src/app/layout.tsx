
import type { Metadata } from 'next';
import './globals.css';
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { Poppins, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { BottomNavbar } from '@/components/layout/bottom-navbar';

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EatWise India - AI Nutrition Guide',
  description: 'Understand food labels, get health ratings, recipe suggestions, and nutrition analysis with AI. For a healthier India with EatWise India.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-body antialiased flex flex-col",
          fontPoppins.variable,
          fontInter.variable
      )}>
        {/* This script runs before React hydrates to prevent the flash of light theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // Fallback to dark if localStorage is disabled
    document.documentElement.classList.add('dark');
  }
})();
            `,
          }}
        />
        <CustomThemeProvider>
          <Header />
          <main className="flex-grow pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <Toaster />
          <BottomNavbar />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
