import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HookGrade Studio | LinkedIn Hook Grader',
  description: 'Score and improve a LinkedIn opening hook using transparent rules and structured AI rewrites.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
