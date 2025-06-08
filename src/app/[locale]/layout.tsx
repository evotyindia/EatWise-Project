import type { Metadata } from 'next';
import '../globals.css'; // Adjust path if globals.css is not in src/app
import { CustomThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import {NextIntlClientProvider, useMessages} from 'next-intl';

// Metadata for [locale] layout can refine or override root metadata if needed
// For now, it uses the root metadata by default.
// export const metadata: Metadata = { ... };

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ // Renamed from RootLayout to avoid confusion
  children,
  params: { locale },
}: Readonly<LocaleLayoutProps>) {
  const messages = useMessages();

  // This layout does NOT render <html>, <head>, or <body> tags.
  // It provides the content that goes INSIDE the root app/layout.tsx's <body>.
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CustomThemeProvider>
        {/* This div can act as the logical "body" for styling if needed */}
        <div className="font-body antialiased min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </div>
      </CustomThemeProvider>
    </NextIntlClientProvider>
  );
}
