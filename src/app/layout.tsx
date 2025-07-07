import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GlobalDataProvider } from '@/context/GlobalDataContext';
import { ThemeManager } from '@/components/theme-manager';

export const metadata: Metadata = {
  title: 'VisaFor CRM',
  description: 'Your AI-powered CRM for Immigration Professionals.',
  applicationName: 'VisaFor CRM',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VisaFor',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: '#374151',
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
      </head>
      <body className="font-body antialiased bg-background">
        <GlobalDataProvider>
          <ThemeManager />
          {children}
          <Toaster />
        </GlobalDataProvider>
      </body>
    </html>
  );
}
