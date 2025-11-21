import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import Providers from '@/components/provider';
import type { Metadata } from 'next';
import { Inter, Roboto, Urbanist } from 'next/font/google';
import './globals.css';

// Import fonts from google
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' });
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
});

//  Metadata
export const metadata: Metadata = {
  title: 'Scarbio | Powerful SEO Platform',
  description:
    'Scarbio is a powerful SEO platform built to help businesses of all sizes understand, optimize, and grow their online presence. With advanced analytics, keyword tracking, and competitor insights, Scarbio gives you everything you need to make data-driven decisions and achieve higher rankings effortlessly.',
  keywords: [
    'SEO platform',
    'keyword tracking',
    'competitor analysis',
    'SEO analytics',
    'website optimization',
    'digital marketing',
    'search engine ranking',
  ],
  authors: [{ name: 'Mohamed Wahba' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} ${urbanist.variable} ${roboto.variable} font-urbanist antialiased`}
      >
        <main className='flex min-h-screen flex-col justify-between'>
          {/* Navigation bar */}
          <Navbar />

          {/* Render pages */}
          <Providers>{children}</Providers>

          {/* Footer */}
          <Footer />
        </main>
      </body>
    </html>
  );
}
