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

const NeonBorder: React.FC<NeonBorderProps> = ({
  children,
  className = '',
  color = 'blue',
  intensity = 'medium',
  animated = true,
  pulseSpeed = 'medium',
}) => {
  const [isRainbowActive, setIsRainbowActive] = useState(color === 'rainbow');
  const [currentColor, setCurrentColor] = useState(0);
  const rainbowColors = ['blue', 'purple', 'green', 'pink', 'red', 'orange'];
  
  // Intensity mapping with enhanced values
  const intensityMap = {
    low: {
      glow: 'blur-[3px]',
      opacity: 'opacity-60',
      borderWidth: '2px',
    },
    medium: {
      glow: 'blur-[5px]',
      opacity: 'opacity-80',
      borderWidth: '3px',
    },
    high: {
      glow: 'blur-[8px]',
      opacity: 'opacity-100',
      borderWidth: '4px',
    },
  };
  
  // Pulse speed mapping
  const pulseSpeedMap = {
    slow: 3,
    medium: 1.5,
    fast: 0.8,
  };
  
  // Enhanced color mapping with more vibrant gradients
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 via-blue-600 to-cyan-500',
    purple: 'from-purple-500 via-purple-600 to-indigo-500',
    green: 'from-green-500 via-green-600 to-emerald-500',
    pink: 'from-pink-500 via-pink-600 to-rose-500',
    red: 'from-red-500 via-red-600 to-orange-500',
    orange: 'from-orange-500 via-orange-600 to-yellow-500',
  };
  
  // Rainbow effect with faster transitions
  useEffect(() => {
    if (!isRainbowActive) return;
    
    const interval = setInterval(() => {
      setCurrentColor((prev) => (prev + 1) % rainbowColors.length);
    }, pulseSpeedMap[pulseSpeed] * 800); // Faster color transitions
    
    return () => clearInterval(interval);
  }, [isRainbowActive, pulseSpeed, rainbowColors.length]);
  
  const activeColor = isRainbowActive ? rainbowColors[currentColor] : color;
  
  return (
    <div className={`relative rounded-xl ${className}`}>
      {/* Neon border effect with increased size */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className={`absolute inset-[-${intensityMap[intensity].borderWidth}] rounded-xl`}>
          {animated ? (
            <motion.div
              className={`w-full h-full bg-gradient-to-r ${colorMap[activeColor]} ${intensityMap[intensity].opacity}`}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.03, 1],
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
        
        {/* Enhanced glow effect */}
        <div className={`absolute inset-[-${intensityMap[intensity].borderWidth}] rounded-xl`}>
          {animated ? (
            <motion.div
              className={`w-full h-full bg-gradient-to-r ${colorMap[activeColor]} ${intensityMap[intensity].glow}`}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.03, 1],
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
      
      {/* Content with a slight padding to make the border more visible */}
      <div className="relative z-10 rounded-xl overflow-hidden p-[1px]">
        {children}
      </div>
    </div>
  );
};

export default NeonBorder; 