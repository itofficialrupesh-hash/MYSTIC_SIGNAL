import React from 'react';

interface LovelyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
}

export default function LovelyLogo({ className = '', size = 'md', imageUrl }: LovelyLogoProps) {
  // Dimensions based on size preset
  const sizeClasses = {
    sm: 'w-16 h-16 text-[11px]',
    md: 'w-24 h-24 text-[16px]',
    lg: 'w-36 h-36 text-[22px]',
  };

  // Default high-quality romantic profile portrait if none provided
  const portraitUrl = imageUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop";

  return (
    <div id="lovely-brand-logo" className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Central circular coin */}
      <div 
        className={`relative rounded-full overflow-hidden bg-slate-950 border-[3px] border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.55)] transition-all duration-300 hover:scale-105 group ${
          size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-32 h-32' : 'w-48 h-48'
        }`}
      >
        {/* Subtle glow / light flare behind image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-pink-400/10 to-transparent mix-blend-screen z-10" />
        
        {/* Portrait image centered beautifully */}
        <img 
          src={portraitUrl} 
          alt="Lovely Portrait Logo" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" 
        />

        {/* Outer overlay Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(9,9,11,0.8)_100%)] mix-blend-multiply z-20" />
      </div>
    </div>
  );
}
