import React from 'react';
import { triggerHaptic } from '../services/hapticService';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  hoverEffect?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = false
}) => {
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      triggerHaptic('light');
      onClick(e);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/60 dark:bg-white/5
        backdrop-blur-xl saturate-150
        border border-white/40 dark:border-white/10
        shadow-xl shadow-black/5 dark:shadow-black/20
        transition-all duration-300
        ${(onClick || hoverEffect) ? 'cursor-pointer hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {/* Reflective Sheen Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 dark:to-transparent pointer-events-none opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};