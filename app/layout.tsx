import React from 'react';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

// Configure Cormorant Garamond (Serif font for branding and headers)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

// Configure Manrope (Sans font for UI and body text)
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'ROOH — Personal Sanctuary & Medical Study Companion',
  description: 'Designed specifically for Ruhi. A high-efficiency medical study workspace blended with a soft emotional comfort ecosystem.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="font-sans bg-[#FFFDF7] text-[#0D3B66] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
