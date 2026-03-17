import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center pt-4 ${className}`}>
      {/* Ambient LED Glow Behind */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 blur-[50px] rounded-full transition-colors duration-1000 opacity-50 pointer-events-none"
        style={{ backgroundColor: 'var(--theme-color)' }}
      ></div>
      
      {/* Logo Image with LED Drop Shadow */}
      <img 
        src="https://ondfvbieanzfrmdyqnkl.supabase.co/storage/v1/object/public/OUTROS/CdB%20-%20Logo.png" 
        alt="Chip do Black" 
        className="relative z-10 w-80 md:w-[400px] object-contain transition-all duration-1000"
        style={{ 
          filter: 'drop-shadow(0 0 15px var(--theme-glow-strong)) drop-shadow(0 0 30px var(--theme-color))' 
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
