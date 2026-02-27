'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'rainbow';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  pulseSpeed?: 'slow' | 'medium' | 'fast';
}

const MainNeonBorder: React.FC<NeonBorderProps> = ({
  children,
  className = '',
  color = 'blue',
  intensity = 'medium',
  animated = true,
  pulseSpeed = 'medium',
}) => {
  const [isRainbowActive, setIsRainbowActive] = useState(color === 'rainbow');
  const [currentColor, setCurrentColor] = useState(0);
  const rainbowColors = ['blue', 'purple', 'green', 'pink'];
  
  // Intensity mapping
  const intensityMap = {
    low: {
      glow: 'blur-[2px]',
      opacity: 'opacity-40',
    },
    medium: {
      glow: 'blur-[4px]',
      opacity: 'opacity-60',
    },
    high: {
      glow: 'blur-[6px]',
      opacity: 'opacity-80',
    },
  };
  
  // Pulse speed mapping
  const pulseSpeedMap = {
    slow: 3,
    medium: 2,
    fast: 1,
  };
  
  // Color mapping
  const colorMap: Record<string, string> = {
    blue: 'from-blue-400 to-cyan-400',
    purple: 'from-purple-400 to-indigo-400',
    green: 'from-green-400 to-emerald-400',
    pink: 'from-pink-400 to-rose-400',
  };
  
  // Rainbow effect
  useEffect(() => {
    if (!isRainbowActive) return;
    
    const interval = setInterval(() => {
      setCurrentColor((prev) => (prev + 1) % rainbowColors.length);
    }, pulseSpeedMap[pulseSpeed] * 1000);
    
    return () => clearInterval(interval);
  }, [isRainbowActive, pulseSpeed]);
  
  const activeColor = isRainbowActive ? rainbowColors[currentColor] : color;
  
  return (
    <div className={`relative rounded-xl ${className}`}>
      {/* Neon border effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-[-2px] rounded-xl">
          {animated ? (
            <motion.div
              className={`w-full h-full bg-gradient-to-r ${colorMap[activeColor]} ${intensityMap[intensity].opacity}`}
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: pulseSpeedMap[pulseSpeed],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${colorMap[activeColor]} ${intensityMap[intensity].opacity}`} />
          )}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-[-2px] rounded-xl">
          {animated ? (
            <motion.div
              className={`w-full h-full bg-gradient-to-r ${colorMap[activeColor]} ${intensityMap[intensity].glow}`}
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: pulseSpeedMap[pulseSpeed],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${colorMap[activeColor]} ${intensityMap[intensity].glow}`} />
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default MainNeonBorder; 