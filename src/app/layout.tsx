import { type Metadata } from 'next';

import localFont from 'next/font/local';

import './globals.css';

type LayoutProps = React.HTMLAttributes<HTMLElement>;

const productSans = localFont({
  variable: '--font-product-sans-variable',
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
    and tech enthusiasts at the University of Nigeria, Nsukka.`
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={productSans.variable} suppressHydrationWarning>
      <body className="font-product-sans bg-white">{children}</body>
    </html>
  );
}
