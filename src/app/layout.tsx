import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MusicProvider } from '@/components/music/MusicContext';
import ChatBot from '@/components/ChatBot';
import AIAssistant from '@/components/AIAssistant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeuroDiverse',
  description: 'A supportive platform for neurodivergent individuals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <MusicProvider>
            {children}
            <ChatBot />
            <AIAssistant />
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 