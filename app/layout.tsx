import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "NISHAD'S PORTFOLIO",
  description: 'Nishad’s aerospace and mechanical engineering portfolio.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
