import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/Navbar';
import { Providers } from './Providers';

export const metadata: Metadata = {
  title: 'DoubtHub - Collaborative Learning Platform',
  description: 'Ask academic questions and interact with students to solve doubts collaboratively.',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>

        <Providers>
          <Navbar />
          <main style={{ paddingTop: '32px' }}>
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}
