import type { Metadata } from 'next';
import { Space_Mono, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: "DevFolio — IT Mutaxassislari Uchun Portfolio",
    template: "%s | DevFolio",
  },
  description: "O'zbekistonlik dasturchilar va IT mutaxassislar uchun zamonaviy portfolio platforma. Ko'nikmalar, loyihalar va tajribangizni professional CV sifatida ulashing.",
  keywords: ['portfolio', 'developer', 'dasturchi', 'resume', 'CV', 'DevFolio', 'IT mutaxassis'],
  authors: [{ name: 'DevFolio' }],
  metadataBase: new URL('https://devfolio.uz'),
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://devfolio.uz',
    siteName: 'DevFolio',
    title: "DevFolio — IT Mutaxassislari Uchun Portfolio",
    description: "O'zbekistonlik dasturchilar uchun zamonaviy portfolio platforma",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DevFolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFolio',
    description: "IT mutaxassislari uchun portfolio platforma",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://devfolio.uz',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${sora.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}