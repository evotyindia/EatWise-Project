import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

// IMPORTANT: Replace this with your actual website's base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL), // Essential for resolving relative image paths in openGraph, etc.
  title: {
    default: 'EatWise India - AI Nutrition Guide',
    template: '%s | EatWise India', // Used by child pages to append their title
  },
  description:
    'Understand food labels, get health ratings, recipe suggestions, and nutrition analysis with AI. For a healthier India with EatWise India.',
  applicationName: 'EatWise India',
  keywords: ['nutrition', 'health', 'AI', 'food label', 'recipes', 'India', 'healthy eating', 'diet', 'wellness'],
  authors: [{ name: 'EatWise India Team', url: BASE_URL }],
  creator: 'EatWise India Team',
  publisher: 'EatWise India',
  openGraph: {
    type: 'website',
    locale: 'en_IN', // Assuming primary locale
    url: BASE_URL,
    title: 'EatWise India - AI Nutrition Guide',
    description: 'Your AI-powered guide to healthier food choices in India. Analyze labels, get recipes, and check nutrition.',
    siteName: 'EatWise India',
    images: [ // Default OG image
      {
        url: `${BASE_URL}/img/og-default-image.png`, // IMPORTANT: Create this image (1200x630 recommended)
        width: 1200,
        height: 630,
        alt: 'EatWise India - AI Nutrition Guide',
      },
    ],
  },
  twitter: { // Basic Twitter card setup
    card: 'summary_large_image',
    title: 'EatWise India - AI Nutrition Guide',
    description: 'AI-powered nutrition insights for India. Analyze food labels, get recipes, and make healthier choices.',
    // images: [`${BASE_URL}/img/twitter-card-image.png`], // Optionally, a different image for Twitter (1200x675 or similar)
    // creator: '@YourTwitterHandle', // Add your Twitter handle if you have one
  },
  robots: { // Basic robots meta tag
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
  // Add verification codes if you have them
  // verification: {
  //   google: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE',
  //   // yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
  //   // other: {
  //   //   me: ['my-email@example.com', 'my-link-to-profile.com'],
  //   // },
  // },
  alternates: {
    canonical: BASE_URL,
    // If you had multiple languages:
    // languages: {
    //   'en-US': `${BASE_URL}/en-US`,
    //   'hi-IN': `${BASE_URL}/hi-IN`,
    // },
  },
  // For PWAs, you might add manifest link here
  // manifest: "/manifest.json",
  // icons: { // Favicon and app icons
  //   icon: "/favicon.ico",
  //   shortcut: "/shortcut-icon.png",
  //   apple: "/apple-touch-icon.png",
  //   // other: [
  //   //   { rel: 'apple-touch-icon-precomposed', url: '/apple-touch-icon-precomposed.png' },
  //   // ],
  // },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts are already preconnected in the original file, keeping them */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground flex flex-col">
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K396ETRNRR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K396ETRNRR');
          `}
        </Script>

        <CustomThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
