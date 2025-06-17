
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import type { WebSite, Organization } from 'schema-dts';

const BASE_URL = 'https://eatwise.evotyindia.me';

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

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      <body className="font-body antialiased min-h-screen bg-background text-foreground flex flex-col">
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
