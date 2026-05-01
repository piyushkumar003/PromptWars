"use client";

import React from 'react';

interface AshokaChakraProps {
  className?: string;
  animate?: boolean;
}

export const AshokaChakra: React.FC<AshokaChakraProps> = ({ className, animate = true }) => {
  return (
    <div className={`pointer-events-none flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className={`w-full h-full text-accent ${animate ? 'animate-[spin_120s_linear_infinite]' : ''}`}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        {Array.from({ length: 24 }).map((_, i) => (
          <path 
            key={i} 
            d="M50 50 L50 5" 
            stroke="currentColor" 
            strokeWidth="1" 
            transform={`rotate(${i * 15} 50 50)`} 
          />
        ))}
      </svg>
    </div>
  );
};
