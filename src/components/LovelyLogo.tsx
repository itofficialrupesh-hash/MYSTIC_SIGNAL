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
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-amber-500/10 to-transparent mix-blend-screen z-10" />
        
        {/* Portrait image centered beautifully */}
        <img 
          src={portraitUrl} 
          alt="Lovely Portrait Logo" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-700" 
        />

        {/* Outer overlay Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(9,9,11,0.95)_100%)] mix-blend-multiply z-20" />

        {/* Elegant Gold Botanical Twigs / Leaves Frame Overlay inside the circle */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-30 select-none opacity-90" 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Left Botanical Branch */}
          <path 
            d="M 28 35 C 22 25, 40 18, 55 22 C 45 23, 33 26, 28 35 
               M 24 26 C 21 21, 29 20, 31 23
               M 33 20 C 31 15, 39 16, 39 19
               M 44 18 C 42 12, 51 14, 50 17
               M 55 19 C 53 14, 61 16, 59 19" 
            stroke="#e5c158" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Delicate leaf shapes along branch */}
          <path d="M26 29 C24 28, 27 25, 29 27 Z" fill="#e5c158" />
          <path d="M36 21 C34 20, 37 17, 39 19 Z" fill="#e5c158" />
          <path d="M47 17 C45 16, 48 13, 50 15 Z" fill="#e5c158" />
          <path d="M57 19 C55 18, 58 15, 60 17 Z" fill="#e5c158" />

          {/* Bottom-Right Botanical Branch */}
          <path 
            d="M 92 85 C 98 95, 80 102, 65 98 C 75 97, 87 94, 92 85 
               M 96 94 C 99 99, 91 100, 89 97
               M 87 100 C 89 105, 81 104, 81 101
               M 76 102 C 78 108, 69 106, 70 103
               M 65 101 C 67 106, 59 104, 61 101" 
            stroke="#e5c158" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Delicate leaf shapes along bottom branch */}
          <path d="M94 91 C96 92, 93 95, 91 93 Z" fill="#e5c158" />
          <path d="M84 99 C86 100, 83 103, 81 101 Z" fill="#e5c158" />
          <path d="M73 103 C75 104, 72 107, 70 105 Z" fill="#e5c158" />
          <path d="M63 101 C65 102, 62 105, 60 103 Z" fill="#e5c158" />

          {/* Faint elegant stars / sparkles inside coordinates */}
          <g fill="#ffffff" opacity="0.8" className="animate-pulse">
            {/* Top-Right and Middle-Right stars */}
            <path d="M85 35 L86 38 L89 39 L86 40 L85 43 L84 40 L81 39 L84 38 Z" fill="#fef08a" />
            <path d="M98 48 L98.5 50 L100 50.5 L98.5 51 L98 53 L97.5 51 L96 50.5 L97.5 50 Z" fill="#fef08a" />
            
            {/* Left and Bottom-Left stars */}
            <path d="M22 68 L22.5 70 L24 70.5 L22.5 71 L22 73 L21.5 71 L20 70.5 L21.5 70 Z" fill="#fef08a" />
            <path d="M15 48 L15.5 50 L17 50.5 L15.5 51 L15 53 L14.5 51 L13 50.5 L14.5 50 Z" fill="#fef08a" />
          </g>

          {/* Floating tiny heart icon inside circle */}
          <path 
            className="animate-glow-heart"
            d="M 88 56 C 88 53, 93 53, 93 56 C 93 59, 88 61, 88 62 C 88 61, 83 59, 83 56 C 83 53, 88 53, 88 56" 
            fill="#e5c158" 
            opacity="0.9" 
          />
        </svg>
      </div>

      {/* Decorative text label matching "Lovely" branding */}
      <div 
        className="text-center mt-2 cursor-pointer relative"
        style={{ width: size === 'sm' ? '120px' : size === 'md' ? '200px' : '260px' }}
      >
        {/* Sweeping calligraphic script title: "Lovely" */}
        <h2 
          className="font-serif italic font-extrabold text-pink-600 tracking-wide select-none drop-shadow-sm flex items-center justify-center"
          style={{ 
            fontSize: size === 'sm' ? '1.5rem' : size === 'md' ? '2.5rem' : '3.5rem',
            fontFamily: '"Playfair Display", "Georgia", serif',
            lineHeight: 0.95
          }}
        >
          Lovely
        </h2>
        
        {/* Clean subtitle tag */}
        <p 
          className="text-gray-500 font-extrabold uppercase tracking-[0.18em] leading-normal mt-1 border-t border-pink-300/40 pt-1 flex items-center justify-center gap-1 shrink-0"
          style={{ fontSize: size === 'sm' ? '6px' : size === 'md' ? '9px' : '11px' }}
        >
          <span>BE YOU.</span>
          <span className="text-pink-500">BE LOVELY.</span>
        </p>

        {/* Centered tiny heart separator line */}
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <div className="h-[1px] bg-gradient-to-r from-transparent to-pink-400/40 w-4" />
          <span className="text-pink-500" style={{ fontSize: size === 'sm' ? '6px' : '8px' }}>❤️</span>
          <div className="h-[1px] bg-gradient-to-l from-transparent to-pink-400/40 w-4" />
        </div>
      </div>
    </div>
  );
}
