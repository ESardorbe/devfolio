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
  title: 'DevFolio — IT Mutaxassislari Uchun Portfolio',
  description: 'Dasturchilar va IT mutaxassislar uchun zamonaviy portfolio platforma',
  keywords: ['portfolio', 'developer', 'resume', 'CV', 'DevFolio'],
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