
import type { Metadata } from 'next';
import './globals.css';
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { Poppins, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { BottomNavbar } from '@/components/layout/bottom-navbar';
import { AuthManager } from '@/components/common/AuthManager';

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
  icons: {
    icon: '/favicon.ico',
  },
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
          "min-h-screen bg-background font-body antialiased flex flex-col pb-24 md:pb-0",
          fontPoppins.variable,
          fontInter.variable
      )}>
        <svg display="none" style={{ position: 'absolute', width: 0, height: 0 }}>
          <symbol id="light" viewBox="0 0 24 24">
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(0,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(45,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(90,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(135,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(180,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(225,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(270,12,12)" />
              <line x1="12" y1="17" x2="12" y2="20" transform="rotate(315,12,12)" />
            </g>
            <circle fill="currentColor" cx="12" cy="12" r="5" />
          </symbol>
          <symbol id="dark" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.1,14.9c-3-0.5-5.5-3-6-6C8.8,7.1,9.1,5.4,9.9,4c0.4-0.8-0.4-1.7-1.2-1.4C4.6,4,1.8,7.9,2,12.5c0.2,5.1,4.4,9.3,9.5,9.5c4.5,0.2,8.5-2.6,9.9-6.6c0.3-0.8-0.6-1.7-1.4-1.2C18.6,14.9,16.9,15.2,15.1,14.9z" />
          </symbol>
        </svg>
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
          <AuthManager>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster />
            <BottomNavbar />
          </AuthManager>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
