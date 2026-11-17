import React, { useMemo } from 'react';

interface PrincessAmbientLayerProps {
  density?: 'gentle' | 'celebration';
}

export default function PrincessAmbientLayer({ density = 'gentle' }: PrincessAmbientLayerProps) {
  const petals = useMemo(() => {
    const count = density === 'celebration' ? 16 : 10;
    return Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      left: `${((idx * 13 + 5) % 92) + 4}%`,
      delay: `${(idx * 1.35) % 9}s`,
      duration: `${13 + (idx % 6) * 2.2}s`,
      size: 12 + (idx % 3) * 4,
      color: idx % 2 === 0 ? '#F4A7B9' : '#BE3E63',
      sway: idx % 2 === 0 ? '26px' : '-24px',
    }));
  }, [density]);

  const stars = useMemo(() => {
    return Array.from({ length: 18 }).map((_, idx) => ({
      id: idx,
      left: `${((idx * 19 + 7) % 94) + 3}%`,
      top: `${((idx * 23 + 11) % 86) + 5}%`,
      delay: `${(idx * 0.7) % 4}s`,
      duration: `${3.2 + (idx % 4) * 0.9}s`,
      size: idx % 3 === 0 ? 4 : 2.5,
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Subtle Sparkling Stars & Golden Dust */}
      {stars.map((star) => (
        <span
          key={`star-${star.id}`}
          className="princess-twinkle absolute rounded-full bg-[#D9B56D]"
          style={
            {
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: '0 0 8px rgba(217, 181, 109, 0.75)',
              '--twinkle-delay': star.delay,
              '--twinkle-dur': star.duration,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Slowly Falling SVG Rose Petals */}
      {petals.map((petal) => (
        <span
          key={`petal-${petal.id}`}
          className="princess-petal-fall absolute -top-8 opacity-0"
          style={
            {
              left: petal.left,
              '--petal-delay': petal.delay,
              '--petal-dur': petal.duration,
              '--petal-sway': petal.sway,
            } as React.CSSProperties
          }
        >
          <svg
            width={petal.size}
            height={petal.size * 1.25}
            viewBox="0 0 20 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 1C15.5 4.5 19 11.5 17 18.5C15.5 23.5 11.5 25 10 25C8.5 25 4.5 23.5 3 18.5C1 11.5 4.5 4.5 10 1Z"
              fill={petal.color}
              fillOpacity="0.45"
            />
            <path
              d="M10 3C12 8 12.5 16 10 23"
              stroke="#FFF0F3"
              strokeOpacity="0.28"
              strokeWidth="0.7"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
