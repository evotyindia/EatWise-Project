import type { Metadata } from 'next';
import './globals.css'; // Keep global styles

// Metadata can be defined here for aspects that are truly global
// or also refined/overridden in src/app/[locale]/layout.tsx
export const metadata: Metadata = {
  title: 'Swasth Bharat Advisor - AI Nutrition Guide for India',
  description: 'Understand food labels, get health ratings, recipe suggestions, and nutrition analysis with AI. For a healthier India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This RootLayout is for the absolute root of the app.
  // It should not include UI components like Header/Footer or context providers
  // that depend on locale. Those are handled by src/app/[locale]/layout.tsx.
  // It primarily sets up the main HTML document structure if needed.
  return (
    <html lang="en" suppressHydrationWarning> {/* Default lang, [locale]/layout.tsx will set specific lang for its content */}
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
