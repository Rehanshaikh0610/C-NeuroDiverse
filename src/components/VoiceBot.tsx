'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VoiceBotProps {
  onSpeechResult: (text: string) => void;
  botResponse?: string;
}

const VoiceBot: React.FC<VoiceBotProps> = ({ onSpeechResult, botResponse }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Text-to-speech function
  const speak = React.useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser');
    }
  }, []);

  useEffect(() => {
    if (botResponse) {
      speak(botResponse);
    }
  }, [botResponse, speak]);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;

        setTranscript(transcriptText);

        if (result.isFinal) {
          onSpeechResult(transcriptText);
          setIsListening(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSpeechResult, speak]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
      setTranscript('');
    }
  };

  return (
    <div className="fixed bottom-24 right-24 flex flex-col items-center">
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isListening
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-500 hover:bg-blue-600'
          }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-white text-xl`}></i>
      </button>
      {isListening && (
        <div className="mt-2 bg-white p-2 rounded-lg shadow-md text-xs max-w-[150px] text-center">
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceBot;