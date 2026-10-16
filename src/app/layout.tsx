import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { Providers } from '@/app/providers';
import { Navbar } from '@/frontend/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Health Ministry | Headache & Migraine Analytics',
  description:
    'Mobile-first headache and migraine symptom tracking, duration analytics, and 3-month frequency insights.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Health Ministry',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
