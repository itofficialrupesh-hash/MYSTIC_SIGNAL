import React, { useMemo } from 'react';

export interface HeartBurstItem {
  id: number;
  left: number;
  symbol: string;
  delay: number;
  duration: number;
  drift: number;
}

interface PrincessAmbientLayerProps {
  bursts?: HeartBurstItem[];
}

export default function PrincessAmbientLayer({ bursts = [] }: PrincessAmbientLayerProps) {
  const floaters = useMemo(
    () => [
      { id: 1, left: '6%', symbol: '💗', dur: '14s', delay: '0s', size: '16px' },
      { id: 2, left: '16%', symbol: '🦋', dur: '16s', delay: '2.2s', size: '18px' },
      { id: 3, left: '28%', symbol: '🌸', dur: '15s', delay: '1s', size: '16px' },
      { id: 4, left: '42%', symbol: '✨', dur: '13s', delay: '3.5s', size: '14px' },
      { id: 5, left: '58%', symbol: '🩷', dur: '17s', delay: '1.8s', size: '15px' },
      { id: 6, left: '72%', symbol: '🦋', dur: '15.5s', delay: '4.1s', size: '17px' },
      { id: 7, left: '84%', symbol: '🌷', dur: '14.5s', delay: '0.6s', size: '16px' },
      { id: 8, left: '93%', symbol: '✨', dur: '16.5s', delay: '2.9s', size: '14px' },
    ],
    []
  );

  const sparkles = useMemo(
    () => [
      { id: 1, left: '10%', top: '14%', delay: '0s' },
      { id: 2, left: '88%', top: '18%', delay: '1.1s' },
      { id: 3, left: '22%', top: '42%', delay: '0.5s' },
      { id: 4, left: '78%', top: '52%', delay: '1.8s' },
      { id: 5, left: '14%', top: '76%', delay: '0.9s' },
      { id: 6, left: '86%', top: '82%', delay: '2.2s' },
    ],
    []
  );

  return (
    <>
      {/* Gentle Floating Pastel Hearts, Butterflies, Flowers & Sparkles */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        {floaters.map((item) => (
          <span
            key={item.id}
            className="princess-float-drift absolute -bottom-8 opacity-0 select-none"
            style={
              {
                left: item.left,
                fontSize: item.size,
                '--float-dur': item.dur,
                '--float-delay': item.delay,
              } as React.CSSProperties
            }
          >
            {item.symbol}
          </span>
        ))}

        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="princess-soft-sparkle absolute w-2.5 h-2.5 rounded-full bg-pink-300/70"
            style={
              {
                left: sp.left,
                top: sp.top,
                boxShadow: '0 0 12px rgba(244, 114, 182, 0.55)',
                '--sparkle-delay': sp.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Interactive Confetti & Heart Burst Overlay */}
      {bursts.length > 0 && (
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden z-50"
          aria-hidden="true"
        >
          {bursts.map((b) => (
            <span
              key={b.id}
              className="princess-burst-rise absolute bottom-4 text-xl sm:text-2xl select-none"
              style={
                {
                  left: `${b.left}%`,
                  '--burst-delay': `${b.delay}s`,
                  '--burst-dur': `${b.duration}s`,
                  '--burst-drift': `${b.drift}px`,
                } as React.CSSProperties
              }
            >
              {b.symbol}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
