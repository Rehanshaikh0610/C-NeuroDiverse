'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMusic } from '@/components/music/MusicContext';
import MiniPlayer from '@/components/music/MiniPlayer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTrack, isPlaying, togglePlay } = useMusic();
  const pathname = usePathname();

  return (
    <div>
      {children}
      {/* Show MiniPlayer only when not on the music page */}
      {currentTrack && (!pathname || !pathname.includes('/dashboard/music')) && (
        <MiniPlayer />
      )}
    </div>
  );
} 
