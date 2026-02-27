import { useState, useEffect, useRef, useCallback } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

interface UseSpeechServicesProps {
  onSpeechInput?: (text: string) => void;
  onSpeechOutput?: (text: string) => void;
}

export const useSpeechServices = ({ onSpeechInput, onSpeechOutput }: UseSpeechServicesProps) => {
  const [isListening, setIsListening] = useState(false);
  const [speechConfig, setSpeechConfig] = useState<sdk.SpeechConfig | null>(null);
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const synthesizerRef = useRef<sdk.SpeechSynthesizer | null>(null);

  useEffect(() => {
    // Initialize speech services
    const initializeSpeechServices = async () => {
      try {
        const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY;
        const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION;

        if (!subscriptionKey || !region) {
          console.error('Azure Speech Service credentials not found');
          return;
        }

        const config = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
        config.speechRecognitionLanguage = 'en-US';
        config.speechSynthesisLanguage = 'en-US';
        config.speechSynthesisVoiceName = 'en-US-JennyNeural';

        setSpeechConfig(config);

        // Initialize speech recognizer
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new sdk.SpeechRecognizer(config, audioConfig);

        recognizer.recognized = (s, e) => {
          if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
            const text = e.result.text.trim();
            if (text && onSpeechInput) {
              onSpeechInput(text);
            }
          }
        };

        recognizerRef.current = recognizer;

        // Initialize speech synthesizer
        const synthesizer = new sdk.SpeechSynthesizer(config);
        synthesizerRef.current = synthesizer;

      } catch (error) {
        console.error('Error initializing speech services:', error);
      }
    };

    initializeSpeechServices();

    return () => {
      // Cleanup
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
      if (synthesizerRef.current) {
        synthesizerRef.current.close();
      }
    };
  }, [onSpeechInput]);

  useEffect(() => {
    if (isListening && recognizerRef.current) {
      recognizerRef.current.startContinuousRecognitionAsync(
        () => console.log('Speech recognition started'),
        (error) => console.error('Error starting speech recognition:', error)
      );
    } else if (!isListening && recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => console.log('Speech recognition stopped'),
        (error) => console.error('Error stopping speech recognition:', error)
      );
    }
  }, [isListening]);

  const speakText = useCallback(async (text: string) => {
    if (!synthesizerRef.current) return;

    try {
      const result = await synthesizerRef.current.speakTextAsync(text);
      if (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log('Speech synthesis completed');
        } else {
          console.error('Speech synthesis canceled or failed');
        }
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    }
  }, []);

  useEffect(() => {
    if (onSpeechOutput) {
      onSpeechOutput(speakText);
    }
  }, [onSpeechOutput, speakText]);

  return {
    isListening,
    setIsListening,
    speakText,
  };
};

export default useSpeechServices; 