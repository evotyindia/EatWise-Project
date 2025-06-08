import type { Metadata } from 'next';
import './globals.css'; // Keep global styles

// Metadata can be defined here for aspects that are truly global
export const metadata: Metadata = {
  title: 'Swasth Bharat Advisor - AI Nutrition Guide for India',
  description: 'Understand food labels, get health ratings, recipe suggestions, and nutrition analysis with AI. For a healthier India.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<RootLayoutProps>) {
  // This RootLayout is for the absolute root of the app.
  // It provides the main HTML document structure.
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Global font links can remain here as they are not locale-dependent */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Children will typically be the content from src/app/[locale]/layout.tsx for localized routes */}
        {children}
      </body>
    </html>
  );
}
