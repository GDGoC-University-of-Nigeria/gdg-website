import { type Metadata } from 'next';

import localFont from 'next/font/local';

import { Providers } from '@/components/providers/Providers';

import './globals.css';

type LayoutProps = React.HTMLAttributes<HTMLElement>;

const productSans = localFont({
  variable: '--product-sans-font',
  src: [
    {
      path: '../assets/fonts/ProductSans-BoldItalic.ttf',
      style: 'italic',
      weight: '700',
    },
    {
      path: '../assets/fonts/ProductSans-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../assets/fonts/ProductSans-Italic.ttf',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../assets/fonts/ProductSans-Bold.ttf',
      style: 'normal',
      weight: '700',
    }
  ]
});

export const metadata: Metadata = {
  title: 'GDG UNN – Empowering Developers & Innovators at UNN Campus',
  description: `Building a vibrant community of developers, designers, \
    and tech enthusiasts at the University of Nigeria, Nsukka.`,
  openGraph: {
    title: 'GDG UNN',
    description:
      'Join GDG UNN to learn in public, build projects, and grow with fellow developers.',
    type: 'website',
    images: ['/images/logo-banner.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDG UNN',
    description:
      'Join GDG UNN to learn in public, build projects, and grow with fellow developers.',
    images: ['/images/logo-banner.png']
  }
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={productSans.variable} suppressHydrationWarning>
      <body className="font-product-sans bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
