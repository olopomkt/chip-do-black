import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Glow */}
        <circle cx="60" cy="60" r="55" fill="url(#glow)" opacity="0.5"/>
        
        {/* Background Shield */}
        <path d="M60 5 L 115 25 L 100 100 L 60 118 L 20 100 L 5 25 Z" fill="#030712" stroke="#00F0FF" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M60 5 L 115 25 L 100 100 L 60 118 Z" fill="#0A0F1A"/>
        
        {/* Ninja Base */}
        <path d="M60 15 L 95 35 L 85 90 L 60 105 L 35 90 L 25 35 Z" fill="#000000"/>
        
        {/* Hood Shadows & Highlights */}
        <path d="M60 15 L 95 35 L 85 90 L 60 105 Z" fill="#111827"/>
        <path d="M60 15 L 75 30 L 60 45 L 45 30 Z" fill="#1F2937"/>
        <path d="M60 15 L 75 30 L 60 45 Z" fill="#374151"/>
        
        {/* Side Armor / Kunai shapes */}
        <path d="M25 60 L 35 65 L 30 85 L 20 70 Z" fill="#1E293B"/>
        <path d="M95 60 L 85 65 L 90 85 L 100 70 Z" fill="#1E293B"/>
        <path d="M25 60 L 30 62.5 L 30 85 L 20 70 Z" fill="#0F172A"/>
        <path d="M95 60 L 90 62.5 L 90 85 L 100 70 Z" fill="#374151"/>

        {/* Face Cutout */}
        <path d="M30 45 L 90 45 L 80 65 L 60 70 L 40 65 Z" fill="#000000"/>
        
        {/* Aggressive Eyes */}
        <path d="M32 48 L 55 56 L 45 58 L 30 52 Z" fill="#00F0FF" filter="drop-shadow(0 0 6px #00F0FF)"/>
        <path d="M88 48 L 65 56 L 75 58 L 90 52 Z" fill="#00F0FF" filter="drop-shadow(0 0 6px #00F0FF)"/>
        
        {/* Lower Mask (Armor) */}
        <path d="M38 65 L 60 70 L 82 65 L 75 95 L 60 108 L 45 95 Z" fill="#0B1120"/>
        <path d="M60 70 L 82 65 L 75 95 L 60 108 Z" fill="#1E293B"/>
        
        {/* Mask Center Plate */}
        <path d="M50 75 L 70 75 L 65 100 L 60 105 L 55 100 Z" fill="#000000"/>
        <path d="M60 75 L 70 75 L 65 100 L 60 105 Z" fill="#0F172A"/>
        
        {/* Neon Vents on Mask */}
        <path d="M53 82 L 67 82 L 65 85 L 55 85 Z" fill="#00F0FF" opacity="0.9" filter="drop-shadow(0 0 4px #00F0FF)"/>
        <path d="M55 88 L 65 88 L 63 91 L 57 91 Z" fill="#00F0FF" opacity="0.6" filter="drop-shadow(0 0 4px #00F0FF)"/>
        <path d="M57 94 L 63 94 L 61 96 L 59 96 Z" fill="#00F0FF" opacity="0.3"/>
        
        {/* Headband */}
        <path d="M35 40 L 85 40 L 80 45 L 40 45 Z" fill="#000000"/>
        <path d="M60 40 L 85 40 L 80 45 L 60 45 Z" fill="#0F172A"/>
        
        {/* Headband Emblem */}
        <polygon points="60,36 64,41 60,46 56,41" fill="#00F0FF" filter="drop-shadow(0 0 4px #00F0FF)"/>
        
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
      <div className="mt-4 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Impact, sans-serif', transform: 'skewX(-12deg)' }}>
          CHIP DO BLACK
        </h1>
        <div className="text-[11px] tracking-[0.5em] text-cyan-400 uppercase font-bold mt-1 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
          High Performance
        </div>
      </div>
    </div>
  );
}
