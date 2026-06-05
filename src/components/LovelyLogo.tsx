import React from 'react';

interface LovelyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
}

export default function LovelyLogo({ className = '', size = 'md', imageUrl }: LovelyLogoProps) {
  // Dimensions based on size preset
  const dimensionSizes = {
    sm: { circle: 'w-16 h-16', outerRing: 'w-20 h-20', glow: 'w-24 h-24 blur-xl' },
    md: { circle: 'w-32 h-32', outerRing: 'w-38 h-38', glow: 'w-44 h-44 blur-2xl' },
    lg: { circle: 'w-44 h-44', outerRing: 'w-52 h-52', glow: 'w-60 h-60 blur-3xl' },
  };

  const currentSize = dimensionSizes[size] || dimensionSizes.md;

  // Default high-quality romantic profile portrait if none provided
  const portraitUrl = imageUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop";

  return (
    <div id="lovely-brand-logo" className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* 1. Large, rich background breathing glow aura */}
      <div 
        className={`absolute rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 opacity-60 animate-pulse transition-all duration-700 pointer-events-none ${currentSize.glow}`}
        style={{ animationDuration: '4s' }}
      />

      {/* 2. Secondary secondary spinning halo ring */}
      <div 
        className={`absolute rounded-full border border-dashed border-pink-500/40 animate-spin-slow pointer-events-none transition-all duration-500 ${currentSize.outerRing}`}
        style={{ animationDuration: '24s' }}
      />

      {/* 3. Outer thin solid glowing neon ring */}
      <div 
        className={`absolute rounded-full border border-pink-400/20 shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-pulse pointer-events-none transition-all duration-500 ${
          size === 'sm' ? 'w-18 h-18' : size === 'md' ? 'w-34 h-34' : 'w-46 h-46'
        }`}
        style={{ animationDuration: '3s' }}
      />

      {/* 4. Tiny sparkling elements floating around */}
      <span className="absolute -top-3 -right-3 text-lg animate-bounce select-none pointer-events-none drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">✨</span>
      <span className="absolute -bottom-2 -left-3 text-lg animate-pulse select-none pointer-events-none drop-shadow-[0_0_8px_rgba(168,85,247,0.65)]" style={{ animationDelay: '1s' }}>🌸</span>

      {/* 5. Central circular coin */}
      <div 
        className={`relative rounded-full overflow-hidden bg-slate-950 border-[3px] border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.45)] hover:shadow-[0_0_35px_rgba(236,72,153,0.7)] hover:border-pink-300 transition-all duration-500 hover:scale-[1.06] group z-10 ${currentSize.circle}`}
      >
        {/* Subtle glow / light flare behind image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 via-pink-400/20 to-transparent mix-blend-screen z-10" />
        
        {/* Portrait image centered beautifully */}
        <img 
          src={portraitUrl} 
          alt="Lovely Portrait Logo" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[800ms] ease-out" 
        />

        {/* Outer overlay Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(9,9,11,0.85)_100%)] mix-blend-multiply z-20" />
      </div>
    </div>
  );
}
