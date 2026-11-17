import React from 'react';

export function PrincessCrownSvg({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'w-28 h-24 sm:w-32 sm:h-28' : 'w-20 h-16 sm:w-24 sm:h-20';
  return (
    <div className={`relative inline-flex items-center justify-center ${dims} princess-crown-float`} aria-hidden="true">
      <div
        className="absolute inset-2 rounded-full blur-xl opacity-55"
        style={{ background: 'radial-gradient(circle, #F9A8D4 0%, #E9D5FF 65%, transparent 100%)' }}
      />
      <svg viewBox="0 0 120 96" className="relative z-10 w-full h-full drop-shadow-[0_8px_18px_rgba(236,72,153,0.28)]">
        <defs>
          <linearGradient id="crownGoldPink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="crownBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* Crown Body */}
        <path
          d="M16 68L10 30L36 48L60 16L84 48L110 30L104 68H16Z"
          fill="url(#crownGoldPink)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Crown Base Rim */}
        <rect
          x="16"
          y="68"
          width="88"
          height="12"
          rx="6"
          fill="url(#crownBand)"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        {/* Crown Tip Pearls */}
        <circle cx="10" cy="27" r="5" fill="#FFF1F2" stroke="#F472B6" strokeWidth="1.5" />
        <circle cx="60" cy="13" r="6" fill="#FFF1F2" stroke="#EC4899" strokeWidth="1.8" />
        <circle cx="110" cy="27" r="5" fill="#FFF1F2" stroke="#F472B6" strokeWidth="1.5" />
        {/* Center Pink Heart Jewel */}
        <path
          d="M60 57L58.7 55.8C54.3 51.8 51.5 49.2 51.5 46C51.5 43.4 53.5 41.4 56.1 41.4C57.6 41.4 59.1 42.1 60 43.2C60.9 42.1 62.4 41.4 63.9 41.4C66.5 41.4 68.5 43.4 68.5 46C68.5 49.2 65.7 51.8 61.3 55.8L60 57Z"
          fill="#EC4899"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        {/* Side Lavender Jewels */}
        <circle cx="38" cy="57" r="3.5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1.2" />
        <circle cx="82" cy="57" r="3.5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export function TeddySorrySvg() {
  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 princess-teddy-sway select-none" aria-hidden="true">
      <svg viewBox="0 0 180 180" className="w-full h-full drop-shadow-[0_12px_22px_rgba(190,24,93,0.16)]">
        {/* Soft Shadow */}
        <ellipse cx="90" cy="166" rx="48" ry="8" fill="#FBCFE8" fillOpacity="0.6" />

        {/* Ears */}
        <circle cx="52" cy="42" r="18" fill="#D4A373" />
        <circle cx="52" cy="42" r="10" fill="#FBCFE8" />
        <circle cx="128" cy="42" r="18" fill="#D4A373" />
        <circle cx="128" cy="42" r="10" fill="#FBCFE8" />

        {/* Body */}
        <ellipse cx="90" cy="126" rx="40" ry="38" fill="#D4A373" />
        <ellipse cx="90" cy="128" rx="25" ry="26" fill="#FAEDCD" />

        {/* Head */}
        <circle cx="90" cy="68" r="36" fill="#DDA15E" />
        {/* Snout */}
        <ellipse cx="90" cy="77" rx="16" ry="12" fill="#FFF8EF" />
        {/* Cute Nose */}
        <ellipse cx="90" cy="73" rx="5.5" ry="4" fill="#6D3B2E" />
        {/* Sweet Puppy Smile */}
        <path d="M84 81C86 84 89 84 90 81C91 84 94 84 96 81" stroke="#6D3B2E" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Big Puppy Eyes */}
        <circle cx="75" cy="62" r="4.5" fill="#3B1D14" />
        <circle cx="73.6" cy="60.5" r="1.5" fill="#FFFFFF" />
        <circle cx="105" cy="62" r="4.5" fill="#3B1D14" />
        <circle cx="103.6" cy="60.5" r="1.5" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="64" cy="72" rx="6" ry="3.5" fill="#F472B6" fillOpacity="0.45" />
        <ellipse cx="116" cy="72" rx="6" ry="3.5" fill="#F472B6" fillOpacity="0.45" />

        {/* Paws Holding Sorry Card */}
        <ellipse cx="52" cy="124" rx="13" ry="10" transform="rotate(-20 52 124)" fill="#DDA15E" />
        <ellipse cx="128" cy="124" rx="13" ry="10" transform="rotate(20 128 124)" fill="#DDA15E" />

        {/* Feet */}
        <ellipse cx="64" cy="158" rx="14" ry="10" fill="#DDA15E" />
        <ellipse cx="64" cy="158" rx="8" ry="5.5" fill="#FBCFE8" />
        <ellipse cx="116" cy="158" rx="14" ry="10" fill="#DDA15E" />
        <ellipse cx="116" cy="158" rx="8" ry="5.5" fill="#FBCFE8" />

        {/* Sorry Card Held in Front */}
        <g transform="rotate(-4 90 128)">
          <rect
            x="56"
            y="104"
            width="68"
            height="46"
            rx="10"
            fill="#FFFDF9"
            stroke="#F472B6"
            strokeWidth="2.5"
          />
          <text
            x="90"
            y="124"
            textAnchor="middle"
            fill="#BE185D"
            fontSize="13"
            fontWeight="700"
            fontFamily="Georgia, serif"
          >
            Sorry 🥺
          </text>
          <path
            d="M90 142L88.8 140.9C84.7 137.2 82 134.8 82 131.8C82 129.4 83.9 127.5 86.3 127.5C87.7 127.5 89 128.1 90 129.1C91 128.1 92.3 127.5 93.7 127.5C96.1 127.5 98 129.4 98 131.8C98 134.8 95.3 137.2 91.2 140.9L90 142Z"
            fill="#EC4899"
          />
        </g>
      </svg>
    </div>
  );
}

