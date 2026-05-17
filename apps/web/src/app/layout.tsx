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
  verification: {
    google: 'r4JGWLW1-ML4BSrPxUr22BvXBGElV5YWiuSzZ_pvIqc',
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://devfolio.uz',
    siteName: 'DevFolio',
    title: "DevFolio — IT Mutaxassislari Uchun Portfolio",
    description: "O'zbekistonlik dasturchilar uchun zamonaviy portfolio platforma",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFolio',
    description: "IT mutaxassislari uchun portfolio platforma",
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/icon', sizes: '512x512', type: 'image/png' }],
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DevFolio',
              url: 'https://devfolio.uz',
              logo: 'https://devfolio.uz/icon',
              description:
                "O'zbekistonlik dasturchilar va IT mutaxassislar uchun zamonaviy portfolio platforma.",
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}