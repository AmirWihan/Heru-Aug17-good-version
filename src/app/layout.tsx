
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GlobalDataProvider } from '@/context/GlobalDataContext';
import { ThemeManager } from '@/components/theme-manager';

export const metadata: Metadata = {
  title: 'VisaFor | AI-Powered Immigration CRM',
  description: 'Your AI-powered CRM for Immigration Professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* PWA manifest and meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#374151" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VisaFor" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" sizes="512x512" href="/icons/icon-512x512.png" />
      </head>
      <body className="font-body antialiased bg-background">
        <GlobalDataProvider>
          <ThemeManager />
          {children}
          <Toaster />
          {/* Register Service Worker for PWA */}
          {typeof window !== 'undefined' && process.env.NODE_ENV === 'production' ? (
            <>{require('@/components/ServiceWorkerRegister').default()}</>
          ) : null}
        </GlobalDataProvider>
      </body>
    </html>
  );
}