export function TeddyCareSvg() {
  return (
    <div className="relative inline-flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 princess-teddy-sway select-none" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_10px_20px_rgba(168,85,247,0.16)]">
        <ellipse cx="80" cy="148" rx="42" ry="7" fill="#E9D5FF" fillOpacity="0.7" />
        <circle cx="48" cy="40" r="15" fill="#E6B89C" />
        <circle cx="48" cy="40" r="8" fill="#FCE7F3" />
        <circle cx="112" cy="40" r="15" fill="#E6B89C" />
        <circle cx="112" cy="40" r="8" fill="#FCE7F3" />
        <ellipse cx="80" cy="112" rx="34" ry="32" fill="#E6B89C" />
        <ellipse cx="80" cy="114" rx="22" ry="22" fill="#FFF5F8" />
        <circle cx="80" cy="64" r="31" fill="#EDCCB7" />
        <ellipse cx="80" cy="72" rx="14" ry="10" fill="#FFFDF9" />
        <ellipse cx="80" cy="69" rx="4.5" ry="3.2" fill="#6D3B2E" />
        <path d="M75 76C77 79 79 79 80 76C81 79 83 79 85 76" stroke="#6D3B2E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="68" cy="59" r="3.8" fill="#3B1D14" />
        <circle cx="92" cy="59" r="3.8" fill="#3B1D14" />
        <ellipse cx="59" cy="67" rx="5" ry="3" fill="#F472B6" fillOpacity="0.45" />
        <ellipse cx="101" cy="67" rx="5" ry="3" fill="#F472B6" fillOpacity="0.45" />
        {/* Warm Pastel Heart Pillow */}
        <path
          d="M80 126L77.5 123.7C69.2 116.2 64 111.5 64 105.6C64 100.8 67.8 97 72.6 97C75.3 97 77.9 98.3 80 100.4C82.1 98.3 84.7 97 87.4 97C92.2 97 96 100.8 96 105.6C96 111.5 90.8 116.2 82.5 123.7L80 126Z"
          fill="#F472B6"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        {/* Little Arms Hugging Heart */}
        <ellipse cx="56" cy="110" rx="11" ry="8" transform="rotate(-15 56 110)" fill="#EDCCB7" />
        <ellipse cx="104" cy="110" rx="11" ry="8" transform="rotate(15 104 110)" fill="#EDCCB7" />
      </svg>
    </div>
  );
}
