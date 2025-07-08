
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { BottomNavbar } from '@/components/layout/bottom-navbar';
import type { WebSite, Organization } from 'schema-dts';
import { Analytics } from "@vercel/analytics/next"

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const websiteStructuredData: WebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EatWise India",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
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

const organizationStructuredData: Organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EatWise India",
  url: BASE_URL,
  logo: `${BASE_URL}/img/logo_200x60.png`,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'EatWise India - AI Nutrition Guide',
    template: '%s | EatWise India',
  },
  description:
    'Understand food labels, get health ratings, recipe suggestions, and nutrition analysis with AI. For a healthier India with EatWise India.',
  applicationName: 'EatWise India',
  keywords: ['nutrition', 'health', 'AI', 'food label', 'recipes', 'India', 'healthy eating', 'diet', 'wellness', 'food scanner', 'calorie counter india'],
  authors: [{ name: 'EatWise India Team', url: BASE_URL }],
  creator: 'EatWise India Team',
  publisher: 'EatWise India',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    title: 'EatWise India - AI Nutrition Guide',
    description: 'Your AI-powered guide to healthier food choices in India. Analyze labels, get recipes, and check nutrition.',
    siteName: 'EatWise India',
    images: [
      {
        url: `${BASE_URL}/img/og-default-image.png`,
        width: 1200,
        height: 630,
        alt: 'EatWise India - AI Nutrition Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EatWise India - AI Nutrition Guide',
    description: 'AI-powered nutrition insights for India. Analyze food labels, get recipes, and make healthier choices.',
    images: [`${BASE_URL}/img/og-default-image.png`], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [ 
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' }, 
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png', 
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
       <head>
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
      </head>
      <body className={cn(
          "min-h-screen bg-background font-body antialiased flex flex-col overflow-x-hidden",
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
          <Header />
          <main className="flex-grow pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <Toaster />
          <BottomNavbar />
        </CustomThemeProvider>
        <Analytics/>
      </body>
    </html>
  );
}
