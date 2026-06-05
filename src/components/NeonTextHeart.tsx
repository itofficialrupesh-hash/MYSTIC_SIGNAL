import React, { useEffect, useState, useRef } from 'react';

interface NeonTextHeartProps {
  logoUrl?: string;
}

export default function NeonTextHeart({ logoUrl }: NeonTextHeartProps) {
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  // Smooth direct-DOM animation loop for high frame-rates and zero React re-render overhead
  useEffect(() => {
    let offset = 0;
    let animationFrameId: number;

    const tick = () => {
      offset -= 0.45; // Controls the speed of the drifting love text (increased for rapid, beautiful movement)
      if (offset <= -100) {
        offset = 0;
      }
      if (textPathRef.current) {
        textPathRef.current.setAttribute('startOffset', `${offset}%`);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Generate floating magical sparkles for the romantic background
  useEffect(() => {
    const generated = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x inside the container
      y: 70 + Math.random() * 30, // start near the bottom half
      size: Math.random() * 3.5 + 1.5, // sparkle size (px)
      delay: Math.random() * 6,
      duration: Math.random() * 7 + 4
    }));
    setParticles(generated);
  }, []);

  // Repeating romantic text string with pretty heart dividers
  const repeatText = "I Love You 💖 ";
  const pathLoveText = Array(30).fill(repeatText).join("");

  const displayLogoUrl = logoUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop";

  return (
    <div id="neon-text-heart-container" className="relative w-full max-w-lg mx-auto py-10 px-4 flex flex-col items-center justify-center bg-transparent select-none overflow-hidden">
      
      {/* Background ambient radial neon pink glow */}
      <div className="absolute w-72 h-72 rounded-full bg-pink-500/5 blur-[100px] pointer-events-none z-0" />

      {/* Floating Sparkles Canvas Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-pink-400/40 floating-sparkle select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--p-delay': `${p.delay}s`,
              '--p-duration': `${p.duration}s`,
              fontSize: `${p.size}px`
            } as React.CSSProperties}
          >
            ✨
          </span>
        ))}
      </div>

      {/* High-quality Centered Heart Card on black transparent background */}
      <div className="relative w-full aspect-square max-w-[320px] md:max-w-[360px] bg-slate-950/60 backdrop-blur-md rounded-[36px] border border-pink-500/20 shadow-[0_0_35px_rgba(236,72,153,0.12)] flex items-center justify-center p-6 z-10 overflow-hidden group">
        
        {/* Hover pulse effect */}
        <div className="absolute inset-0 bg-radial-gradient from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <svg 
          viewBox="0 0 600 600" 
          className="w-full h-full text-center"
        >
          <defs>
            {/* Symmetrical mathematically perfect heart curve path */}
            <path
              id="heart-curve-path"
              d="M 300, 485 C 120, 315 60, 215 60, 130 C 60, 60 110, 10 180, 10 C 240, 10 280, 50 300, 80 C 320, 50 360, 10 420, 10 C 490, 10 540, 60 540, 130 C 540, 215 480, 315 300, 485 Z"
            />
            {/* Premium Soft Glow filter node */}
            <filter id="neon-ambient-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Underlay subtle solid glow guide line */}
          <use 
            href="#heart-curve-path" 
            fill="none" 
            stroke="#ec4899" 
            strokeWidth="2" 
            opacity="0.15" 
            filter="url(#neon-ambient-glow)"
          />

          {/* Scrollable repeating Moving Text Path */}
          <text className="neon-flowing-love font-serif italic text-[14px] font-black select-none tracking-widest leading-none">
            <textPath 
              ref={textPathRef}
              href="#heart-curve-path" 
              startOffset="0%"
            >
              {pathLoveText}
            </textPath>
          </text>
        </svg>

        {/* Floating circular portrait logo nested beautifully inside the heart */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 transition-all duration-500 group-hover:scale-105">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-rose-400 shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center animate-pulse-slow">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
              <img 
                src={displayLogoUrl} 
                alt="Love Sanctuary Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
            </div>
            {/* Cute floating heart tag */}
            <span className="absolute -bottom-1 -right-1 text-lg bg-slate-950 border border-pink-500/40 rounded-full w-7 h-7 flex items-center justify-center shadow-lg transform rotate-6 animate-bounce">
              💖
            </span>
          </div>
        </div>
      </div>

      {/* Embedded CSS Style Module for maximum optimization (No external class footprint) */}
      <style>{`
        @keyframes floatMagicSparkle {
          0% {
            transform: translateY(0) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-240px) scale(1) rotate(180deg);
            opacity: 0;
          }
        }
        .floating-sparkle {
          animation: floatMagicSparkle var(--p-duration) ease-in-out infinite;
          animation-delay: var(--p-delay);
        }
        .neon-flowing-love {
          fill: #f472b6;
          text-shadow: 0 0 5px #ec4899, 0 0 12px #ec4899, 0 0 22px #db2777, 0 0 35px #f43f5e;
          filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.7));
          animation: pulseLoveScale 3s ease-in-out infinite alternate;
        }
        @keyframes pulseLoveScale {
          0% {
            opacity: 0.85;
            text-shadow: 0 0 4px #ec4899, 0 0 10px #ec4899, 0 0 18px #db2777;
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 7px #ec4899, 0 0 16px #db2777, 0 0 28px #db2777, 0 0 40px #f43f5e;
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(236,72,153,0.5);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 0 30px rgba(236,72,153,0.8), 0 0 10px rgba(236,72,153,0.4);
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
