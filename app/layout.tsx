import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HomeworkAI',
  description: 'AI-powered homework solver for students'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
