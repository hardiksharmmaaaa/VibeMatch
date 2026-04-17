import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DuoSpace',
  description: 'Your private world with one person',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
