
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GlobalDataProvider } from '@/context/GlobalDataContext';
import { ThemeManager } from '@/components/theme-manager';

export const metadata: Metadata = {
  title: 'Heru | AI-Powered Immigration CRM',
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
