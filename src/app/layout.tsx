
import type { Metadata } from 'next';
import './globals.css';
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Toaster } from "@/components/ui/toaster";
import { Poppins, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/components/common/AuthManager';
import { AppShell } from '@/components/layout/app-shell';
import Script from 'next/script';
import type { Organization, WebSite, WithContext, SearchAction } from 'schema-dts';
import { LeafCursor } from '@/components/ui/leaf-cursor';
import { InitialLoader } from '@/components/ui/initial-loader';

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: {
    default: "EatWise India: Your AI-Powered Nutrition Coach",
    template: "%s | EatWise India",
  },
  description: 'Instantly analyze Indian food labels, get AI health reports, and discover personalized recipes to make healthier food choices. Your smart guide to nutrition.',
  applicationName: 'EatWise India',
  authors: [{ name: 'EatWise India Team', url: BASE_URL }],
  keywords: ['Indian food', 'nutrition', 'AI health coach', 'food label scanner', 'healthy recipes', 'Swasth Bharat'],
  creator: 'EatWise India',
  publisher: 'EatWise India',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'EatWise India: Your AI-Powered Nutrition Coach',
    description: 'Instantly analyze Indian food labels, get AI health reports, and discover personalized recipes to make healthier food choices.',
    siteName: 'EatWise India',
    images: [{
      url: `${BASE_URL}/og-image.png`, // Recommended: create a 1200x630 image
      width: 1200,
      height: 630,
      alt: 'EatWise India AI Nutrition Coach',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EatWise India: Your AI-Powered Nutrition Coach',
    description: 'Instantly analyze Indian food labels, get AI health reports, and discover personalized recipes to make healthier food choices.',
    images: [`${BASE_URL}/og-image.png`], // Needs a specific Twitter card image
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Recommended: add an apple touch icon
  },
};

const organizationSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EatWise India",
  url: BASE_URL,
  logo: `${BASE_URL}/img/logo_200x60.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-123-456-7890",
    contactType: "Customer Support",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
  sameAs: [
    "https://facebook.com/eatwiseindia",
    "https://twitter.com/eatwiseindia",
    "https://instagram.com/eatwiseindia",
    "https://linkedin.com/company/eatwiseindia",
    "https://youtube.com/c/eatwiseindia",
  ],
};

const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EatWise India",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/saved?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  } as SearchAction & { "query-input": string },
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
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
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
          <InitialLoader />
          <LeafCursor />
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
