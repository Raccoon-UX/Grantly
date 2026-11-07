import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GrantlyProvider } from '@/context/GrantlyContext';

export const metadata: Metadata = {
  title: 'GRANTLY — Production Scholarship Discovery & Management Platform',
  description:
    'Every Opportunity Within Reach. Smart matching, real-time application tracking, and verified scholarship discovery for ambitious students.',
  keywords: [
    'scholarships',
    'grant discovery',
    'student financial aid',
    'smart match',
    'higher education funding',
    'engineering fellowship',
    'merit scholarship',
  ],
  authors: [{ name: 'GRANTLY Platform Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#F7F8FC] text-[#17213A] antialiased">
        <GrantlyProvider>{children}</GrantlyProvider>
      </body>
    </html>
  );
}
