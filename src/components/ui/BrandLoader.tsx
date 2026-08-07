import React from 'react';
import { Logo } from './Logo';

interface BrandLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({ 
  fullScreen = true, 
  message = "Loading..." 
}) => {
  // Determine if it should lock the whole screen or just the parent div
  const wrapperClasses = fullScreen
    ? "fixed inset-0 z-[100] w-screen h-screen"
    : "absolute inset-0 z-50 w-full h-full rounded-inherit";

  return (
    <div 
      className={`
        ${wrapperClasses} 
        flex flex-col items-center justify-center 
        bg-white/60 dark:bg-[#090d16]/70 
        backdrop-blur-md 
        transition-all duration-300
      `}
    >
      <div className="flex flex-col items-center animate-pulse">
        {/* We use our Logo component here! */}
        <Logo className="h-12 w-auto text-brand-600 dark:text-brand-100" />
        
        {/* Optional small loading text */}
        {message && (
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};