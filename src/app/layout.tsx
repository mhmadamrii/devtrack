import '~/styles/globals.css';

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'sonner';
import { TRPCReactProvider } from '~/trpc/react';
import { ThemeProvider } from '~/components/providers/theme-provider';

export const metadata: Metadata = {
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'DevTrack | Project Management System',
    template: '%s | DevTrack.io',
  },
  description: 'Project Management System | Easy to use',
  openGraph: {
    title: 'DevTrack',
    description: 'Project Management System | Easy to use',
    url: '',
    siteName: '',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '',
      },
    ],
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
  twitter: {
    card: 'summary_large_image',
    title: '',
    description: '',
    siteId: '',
    creator: '',
    creatorId: '',
    images: [''],
  },
  verification: {
    google: '',
    yandex: '',
  },
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position='top-center' richColors />
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
