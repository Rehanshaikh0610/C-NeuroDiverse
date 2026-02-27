'use client';

import React from 'react';
import styles from './NeonFrame.module.css';

interface NeonFrameProps {
  children: React.ReactNode;
  className?: string;
}

const NeonFrame: React.FC<NeonFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className={styles.neonFrame}></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default NeonFrame; 