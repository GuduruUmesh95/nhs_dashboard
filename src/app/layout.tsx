import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const font = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NHS HRA Operations Dashboard | The Visionarys',
  description: 'Health Research Authority operational analytics dashboard — tracking applications, analyst capacity, throughput, and approval turnaround times.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="layout-shell">
          <Sidebar />
          <div className="layout-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
