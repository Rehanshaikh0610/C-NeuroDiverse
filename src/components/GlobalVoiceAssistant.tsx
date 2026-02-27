'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSpeechServices from '@/hooks/useSpeechServices';

const GlobalVoiceAssistant: React.FC = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  const handleSpeechInput = (text: string) => {
    setLastCommand(text);
    processCommand(text.toLowerCase());
  };

  const handleSpeechOutput = async (text: string | ((text: string) => Promise<void>)) => {
    if (typeof text === 'function') {
      // Initialize speech function
      text('');
    } else {
      // Speak the response
      if (speakText) {
        await speakText(text);
      }
    }
  };

  const { speakText } = useSpeechServices({
    onSpeechInput: handleSpeechInput,
    onSpeechOutput: handleSpeechOutput,
  });

  const processCommand = async (command: string) => {
    // Navigation commands
    if (command.includes('open diary') || command.includes('go to diary')) {
      await speakText('Opening personal diary');
      router.push('/dashboard/diary');
    } else if (command.includes('open meditate') || command.includes('go to meditation')) {
      await speakText('Opening meditation page');
      router.push('/dashboard/meditate');
    } else if (command.includes('open music') || command.includes('go to music')) {
      await speakText('Opening music player');
      router.push('/dashboard/music');
    } else if (command.includes('open dashboard') || command.includes('go to dashboard')) {
      await speakText('Opening dashboard');
      router.push('/dashboard');
    } else if (command.includes('open autism') || command.includes('go to autism')) {
      await speakText('Opening autism resources');
      router.push('/dashboard/autism');
    } else if (command.includes('open adhd') || command.includes('go to adhd')) {
      await speakText('Opening ADHD resources');
      router.push('/dashboard/adhd');
    } else if (command.includes('open dyslexia') || command.includes('go to dyslexia')) {
      await speakText('Opening dyslexia resources');
      router.push('/dashboard/dyslexia');
    } else if (command.includes('open chat') || command.includes('go to chat')) {
      await speakText('Opening chatbot');
      router.push('/dashboard/chatbot');
    }
    // Music controls
    else if (command.includes('play music') || command.includes('start music')) {
      window.dispatchEvent(new CustomEvent('music-control', { detail: { action: 'play' } }));
      await speakText('Playing music');
    } else if (command.includes('pause music') || command.includes('stop music')) {
      window.dispatchEvent(new CustomEvent('music-control', { detail: { action: 'pause' } }));
      await speakText('Pausing music');
    } else if (command.includes('next song') || command.includes('skip song')) {
      window.dispatchEvent(new CustomEvent('music-control', { detail: { action: 'next' } }));
      await speakText('Playing next song');
    } else if (command.includes('previous song')) {
      window.dispatchEvent(new CustomEvent('music-control', { detail: { action: 'previous' } }));
      await speakText('Playing previous song');
    }
    // Help command
    else if (command.includes('help') || command.includes('what can you do')) {
      const helpText = `
        I can help you navigate the app and control music playback.
        Try saying:
        - Open diary, meditate, music, or dashboard
        - Play or pause music
        - Next or previous song
        - Open autism, ADHD, or dyslexia resources
        - Open chat
      `;
      await speakText(helpText);
    } else {
      await speakText("I'm sorry, I didn't understand that command. Say 'help' to learn what I can do.");
    }
  };

  return (
    <button
      onClick={() => setIsListening(!isListening)}
      className={`fixed bottom-24 right-24 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50 ${
        isListening
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-white text-xl`}></i>
      {lastCommand && (
        <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          {lastCommand}
        </div>
      )}
    </button>
  );
};

export default GlobalVoiceAssistant; 