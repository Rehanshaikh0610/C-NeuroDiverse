'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import * as faceapi from '@vladmandic/face-api';

export default function FaceDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedEmotions, setDetectedEmotions] = useState<Array<{ emotion: string; probability: number }>>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        // Models are now in the public/models directory
        const MODEL_URL = '/models';

        console.log('Starting to load models from:', MODEL_URL);

        // Load models one by one with proper error handling
        try {
          console.log('Loading tiny face detector model...');
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          console.log('Tiny face detector model loaded successfully');
        } catch (err) {
          console.error('Error loading tiny face detector:', err);
          throw err;
        }

        try {
          console.log('Loading face landmark model...');
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          console.log('Face landmark model loaded successfully');
        } catch (err) {
          console.error('Error loading face landmark model:', err);
          throw err;
        }

        try {
          console.log('Loading face recognition model...');
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          console.log('Face recognition model loaded successfully');
        } catch (err) {
          console.error('Error loading face recognition model:', err);
          throw err;
        }

        try {
          console.log('Loading face expression model...');
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
          console.log('Face expression model loaded successfully');
        } catch (err) {
          console.error('Error loading face expression model:', err);
          throw err;
        }

        console.log('All face detection models loaded successfully');
        setIsModelLoaded(true);
        setIsLoading(false);
      } catch (modelError) {
        console.error('Error loading models:', modelError);
        setError('Failed to load face detection models. Please check the console for details and refresh the page.');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const startVideo = async () => {
    if (!videoRef.current) return;

    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      videoRef.current.srcObject = stream;

      // Wait for video to be ready before starting detection
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      setIsDetecting(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access webcam. Please make sure you have granted camera permissions and your camera is connected.');
      setIsDetecting(false);
    }
  };

  const stopVideo = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsDetecting(false);
    setDetectedEmotions([]);
  };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !isDetecting) return;

    // Only proceed if video is loaded
    if (videoRef.current.readyState !== 4) {
      requestAnimationFrame(detectFaces);
      return;
    }

    // Get the dimensions of the video
    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight
    };

    // Match canvas size to video
    canvasRef.current.width = displaySize.width;
    canvasRef.current.height = displaySize.height;
    faceapi.matchDimensions(canvasRef.current, displaySize);

    try {
      // Detect faces with optimized parameters
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          scoreThreshold: 0.3,
          inputSize: 416,
        })
      )
        .withFaceLandmarks()
        .withFaceExpressions();

      // Resize detections to match display size
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // Clear canvas
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      // Draw detections
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

      // Extract emotions
      if (detections.length > 0) {
        const emotions = detections.map((detection) => {
          const expressions = detection.expressions;

          // Find the expression with the highest probability
          let maxExpression = 'neutral';
          let maxProbability = 0;

          Object.entries(expressions).forEach(([expression, probability]) => {
            if (probability > maxProbability) {
              maxExpression = expression;
              maxProbability = probability;
            }
          });

          // Only consider emotions with significant probability
          if (maxProbability < 0.25) {
            maxExpression = 'neutral';
            maxProbability = 1.0;
          }

          return {
            emotion: maxExpression,
            probability: maxProbability
          };
        });

        setDetectedEmotions(emotions);
      } else {
        setDetectedEmotions([]);
      }
    } catch (err) {
      console.error('Error during face detection:', err);
    }

    // Continue detection if still detecting
    if (isDetecting) {
      requestAnimationFrame(detectFaces);
    }
  };

  useEffect(() => {
    if (isDetecting && isModelLoaded) {
      detectFaces();
    }

    return () => {
      // Cleanup
    };
  }, [isDetecting, isModelLoaded]);

  // Add event listener for when video is ready
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleVideoPlay = () => {
        if (isModelLoaded && isDetecting) {
          detectFaces();
        }
      };

      videoElement.addEventListener('play', handleVideoPlay);

      return () => {
        videoElement.removeEventListener('play', handleVideoPlay);
      };
    }
  }, [isModelLoaded, isDetecting]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'relative', height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Facial Expression Recognition
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!isModelLoaded ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading face detection models...</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ position: 'relative', width: '100%', height: 'auto', mb: 2, bgcolor: '#000' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                display: isDetecting ? 'block' : 'none',
                backgroundColor: '#000'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: '8px',
                display: isDetecting ? 'block' : 'none'
              }}
            />
            {!isDetecting && (
              <Box
                sx={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #ccc',
                  borderRadius: '8px',
                  bgcolor: '#f5f5f5'
                }}
              >
                <Typography color="text.secondary">
                  Click "Start Camera" to begin facial expression detection
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={startVideo}
              disabled={isDetecting}
            >
              Start Camera
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={stopVideo}
              disabled={!isDetecting}
            >
              Stop Camera
            </Button>
          </Box>

          {detectedEmotions.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom>
                🎭 Detected Emotions:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                {detectedEmotions.map((emotion, index) => {
                  const emotionEmoji: { [key: string]: string } = {
                    neutral: '😐',
                    happy: '😊',
                    sad: '😢',
                    angry: '😠',
                    fearful: '😨',
                    disgusted: '🤢',
                    surprised: '😲'
                  };

                  const emotionColor: { [key: string]: string } = {
                    neutral: '#9C27B0',
                    happy: '#4CAF50',
                    sad: '#2196F3',
                    angry: '#F44336',
                    fearful: '#FF9800',
                    disgusted: '#8BC34A',
                    surprised: '#FFC107'
                  };

                  const emoji = emotionEmoji[emotion.emotion] || '🤔';
                  const color = emotionColor[emotion.emotion] || '#757575';
                  const confidencePercent = (emotion.probability * 100).toFixed(1);

                  return (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: `${color}15`,
                        border: `2px solid ${color}`,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {emoji}
                      </Typography>
                      <Typography variant="h6" sx={{ color, fontWeight: 'bold', mb: 0.5 }}>
                        {emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Confidence: {confidencePercent}%
                      </Typography>
                      <Box sx={{ width: '100%', height: '6px', bgcolor: '#e0e0e0', borderRadius: 1, mt: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${confidencePercent}%`,
                            bgcolor: color,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            This feature uses your camera to detect facial expressions in real-time.
            No images are stored or sent to any server.
          </Typography>
        </>
      )}
    </Paper>
  );
}